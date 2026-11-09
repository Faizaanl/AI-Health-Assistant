
import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const suggestedSymptoms = [
  "itching",
  "skin_rash",
  "nodal_skin_eruptions",
  "continuous_sneezing",
  "shivering",
  "joint_pain",
  "stomach_pain",
  "headache",
  "fatigue",
  "vomiting",
  "cough",
  "high_fever",
];

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSymptom = (symptom) => {
    setSymptoms((previous) =>
      previous.includes(symptom)
        ? previous.filter((item) => item !== symptom)
        : [...previous, symptom]
    );

    setResult(null);
    setError("");
  };

  const addCustomSymptom = () => {
    const cleaned = customSymptom.trim().toLowerCase();

    if (!cleaned) return;

    if (!symptoms.includes(cleaned)) {
      setSymptoms((previous) => [...previous, cleaned]);
    }

    setCustomSymptom("");
    setResult(null);
    setError("");
  };

  const removeSymptom = (symptom) => {
    setSymptoms((previous) =>
      previous.filter((item) => item !== symptom)
    );

    setResult(null);
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    if (!API_URL) {
      setError(
        "API URL is missing. Please configure VITE_API_URL in Vercel."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/api/v1/symptoms/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symptoms: symptoms,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to analyze symptoms."
        );
      }

      setResult(data);
    } catch (err) {
      console.error("API Error:", err);

      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the backend. Please check your API URL and backend availability."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSymptoms([]);
    setCustomSymptom("");
    setResult(null);
    setError("");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Health Assistant</h1>
        <p>
          AI-powered educational symptom analysis platform
        </p>
      </header>

      <main className="dashboard">
        <section className="symptom-section">
          <h2>Symptom Checker</h2>

          <p>
            Select the symptoms you are experiencing.
          </p>

          <div className="symptom-grid">
            {suggestedSymptoms.map((symptom) => (
              <button
                key={symptom}
                type="button"
                className={
                  symptoms.includes(symptom)
                    ? "symptom-button selected"
                    : "symptom-button"
                }
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom.replaceAll("_", " ")}
              </button>
            ))}
          </div>

          <div className="custom-symptom">
            <input
              type="text"
              value={customSymptom}
              placeholder="Enter another symptom"
              onChange={(e) =>
                setCustomSymptom(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCustomSymptom();
                }
              }}
            />

            <button
              type="button"
              onClick={addCustomSymptom}
            >
              Add
            </button>
          </div>

          {symptoms.length > 0 && (
            <div className="selected-symptoms">
              <h3>Selected Symptoms</h3>

              <div className="selected-list">
                {symptoms.map((symptom) => (
                  <span
                    className="selected-tag"
                    key={symptom}
                  >
                    {symptom.replaceAll("_", " ")}

                    <button
                      type="button"
                      onClick={() => removeSymptom(symptom)}
                      aria-label={`Remove ${symptom}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button
              type="button"
              className="analyze-button"
              onClick={analyzeSymptoms}
              disabled={loading}
            >
              {loading
                ? "Analyzing..."
                : "Analyze Symptoms"}
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </button>
          </div>

          {loading && (
            <div className="loading-message">
              Analyzing your selected symptoms...
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </section>

        {result && (
          <section className="result-section result-animated">
            <h2>Analysis Result</h2>

            <div className="result-card">
              <h3>Experimental Prediction</h3>

              <p className="predicted-disease">
                {result.predicted_disease}
              </p>

              <p>
                Model confidence score:{" "}
                <strong>
                  {result.confidence}%
                </strong>
              </p>

              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{
                    width: `${Math.min(
                      Math.max(Number(result.confidence) || 0, 0),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="result-card">
              <h3>Recognized Symptoms</h3>

              <p>
                {result.recognized_symptoms?.join(", ") ||
                  "None"}
              </p>
            </div>

            {result.unrecognized_symptoms?.length > 0 && (
              <div className="result-card">
                <h3>Unrecognized Symptoms</h3>

                <p>
                  {result.unrecognized_symptoms.join(", ")}
                </p>
              </div>
            )}

            <div className="result-card">
              <h3>Health Assistant Explanation</h3>

              <p>
                {result.health_assistant_response?.explanation}
              </p>
            </div>

            <div className="result-card">
              <h3>General Health Guidance</h3>

              <ul>
                {result.health_assistant_response?.health_guidance?.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>

            <div className="result-card">
              <h3>Important Information</h3>

              <ul>
                {result.health_assistant_response?.important_information?.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>

            <div className="medical-warning">
              <h3>Medical Disclaimer</h3>

              <p>
                {result.health_assistant_response?.medical_warning ||
                  result.warning}
              </p>
            </div>
          </section>
        )}

        <footer className="app-footer">
          <p>
            This application is an educational project,
            not a medical diagnostic system. Model
            confidence is not medical certainty.
          </p>
          <p>
            Consult a qualified healthcare professional
            for medical advice.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
