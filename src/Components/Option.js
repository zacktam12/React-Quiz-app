import { useQuiz } from "../Context/QuizContext";

function Option({ question }) {
  const { dispatch, answer } = useQuiz();
  const hasAnswered = answer != null;

  if (!question || !Array.isArray(question.options)) {
    console.error("Invalid question format:", question);
    return <div>No valid options available</div>;
  }

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          disabled={hasAnswered}
          key={option}
          onClick={() => dispatch({ type: "newAnswer", payLoad: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
export default Option;
