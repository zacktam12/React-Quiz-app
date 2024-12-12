import Option from "./Option";

function Questions({ question, answer, dispatch }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Option question={question} answer={answer} dispatch={dispatch} />
    </div>
  );
}
export default Questions;
