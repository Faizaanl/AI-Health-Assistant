import joblib
import pandas as pd

from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report


# Locate project folders
PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = PROJECT_ROOT / "ml" / "datasets"
MODEL_PATH = PROJECT_ROOT / "ml" / "saved_models" / "disease_prediction_model.pkl"

TRAIN_FILE = DATASET_PATH / "Training.csv"
TEST_FILE = DATASET_PATH / "Testing.csv"


# Check whether dataset files exist
if not TRAIN_FILE.exists() or not TEST_FILE.exists():
    raise FileNotFoundError(
        "Training.csv or Testing.csv was not found in ml/datasets."
    )


# Load original training and testing datasets
print("Loading datasets...")

train_data = pd.read_csv(TRAIN_FILE)
test_data = pd.read_csv(TEST_FILE)


# Remove unnecessary empty columns
train_data = train_data.loc[
    :, ~train_data.columns.str.startswith("Unnamed")
]

test_data = test_data.loc[
    :, ~test_data.columns.str.startswith("Unnamed")
]


# Separate features and target
if "prognosis" not in train_data.columns or "prognosis" not in test_data.columns:
    raise ValueError("The datasets must contain a 'prognosis' column.")


X_train = train_data.drop(columns=["prognosis"])
y_train = train_data["prognosis"].astype(str).str.strip()

X_test = test_data.drop(columns=["prognosis"])
y_test = test_data["prognosis"].astype(str).str.strip()


# Match testing columns with training columns
features = X_train.columns.tolist()

X_test = X_test.reindex(columns=features, fill_value=0)

# Replace missing feature values with zero
X_train = X_train.fillna(0)
X_test = X_test.fillna(0)


# Encode disease categories
encoder = LabelEncoder()

y_train_encoded = encoder.fit_transform(y_train)

# Check for categories in testing data that were not in training
unknown_classes = set(y_test) - set(encoder.classes_)

if unknown_classes:
    raise ValueError(
        f"Testing dataset contains unknown categories: {unknown_classes}"
    )

y_test_encoded = encoder.transform(y_test)


# Create the Random Forest model
print("Training the Random Forest model...")

model = RandomForestClassifier(
    n_estimators=300,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)


# Train using the complete original training dataset
model.fit(X_train, y_train_encoded)


# Evaluate using the separate testing dataset
print("\nEvaluating model on Testing.csv...")

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test_encoded, predictions)

print("\n========== MODEL EVALUATION ==========")

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")
print(f"Number of features: {len(features)}")
print(f"Number of disease categories: {len(encoder.classes_)}")

print(f"\nTesting Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")

print(
    classification_report(
        y_test_encoded,
        predictions,
        labels=list(range(len(encoder.classes_))),
        target_names=encoder.classes_,
        zero_division=0
    )
)


# Save model and supporting information
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

joblib.dump(
    {
        "model": model,
        "encoder": encoder,
        "features": features
    },
    MODEL_PATH
)

print("\nMODEL TRAINING AND EVALUATION COMPLETED!")
print(f"Model saved at: {MODEL_PATH}")