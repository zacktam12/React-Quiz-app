import { useEffect } from "react";
import { useQuiz } from "../Context/QuizContext";
function Timer() {
  const { secondRemaining, dispatch } = useQuiz();
  const mins = Math.floor(secondRemaining / 60);
  const secs = secondRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins} : {secs < 10 && "0"}
      {secs}
    </div>
  );
}

export default Timer;
