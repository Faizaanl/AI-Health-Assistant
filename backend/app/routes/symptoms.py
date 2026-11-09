
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.app.services.prediction_service import predict_disease
from backend.app.services.health_assistant import generate_health_response

router = APIRouter(tags=["Symptom Analysis"])


class SymptomRequest(BaseModel):
    symptoms: list[str] = Field(
        min_length=1,
        description="List of symptoms reported by user"
    )


@router.post("/symptoms/analyze")
def analyze_symptoms(request: SymptomRequest):

    # Clean submitted symptoms
    cleaned_symptoms = [
        symptom.strip().lower()
        for symptom in request.symptoms
        if isinstance(symptom, str) and symptom.strip()
    ]

    if not cleaned_symptoms:
        raise HTTPException(
            status_code=422,
            detail="Please provide at least one valid symptom."
        )

    try:
        prediction_result = predict_disease(
            cleaned_symptoms
        )

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        )

    # Extract prediction information
    predicted_disease = prediction_result["disease"]
    confidence = prediction_result["confidence"]

    recognized_symptoms = prediction_result[
        "recognized_symptoms"
    ]

    unrecognized_symptoms = prediction_result[
        "unrecognized_symptoms"
    ]

    # Generate educational health guidance
    assistant_response = generate_health_response(
        predicted_disease
    )

    return {
        "received_symptoms": cleaned_symptoms,

        "recognized_symptoms": recognized_symptoms,

        "unrecognized_symptoms": unrecognized_symptoms,

        "predicted_disease": predicted_disease,

        "confidence": confidence,

        "health_assistant_response": assistant_response,

        "status": "educational_prediction",

        "warning": (
            "This is an experimental AI prediction, "
            "not a medical diagnosis. Model confidence "
            "does not indicate medical certainty. Consult "
            "a qualified healthcare professional."
        )
    }
