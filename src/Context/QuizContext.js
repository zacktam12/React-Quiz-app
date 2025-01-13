import { useReducer, useContext, useEffect, createContext } from "react";

const quizContext = createContext();
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
function QuizProvider({ children }) {
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

  const numQuestions = questions.length;

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
    <quizContext.Provider
      value={{
        status,
        questions,
        index,
        answer,
        points,
        highScore,
        restart,
        secondRemaining,
        numQuestions,
        maxPossiblePoints,
      }}
    >
      {children}
    </quizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(quizContext);
  return context;
}
export { QuizProvider, useQuiz };
