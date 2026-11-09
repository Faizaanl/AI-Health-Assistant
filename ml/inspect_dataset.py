import pandas as pd
from pathlib import Path

# Dataset location
data_folder = Path(__file__).parent / "datasets"

# Load training dataset
df = pd.read_csv(data_folder / "Training.csv")

# Remove unnecessary empty columns
df = df.loc[:, ~df.columns.str.startswith("Unnamed")]

# Remove exact duplicate records
df = df.drop_duplicates()

# Reset row numbering
df = df.reset_index(drop=True)

# Save cleaned dataset
df.to_csv(data_folder / "cleaned_training.csv", index=False)

# Display results
print("DATA CLEANING COMPLETED!")
print("Cleaned dataset shape:", df.shape)
print("Total disease categories:", df["prognosis"].nunique())
print("Remaining duplicate rows:", df.duplicated().sum())

print("\nCleaned dataset saved successfully!")