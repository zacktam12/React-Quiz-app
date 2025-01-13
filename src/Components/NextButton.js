import { useQuiz } from "../Context/QuizContext";

function NextButton() {
  const { dispatch, answer, index, numQuestions } = useQuiz();
  if (answer === null) return null;

  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestions" })}
      >
        Next
      </button>
    );
  if (index)
    if (index === numQuestions - 1)
      return (
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "finish" })}
        >
          Finish
        </button>
      );
}

export default NextButton;
