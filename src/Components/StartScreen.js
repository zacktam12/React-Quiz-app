function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Wellcome to React quize</h2>
      <h3>{numQuestions} Questions to Test your react mastery</h3>
      <button
        className="btn btn-UI"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
}
export default StartScreen;
