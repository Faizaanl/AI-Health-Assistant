
def generate_health_response(predicted_disease: str):

    response = {
        "predicted_condition": predicted_disease,

        "explanation": (
            f"The machine learning model selected "
            f"{predicted_disease} as its closest matching "
            "category based on the symptoms entered. "
            "This result is experimental and may be inaccurate."
        ),

        "health_guidance": [
            "Monitor your symptoms and note when they started.",
            "Keep track of any changes in symptom severity.",
            "Stay hydrated and get adequate rest if appropriate.",
            "Consult a qualified healthcare professional "
            "for a proper medical evaluation.",
            "Seek urgent medical help if symptoms are severe "
            "or rapidly getting worse."
        ],

        "important_information": [
            "The prediction is generated using a machine-learning dataset.",
            "The model has not been validated for clinical use.",
            "Model confidence is not the probability of having a disease.",
            "Do not use this prediction to choose medicines or treatments."
        ],

        "medical_warning": (
            "This application is an educational project, "
            "not a medical diagnostic system. Always rely on "
            "qualified healthcare professionals for medical advice."
        )
    }

    return response
