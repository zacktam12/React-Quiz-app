import { useQuiz } from "../Context/QuizContext";
import Option from "./Option";

function Questions() {
  const { question, answer, dispatch } = useQuiz();
  return (
    <div>
      <h4>{question.question}</h4>
      <Option question={question} answer={answer} dispatch={dispatch} />
    </div>
  );
}
export default Questions;
