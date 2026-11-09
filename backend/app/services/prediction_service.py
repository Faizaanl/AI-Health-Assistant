
import joblib
import numpy as np
from pathlib import Path

# Locate the trained ML model
MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "ml"
    / "saved_models"
    / "disease_prediction_model.pkl"
)

# Load trained model and supporting data
saved_data = joblib.load(MODEL_PATH)

model = saved_data["model"]
encoder = saved_data["encoder"]
features = saved_data["features"]

# Store recognized symptoms for validation
FEATURE_LOOKUP = {
    feature.lower().replace("_", " "): feature
    for feature in features
}


def predict_disease(symptoms: list[str]):

    if not symptoms:
        raise ValueError(
            "Please enter at least one symptom."
        )

    input_data = {
        feature: 0 for feature in features
    }

    recognized_symptoms = []
    unrecognized_symptoms = []

    # Validate and match symptoms
    for symptom in symptoms:

        cleaned_symptom = (
            symptom.strip()
            .lower()
            .replace("-", " ")
        )

        matched_feature = (
            cleaned_symptom.replace(" ", "_")
        )

        if matched_feature in input_data:

            if matched_feature not in recognized_symptoms:
                input_data[matched_feature] = 1
                recognized_symptoms.append(
                    matched_feature
                )

        else:
            unrecognized_symptoms.append(
                symptom.strip()
            )

    # Reject input when no symptom is recognized
    if not recognized_symptoms:
        raise ValueError(
            "None of the entered symptoms are recognized. "
            "Please use the suggested symptoms."
        )

    # Convert input into NumPy array
    input_array = np.array(
        [[input_data[feature] for feature in features]],
        dtype=float
    )

    # Predict disease category
    prediction = model.predict(input_array)[0]

    disease = encoder.inverse_transform(
        [prediction]
    )[0]

    # Calculate model prediction confidence
    probabilities = model.predict_proba(
        input_array
    )[0]

    predicted_class_position = list(
        model.classes_
    ).index(prediction)

    confidence = round(
        float(
            probabilities[predicted_class_position]
        ) * 100,
        2
    )

    return {
        "disease": disease,
        "confidence": confidence,
        "recognized_symptoms": recognized_symptoms,
        "unrecognized_symptoms": unrecognized_symptoms
    }
