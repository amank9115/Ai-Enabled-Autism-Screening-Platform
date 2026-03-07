# ManasSaathi Backend

Express backend with MongoDB Atlas, auth APIs, and camera-screening ML scoring.

## Run

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:4000`.
MongoDB connection is read from `backend/.env` (`MONGODB_URI`).

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/analysis/live-behavior`
- `GET /api/v1/analysis/emotion-timeline`
- `GET /api/v1/analysis/weekly-progress`
- `GET /api/v1/analysis/child-profiles`
- `GET /api/v1/analysis/session-history`
- `GET /api/v1/analysis/messages`
- `POST /api/v1/ml/camera-screening`
- `GET /api/v1/ml/sessions/:sessionId`
- `POST /api/v1/ml/inference`
- `POST /api/v1/auth/email-otp`
- `POST /api/v1/auth/phone-otp`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`

## ML Camera Payload

`POST /api/v1/ml/camera-screening`

```json
{
  "userId": "u-parent-1",
  "frames": [
    {
      "eyeContact": 72,
      "attentionSpan": 68,
      "emotionSignals": 74,
      "gestureAnalysis": 63,
      "confidence": 80
    }
  ]
}
```

## Notes

- Auth users are stored in MongoDB (`users` collection) with hashed passwords.
- Camera screening results are stored in MongoDB (`screeningsessions` collection).
- ML scoring now reads `backend/ml-data/Autism_Data.arff` and blends dataset priors with live camera metrics.
- You can replace `src/ml.js` with Python model inference integration later.
