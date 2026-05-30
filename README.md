# SupplyGuard

## AI-Powered Supply Chain Risk Monitoring & Analysis Platform

SupplyGuard is an intelligent supply chain monitoring platform designed to identify, analyze, and visualize potential risks affecting global supply chains. The platform combines AI-driven analysis, real-time data processing, interactive visualizations, and geographic risk mapping to help organizations make informed decisions.

---

# Problem Statement

Global supply chains are vulnerable to disruptions caused by geopolitical events, natural disasters, transportation issues, market fluctuations, and operational bottlenecks.

Traditional monitoring systems often struggle to provide centralized, real-time visibility into these risks.

SupplyGuard addresses this challenge by providing:

- Risk identification and analysis
- Interactive risk visualization
- Geographic monitoring
- AI-assisted decision support
- Real-time supply chain insights

---

# Features

### Risk Monitoring
- Identify potential supply chain disruptions
- Analyze risk severity levels
- Monitor critical supply chain events

### AI-Powered Analysis
- Automated risk assessment
- Intelligent insight generation
- Data-driven decision support

### Interactive Dashboards
- Risk metrics visualization
- Trend analysis
- Performance monitoring

### Geographic Visualization
- Interactive maps
- Global supply chain visibility
- Regional risk tracking

### Modern User Interface
- Responsive design
- Real-time data presentation
- Interactive visual components

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Recharts
- React Globe
- Leaflet

## Backend

- FastAPI
- Python

## AI & Analytics

- Machine Learning
- Risk Analysis Engine
- Data Processing Pipelines

## APIs

- REST API Architecture

---

# System Architecture

User
↓
React Frontend
↓
REST API Layer
↓
FastAPI Backend
↓
Risk Analysis Services
↓
Data Processing & Analytics
↓
Visualization & Insights

---

# Project Structure

bash frontend/ ├── src/ ├── components/ ├── pages/ ├── services/  backend/ ├── app/ │   ├── routes/ │   ├── services/ │   ├── models/ │   ├── data/ │   └── main.py 

---

# Installation Guide

## Clone Repository

bash git clone https://github.com/arpit7799/SupplyGuard.git cd SupplyGuard 

## Backend Setup

bash cd backend  python -m venv venv  source venv/bin/activate  pip install -r requirements.txt  uvicorn app.main:app --reload 

Backend runs on:

text http://localhost:8000 

---

## Frontend Setup

bash cd frontend  npm install  npm run dev 

Frontend runs on:

text http://localhost:5173 

---

# API Endpoints

## Health Check

http GET / 

## Risk Analysis

http GET /api/risks 

## Dashboard Data

http GET /api/dashboard 

## Supply Chain Insights

http GET /api/insights 

Note: Endpoint availability depends on backend configuration.

---

# Future Improvements

- Real-time event streaming
- Predictive risk forecasting
- LLM-powered supply chain assistant
- Multi-user authentication
- Enterprise dashboard
- Cloud deployment
- Alerting and notification system
- Advanced AI analytics

---

# Screenshots

## Dashboard

Add dashboard screenshot here.

## Risk Analysis View

Add risk analysis screenshot here.

## Global Risk Map

Add map visualization screenshot here.

---

# Author

Arpit Pandey

Computer Science & Engineering Student

AI • Software Engineering • Full Stack Development
