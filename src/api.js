import axios from "axios";

const API_URL = "/Uw5CrX"; // Proxy will handle domain

export const fetchQuizData = async () => {
  try {
    const response = await axios.get(API_URL);

    // Check if the response contains a valid 'questions' array
    if (!response.data || !Array.isArray(response.data.questions)) {
      console.error("Invalid API Response: Missing or malformed 'questions' array.");
      return [];
    }

    // Process each question
    return response.data.questions.map((q, index) => {
      let correctAnswer = null;

      // Try to find the correct answer in the options
      if (Array.isArray(q.options)) {
        const correctOption = q.options.find(option => option.is_correct === true);
        if (correctOption) {
          correctAnswer = correctOption.description || "Invalid Option Description";
        }
      }

      // If no correct answer is found in options, fallback to using detailed_solution
      if (!correctAnswer && q.detailed_solution) {
        const match = q.detailed_solution.match(/(?:Answer|Correct answer|Base sequence in mRNA is):\s*([\w\s'\/]+)/i);
        correctAnswer = match ? match[1].trim() : "Correct answer unavailable";
      }

      // Fallback if no correct answer was found
      if (!correctAnswer) {
        console.warn(`No valid correct answer found for Question ${index + 1}. Using fallback.`);
        correctAnswer = "Correct answer unavailable";
      }

      return {
        question: q.description || "Missing Question",  // Default if question description is missing
        options: q.options?.map((option) =>
          typeof option === "object" ? option.description || "Invalid Option" : option
        ) || [], // Default if options are malformed
        correct_answer: correctAnswer, // Return the correct answer
      };
    });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return [];
  }
};
