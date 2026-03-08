🧠 AI-Enabled Autism Screening Platform

An intelligent AI-powered platform for early Autism Spectrum Disorder (ASD) screening and behavioral analysis using computer vision, machine learning, and real-time analytics.

The platform helps parents, clinicians, and doctors detect early behavioral indicators of autism by analyzing facial expressions, eye contact, emotional responses, and attention patterns through live camera screening and machine learning models.

🌍 Project Overview

ManasSaathi is a comprehensive autism screening system that integrates:

🎥 Real-time video analysis

🤖 Machine learning based risk prediction

📊 Advanced behavioral analytics dashboards

👨‍⚕️ Doctor and clinician monitoring tools

📈 Long-term developmental tracking

The system analyzes behavioral patterns through camera-based screening and generates risk assessments and developmental insights to support early intervention.

✨ Key Features
🎥 Live Camera Screening

Real-time behavioral screening using computer vision models that analyze:

Eye contact

Facial expressions

Attention patterns

Emotional responses

The system generates AI-based autism risk scores from these observations.

📊 Advanced Behavioral Analytics

Interactive dashboards with visual insights including:

Risk indicator meters

Attention heatmaps

Emotion timeline charts

Behavioral radar charts

Weekly developmental progress reports

👥 Multi-Role System

The platform supports three user roles:

Parents

Child screening

Progress monitoring

Development insights

Clinicians

Behavioral analysis tools

Case monitoring

Session reports

Doctors

Clinical dashboards

Longitudinal behavior tracking

Diagnostic insights

🔐 Secure Authentication

Secure login system with:

Email OTP authentication

Phone verification

JWT-based authentication

MongoDB user storage

📈 Progress Tracking

Track developmental behavior across time:

Weekly progress reports

Session history

Behavioral pattern comparison

AI-generated insights

🤖 AI Behavior Analysis Engine

The AI engine performs:

Face detection

Emotion recognition

Gesture detection

Attention tracking

Behavioral feature extraction

These features are used to generate autism risk predictions using ML models.

💬 Collaboration Tools

Built-in collaboration features for healthcare professionals:

Doctor–clinician messaging

Case discussion platform

Shared behavioral reports

📱 Responsive Interface

Fully responsive UI built using modern technologies:

Mobile friendly

Tablet compatible

Desktop dashboards

🏗️ System Architecture

React Frontend
↓
Node.js Backend API
↓
Python ML Service
↓
Computer Vision Analysis
↓
MongoDB Database
↓
Behavioral Insights Dashboard

⚙️ Tech Stack
Frontend

Modern web interface built using:

React 19

TypeScript

Vite

Tailwind CSS

Chart.js / Recharts

Key features implemented:

Camera screening interface

Analytics dashboards

Parent and doctor portals

Behavioral visualization charts

Backend API

Server-side system responsible for:

Authentication

API endpoints

session management

database communication

Technologies:

Node.js

Express.js

MongoDB Atlas

JWT Authentication

Machine Learning Service

AI engine responsible for behavior analysis.

Technologies:

Python

FastAPI

OpenCV

TensorFlow

MediaPipe

ML tasks include:

Face detection

Emotion recognition

Gesture detection

Autism risk classification

Data Sources

The platform uses Autism Diagnostic datasets in ARFF format to train and evaluate machine learning models.

Example behavioral features extracted:

Eye contact duration

Emotion variability

Social interaction signals

Attention tracking metrics

🚀 Quick Start
Frontend Setup

cd autism-frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173

Backend Setup

cd backend
npm install
npm run dev

Backend runs on:
http://localhost:5000

Python ML Service Setup

cd backend-python

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload

ML service runs on:
http://localhost:8001

📡 Core API Endpoints
ML Camera Screening

POST /api/v1/ml/camera-screening

Analyzes live camera frames and returns behavioral metrics.

Behavioral Analysis

GET /api/v1/analysis/live-behavior
GET /api/v1/analysis/emotion-timeline
GET /api/v1/analysis/weekly-progress

Returns behavioral insights and progress analytics.

Authentication

POST /api/v1/auth/email-otp
POST /api/v1/auth/verify-otp
POST /api/v1/auth/login
POST /api/v1/auth/register

Handles secure login and registration.

📂 Project Structure

Ai-Enabled-Autism-Screening-Platform

autism-frontend
│
├── src
├── components
├── pages
└── services

backend
│
├── src
├── routes
├── controllers
└── models

backend-python
│
├── app
├── models
└── services

🎯 Use Cases

The platform can be used in:

Pediatric Clinics

Assist doctors in early ASD screening.

Child Development Centers

Monitor behavioral patterns over time.

Telehealth Platforms

Enable remote autism screening.

Research Institutions

Collect behavioral datasets for autism studies.

🔮 Future Improvements

Planned enhancements include:

Speech analysis integration

AI-powered therapy recommendations

Mobile application

Deep learning behavior models

Telemedicine integration

🤝 Contributors

Project developed for AI Healthcare Innovation & Early Autism Detection.

Contributors:

Aman
Team Members

📜 License

This project is developed for educational and research purposes.
