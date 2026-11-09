
import { useState } from "react";
import "./App.css";

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
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSymptom = (symptom) => {
    const current = symptoms
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!current.includes(symptom)) {
      setSymptoms([...current, symptom].join(", "));
      setError("");
    }
  };

  const clearSymptoms = () => {
    setSymptoms("");
    setError("");
    setResult(null);
  };

  const resetAnalysis = () => {
    setResult(null);
    setError("");
  };

  const analyzeSymptoms = async (e) => {
    e.preventDefault();

    const symptomList = symptoms
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (symptomList.length === 0) {
      setError("Please enter at least one symptom.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/symptoms/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symptoms: symptomList,
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
      setError(
        err.message || "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const confidence = result
    ? Math.max(
        0,
        Math.min(100, Number(result.confidence) || 0)
      )
    : 0;

  const assistantResponse =
    result?.health_assistant_response;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">✚</div>

            <div>
              <h1>AI Health Assistant</h1>
              <p>Intelligent Health Information Platform</p>
            </div>
          </div>

          <div className="system-status">
            <span className="status-dot"></span>
            Educational Platform
          </div>
        </div>
      </header>

      <main className="container">
        <section className="welcome">
          <div className="welcome-label">
            AI-POWERED HEALTH INFORMATION
          </div>

          <h2>Understand Your Symptoms</h2>

          <p>
            Explore an experimental machine-learning prediction
            and receive general educational health guidance.
          </p>
        </section>

        <section className="dashboard-info">
          <div className="info-card">
            <span className="info-icon">🤖</span>
            <div>
              <h3>AI Analysis</h3>
              <p>Machine learning</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">📋</span>
            <div>
              <h3>Symptom Input</h3>
              <p>Easy reporting</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">💡</span>
            <div>
              <h3>Health Guidance</h3>
              <p>General information</p>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h2>Symptom Analysis</h2>
              <p>Enter the symptoms you are experiencing.</p>
            </div>

            <span className="section-icon">✚</span>
          </div>

          <form onSubmit={analyzeSymptoms}>
            <label htmlFor="symptoms">
              Enter your symptoms
            </label>

            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Example: itching, skin_rash, headache"
              rows="4"
              disabled={loading}
            />

            <p className="suggestion-heading">
              Common dataset symptoms (click to add):
            </p>

            <div className="symptom-list">
              {suggestedSymptoms.map((symptom) => (
                <button
                  type="button"
                  className="symptom-chip"
                  key={symptom}
                  onClick={() => addSymptom(symptom)}
                  disabled={loading}
                >
                  + {symptom.replaceAll("_", " ")}
                </button>
              ))}
            </div>

            <div className="action-buttons">
              <button type="submit" disabled={loading}>
                {loading ? (
                  <span className="loading-content">
                    <span className="spinner"></span>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Symptoms →"
                )}
              </button>

              <button
                type="button"
                className="clear-button"
                onClick={clearSymptoms}
                disabled={loading}
              >
                Clear Symptoms
              </button>
            </div>
          </form>

          {error && <p className="error">{error}</p>}
        </section>

        {result && (
          <section className="card result result-animated">
            <h2>Analysis Result</h2>

            <h3>Symptoms Submitted</h3>

            <div className="symptom-list">
              {result.received_symptoms.map(
                (symptom, index) => (
                  <span
                    className="result-symptom"
                    key={index}
                  >
                    {symptom.replaceAll("_", " ")}
                  </span>
                )
              )}
            </div>

            <h3>Recognized Symptoms</h3>

            {result.recognized_symptoms?.length > 0 ? (
              <div className="symptom-list">
                {result.recognized_symptoms.map(
                  (symptom, index) => (
                    <span
                      className="result-symptom"
                      key={index}
                    >
                      ✓ {symptom.replaceAll("_", " ")}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p>No recognized symptoms.</p>
            )}

            {result.unrecognized_symptoms?.length > 0 && (
              <>
                <h3>Unrecognized Symptoms</h3>

                <div className="symptom-list">
                  {result.unrecognized_symptoms.map(
                    (symptom, index) => (
                      <span
                        className="result-symptom"
                        key={index}
                      >
                        {symptom}
                      </span>
                    )
                  )}
                </div>

                <p className="confidence-note">
                  These symptoms were not found in the
                  training dataset and were not used for
                  the experimental prediction.
                </p>
              </>
            )}

            <h3>Experimental Prediction</h3>

            <p className="prediction-name">
              {result.predicted_disease}
            </p>

            <h3>Model Prediction Confidence</h3>

            <div className="confidence-details">
              <span>Model confidence score</span>
              <strong>{confidence.toFixed(2)}%</strong>
            </div>

            <div
              className="confidence-bar"
              role="progressbar"
              aria-valuenow={confidence}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Model prediction confidence"
            >
              <div
                className="confidence-fill"
                style={{
                  width: `${confidence}%`,
                }}
              />
            </div>

            <p className="confidence-note">
              This score reflects the model's confidence
              in its selected category. It is not the
              probability that you have the condition and
              does not indicate medical certainty.
            </p>

            {assistantResponse && (
              <>
                <h3>Explanation</h3>

                <p>{assistantResponse.explanation}</p>

                <h3>General Health Guidance</h3>

                <ul>
                  {assistantResponse.health_guidance?.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>

                <h3>Important Information</h3>

                <ul>
                  {assistantResponse.important_information?.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>

                <p className="warning">
                  {assistantResponse.medical_warning ||
                    result.warning}
                </p>
              </>
            )}

            <button
              type="button"
              className="reset-button"
              onClick={resetAnalysis}
            >
              Reset Analysis
            </button>
          </section>
        )}

        <footer>
          Educational tool only. Not a medical diagnosis
          or substitute for professional medical care.
          Seek urgent medical help for severe or rapidly
          worsening symptoms.
        </footer>
      </main>
    </div>
  );
}

export default App;
