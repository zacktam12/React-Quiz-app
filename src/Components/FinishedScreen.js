import { useQuiz } from "../Context/QuizContext";

function FinishedScreen() {
  const { maxPossiblePoints, points, highScore, dispatch, restart } = useQuiz();
  const percentage = (points / maxPossiblePoints) * 100;
  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "😊";
  if (percentage > 0 && percentage < 50) emoji = "🙌";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <div>
      <p className="result">
        <span>{emoji}</span>You scored <strong>{points}</strong> Out of{" "}
        <strong>{maxPossiblePoints}</strong>
        <strong> ({Math.ceil(percentage)})</strong>%
      </p>
      <p className="highscore">
        (Your highscore is : <span>{highScore}</span>)
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        {restart}
        Restart Quiz
      </button>
    </div>
  );
}

export default FinishedScreen;
