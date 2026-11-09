import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load cleaned dataset
data_path = Path(__file__).parent / "datasets"
df = pd.read_csv(data_path / "cleaned_training.csv")

# Separate symptoms and disease labels
X = df.drop(columns=["prognosis"])
y = df["prognosis"]

# Convert disease names into numbers
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Split dataset into training and validation sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# Display results
print("DATA PREPARATION COMPLETED!")
print("Total symptom features:", X.shape[1])
print("Total disease categories:", len(encoder.classes_))
print("Training records:", X_train.shape[0])
print("Validation records:", X_test.shape[0])

print("\nDisease names:")
print(encoder.classes_)