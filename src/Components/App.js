import { useEffect, useReducer } from "react";
import Header from "./Header";
import StartScreen from "./StartScreen";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";

const intialState = {
  questions: [],
  // 'Loading','active','error','finished'
  status: "Loading",
  index: 0,
  answer: null,
  points: 0,
};
function Reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payLoad, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state, 0);
      return {
        ...state,
        answer: action.payLoad,
        points:
          action.payLoad === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestions":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    default:
      throw new Error("action not found");
  }
}
export default function App() {
  const [{ status, questions, index, answer, points }, dispatch] = useReducer(
    Reducer,
    intialState
  );

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payLoad: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header className="app-header" />
      <Progress
        index={index}
        numQuestions={numQuestions}
        points={points}
        maxPossiblePoints={maxPossiblePoints}
        answer={answer}
      />
      <Main>
        {status === "Loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && questions.length > 0 && (
          <>
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}
