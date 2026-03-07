from __future__ import annotations

import base64
import math
from typing import Dict, List, Optional

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field

try:
    import cv2  # type: ignore
except Exception:  # pragma: no cover
    cv2 = None

app = FastAPI(title="ManasSaathi Python ML", version="0.1.0")

SESSION_WINDOWS: Dict[str, List["FrameInput"]] = {}
MAX_WINDOW = 45


class FrameInput(BaseModel):
    frame_index: int = 0
    eye_contact: float = Field(ge=0, le=100)
    attention_span: float = Field(ge=0, le=100)
    emotion_signals: float = Field(ge=0, le=100)
    gesture_analysis: float = Field(ge=0, le=100)
    confidence: float = Field(default=70, ge=0, le=100)
    image_base64: Optional[str] = None


class WindowRequest(BaseModel):
    session_key: Optional[str] = None
    frames: List[FrameInput]


class LiveRequest(BaseModel):
    session_key: str
    frame: FrameInput


def clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return float(max(low, min(high, value)))


def sigmoid(value: float) -> float:
    return 1.0 / (1.0 + math.exp(-value))


def decode_image(image_base64: str) -> Optional[np.ndarray]:
    if not image_base64 or cv2 is None:
        return None

    raw = image_base64
    if "," in image_base64:
        raw = image_base64.split(",", 1)[1]

    try:
        payload = base64.b64decode(raw)
        arr = np.frombuffer(payload, dtype=np.uint8)
        image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return image
    except Exception:
        return None


def extract_cv_adjustments(frame: FrameInput) -> Dict[str, float]:
    if not frame.image_base64 or cv2 is None:
        return {"eye": frame.eye_contact, "attention": frame.attention_span, "emotion": frame.emotion_signals, "gesture": frame.gesture_analysis, "confidence": frame.confidence}

    image = decode_image(frame.image_base64)
    if image is None:
        return {"eye": frame.eye_contact, "attention": frame.attention_span, "emotion": frame.emotion_signals, "gesture": frame.gesture_analysis, "confidence": frame.confidence}

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape[:2]

    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    cascade = cv2.CascadeClassifier(cascade_path)
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(40, 40))

    face_center_score = 25.0
    face_size_score = 20.0
    confidence = 35.0

    if len(faces) > 0:
        x, y, fw, fh = max(faces, key=lambda face: face[2] * face[3])
        cx = x + fw / 2.0
        cy = y + fh / 2.0

        nx = abs(cx - (w / 2.0)) / max(w / 2.0, 1)
        ny = abs(cy - (h / 2.0)) / max(h / 2.0, 1)
        face_center_score = clamp(100.0 - (nx * 65.0 + ny * 35.0))

        ratio = (fw * fh) / max(float(w * h), 1.0)
        face_size_score = clamp(ratio * 700.0)
        confidence = clamp(70.0 + min(25.0, face_size_score / 4.0))

    blur_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    texture_signal = clamp(blur_var / 8.0)

    eye = clamp(frame.eye_contact * 0.65 + face_center_score * 0.25 + face_size_score * 0.1)
    attention = clamp(frame.attention_span * 0.6 + face_center_score * 0.25 + texture_signal * 0.15)
    emotion = clamp(frame.emotion_signals * 0.75 + (100.0 - abs(texture_signal - 35.0)) * 0.25)
    gesture = clamp(frame.gesture_analysis * 0.7 + texture_signal * 0.3)

    return {
        "eye": eye,
        "attention": attention,
        "emotion": emotion,
        "gesture": gesture,
        "confidence": clamp((frame.confidence * 0.6) + (confidence * 0.4)),
    }


def score_frames(frames: List[FrameInput]) -> Dict[str, object]:
    if not frames:
        raise ValueError("frames must not be empty")

    adjusted = [extract_cv_adjustments(frame) for frame in frames]

    eye = float(np.mean([item["eye"] for item in adjusted]))
    attention = float(np.mean([item["attention"] for item in adjusted]))
    emotion = float(np.mean([item["emotion"] for item in adjusted]))
    gesture = float(np.mean([item["gesture"] for item in adjusted]))
    confidence = float(np.mean([item["confidence"] for item in adjusted]))

    linear = -4.1 + 0.038 * (100 - eye) + 0.041 * (100 - attention) + 0.028 * (100 - emotion) + 0.031 * (100 - gesture)
    probability = clamp(sigmoid(linear) * 100.0, 1.0, 99.0)
    risk_score = int(round(probability))

    if risk_score >= 65:
        risk_label = "high"
    elif risk_score >= 35:
        risk_label = "moderate"
    else:
        risk_label = "low"

    return {
        "success": True,
        "model_version": "python-opencv-behavior-v1",
        "risk_score": risk_score,
        "risk_label": risk_label,
        "feature_averages": {
            "eye_contact": int(round(eye)),
            "attention_span": int(round(attention)),
            "emotion_signals": int(round(emotion)),
            "gesture_analysis": int(round(gesture)),
            "confidence": int(round(confidence)),
        },
        "recommendations": [
            "Track 2-3 sessions before escalation decisions.",
            "Use clinician review for low-confidence segments.",
            "Repeat in similar lighting and seating conditions for comparability.",
        ],
        "policy": "Screening support only. Not a medical diagnosis.",
    }


@app.get("/health")
def health() -> Dict[str, object]:
    return {
        "ok": True,
        "service": "manassaathi-python-ml",
        "opencv": cv2 is not None,
    }


@app.post("/predict/window")
def predict_window(payload: WindowRequest) -> Dict[str, object]:
    result = score_frames(payload.frames)
    result["window_size"] = len(payload.frames)
    if payload.session_key:
        result["session_key"] = payload.session_key
    return result


@app.post("/predict/live")
def predict_live(payload: LiveRequest) -> Dict[str, object]:
    session_key = payload.session_key.strip()
    if not session_key:
        raise ValueError("session_key is required")

    history = SESSION_WINDOWS.get(session_key, [])
    history.append(payload.frame)
    history = history[-MAX_WINDOW:]
    SESSION_WINDOWS[session_key] = history

    result = score_frames(history)
    result["window_size"] = len(history)
    result["session_key"] = session_key
    return result
