import React, { useState, useEffect } from "react";
import { fetchQuizData } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/QuizPage.css";
import { motion } from "framer-motion";

function QuizPage() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [highScore, setHighScore] = useState(
    localStorage.getItem("highScore") || 0
  );
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setLoading(true);
        const data = await fetchQuizData();
        if (data.length === 0) throw new Error("No quiz data available.");
        setQuizData(data);
        setTotalQuestions(data.length);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadQuizData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion(false); // Auto move to next question
    }
  }, [timeLeft]);

  useEffect(() => {
    setHighScore(Math.max(highScore, score));
    localStorage.setItem("highScore", Math.max(highScore, score));
  }, [score]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = (isCorrect) => {
    if (quizData.length === 0) return;
  
    const isCorrectAnswer = selectedAnswer === quizData[currentQuestionIndex]?.correct_answer;
  
    if (isCorrect && isCorrectAnswer) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0); // Reset streak if wrong
    }
  
    setTimeLeft(15);
    setSelectedAnswer(null);
  
    // Check if it's the last question
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // For the last question, navigate to the result page and pass the score
      setTimeout(() => {
        navigate("/result", { state: { score: score + (isCorrect && isCorrectAnswer ? 1 : 0), total: quizData.length, streak: streak } });
      }, 100);
    }
  };
  
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <motion.div
      key={currentQuestionIndex}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="timer-streak">
            <h3>Time Left: {timeLeft} ⏳</h3>
            <h3>🔥 Streak: {streak}</h3>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <h2>Question {currentQuestionIndex + 1} / {totalQuestions}</h2>
          <p>{quizData[currentQuestionIndex]?.question}</p>
          <div className="options">
            {quizData[currentQuestionIndex]?.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswer === option ? "selected" : ""}`}
                onClick={() => handleAnswerClick(option)}
              >
                {typeof option === "object" ? option.description : option}
              </button>
            ))}
          </div>
          <div className="answer-buttons">
            <button 
              className="correct-answer-button"
              onClick={() => handleNextQuestion(true)}
              disabled={!selectedAnswer}
            >
              Answer Correct
            </button>
            <button 
              className="wrong-answer-button"
              onClick={() => handleNextQuestion(false)}
              disabled={!selectedAnswer}
            >
              Answer Wrong
            </button>
          </div>
          <h2>Your Score: {score}</h2>
          <h3>High Score: {highScore}</h3>
        </div>
      </div>
    </motion.div>
  );
}

export default QuizPage;
