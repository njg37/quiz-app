import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };

  // Function to determine the message based on score percentage
  const getMessage = () => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "🎉 Perfect Score! You're a Quiz Master!";
    if (percentage >= 80) return "👏 Great job! You did really well!";
    if (percentage >= 50) return "🙂 Good effort! Keep practicing!";
    return "😞 Don't worry! Try again to improve.";
  };

  const percentage = (score / total) * 100;

  // Function to determine the color of the progress bar based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "#28a745"; // Green for 80% and above
    if (percentage >= 50) return "#ffeb3b"; // Yellow for 50% and above
    return "#ff0000"; // Red for below 50%
  };

  return (
    <div className="result-page-container">
      <div className="result-header">
        <h2>Quiz Completed!</h2>
        <p>Your Score: <strong>{score} / {total}</strong></p>
      </div>
      
      <div className="circle-progress-container">
        <svg className="circle-progress" width="150" height="150">
          <circle className="circle-background" cx="75" cy="75" r="70" />
          <circle
            className="circle-foreground"
            cx="75"
            cy="75"
            r="70"
            strokeDasharray={440}
            strokeDashoffset={440 - (percentage / 100) * 440}
            style={{
              stroke: getProgressColor(percentage), // Dynamically set the color based on percentage
            }}
          />
          <text
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            alignmentBaseline="central" 
            className="circle-text"
          >
            {Math.round(percentage)}%
          </text>
        </svg>
      </div>

      <p className="result-message">{getMessage()}</p>

      <div className="result-action-buttons">
        {/* Button to navigate home */}
        <button className="result-action-button home" onClick={() => navigate("/")}>🏠 Home</button>
        {/* Button to navigate to retry quiz */}
        <button className="result-action-button retry" onClick={() => navigate("/quiz")}>🔄 Retry</button>
      </div>
    </div>
  );
}

export default ResultPage;
