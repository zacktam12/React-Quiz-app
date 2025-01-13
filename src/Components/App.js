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
import { useQuiz } from "../Context/QuizContext";

// Main App Component
export default function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      {/* Header component */}
      <Header className="app-header" />

      <Main>
        {/* Conditionally render components based on the app's status */}
        {status === "Loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Questions />
            <Timer />
            <Footer>
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishedScreen />}
      </Main>
    </div>
  );
}
