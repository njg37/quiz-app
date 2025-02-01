import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Home.css";
function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the Quiz App</h1>
      <p>Test your knowledge with multiple-choice questions.</p>
      <button onClick={() => navigate("/quiz")}>Start Quiz</button>
    </div>
  );
}

export default Home;
