
# AI Disease Prediction & Health Assistant

An educational AI-powered health information platform that uses machine learning to analyze user-submitted symptoms and provide experimental disease-category predictions with general health guidance.

## Project Overview

The project combines a machine learning model, FastAPI backend, and React frontend to create an interactive symptom analysis application.

Users can:
- Enter symptoms manually.
- Select symptoms from suggested options.
- Receive an experimental ML prediction.
- View model confidence scores.
- Identify recognized and unrecognized symptoms.
- Read general educational health guidance.

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic

### Machine Learning
- Scikit-learn
- NumPy
- Pandas
- Random Forest Classifier
- Joblib

## Project Structure

```text
AI-Health-Assistant/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   └── main.py
│
├── ml/
│   ├── datasets/
│   ├── notebooks/
│   ├── training/
│   └── saved_models/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── reports/
├── tests/
├── requirements.txt
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI-Health-Assistant
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Prepare the ML Model

Place the trained model file at:

```text
ml/saved_models/disease_prediction_model.pkl
```

The model must contain the trained classifier, label encoder, and feature list.

### 5. Start the Backend

Run from the project root:

```bash
python -m uvicorn backend.main:app --reload
```

Backend:

http://127.0.0.1:8000

API Documentation:

http://127.0.0.1:8000/docs

### 6. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

http://localhost:5173

## API Endpoint

### Analyze Symptoms

**POST**

```text
/api/v1/symptoms/analyze
```

Example request:

```json
{
  "symptoms": [
    "itching",
    "skin_rash",
    "headache"
  ]
}
```

The API returns:
- Recognized symptoms
- Unrecognized symptoms
- Experimental prediction
- Model confidence
- General health guidance
- Important medical information

## Machine Learning Model

The project uses a Random Forest Classifier trained on a public disease-symptom dataset.

The model identifies a disease category based on the symptom features supplied to it.

Model evaluation is included in the training workflow. However, the available dataset and test results do not establish clinical reliability.

## Future Improvements

- User authentication
- Symptom history dashboard
- PDF health information reports
- Database integration
- Improved model evaluation
- More comprehensive symptom validation
- Clinically reviewed health information

## Disclaimer

This project is developed for educational and academic purposes only.

It is not a medical diagnostic system. Model predictions and confidence scores must not be used to make medical or treatment decisions.

Always consult a qualified healthcare professional for medical advice.
