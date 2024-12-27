import { useEffect, useReducer } from "react";

// Importing individual components for the application
import Header from "./Header";
import StartScreen from "./StartScreen";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";

// Initial state of the application
const intialState = {
  questions: [],
  status: "Loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondRemaining: null,
};

// Constant to define seconds allocated per question
const SECS_PER_QUESTION = 30;

// Reducer function to manage the application state
function Reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      // When data is successfully fetched
      return { ...state, questions: action.payLoad, status: "ready" };
    case "dataFailed":
      // When data fetching fails
      return { ...state, status: "error" };
    case "start":
      // When the quiz starts
      return {
        ...state,
        status: "active",
        secondRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      // When a new answer is submitted
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payLoad,
        points:
          action.payLoad === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestions":
      // Move to the next question
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      // When the quiz is finished
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      // Restart the quiz
      return {
        ...intialState,
        questions: state.questions,
        status: "ready",
      };
    case "tick":
      // Timer tick event
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("action not found");
  }
}

// Main App Component
export default function App() {
  // Using the useReducer hook to manage state with the defined reducer
  const [
    {
      status,
      questions,
      index,
      answer,
      points,
      highScore,
      restart,
      secondRemaining,
    },
    dispatch,
  ] = useReducer(Reducer, intialState);

  // Calculate the total number of questions
  const numQuestions = questions.length;

  // Calculate the maximum possible points for the quiz
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  // Fetching questions data on component mount
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payLoad: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      {/* Header component */}
      <Header className="app-header" />

      <Main>
        {/* Conditionally render components based on the app's status */}
        {status === "Loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && questions.length > 0 && (
          <>
            {/* Progress and Questions components */}
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            {/* Footer with Timer and NextButton components */}
            <Footer>
              <Timer secondRemaining={secondRemaining} dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            maxPossiblePoints={maxPossiblePoints}
            points={points}
            highScore={highScore}
            dispatch={dispatch}
            restart={restart}
          />
        )}
      </Main>
    </div>
  );
}
