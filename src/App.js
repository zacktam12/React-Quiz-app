import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const intialState = {
  questions: [],
  // 'Loading','active','error','finished'
  status: "Loading",
};
function Reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payLoad, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    default:
      throw new Error("action not found");
  }
}
export default function App() {
  const [state, dispatch] = useReducer(Reducer, intialState);
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payLoad: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header className="app-header" />
      <Main>
        <p>1/15</p>
        <p>Questions?</p>
      </Main>
    </div>
  );
}
