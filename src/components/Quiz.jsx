import { useState } from "react";
import { getQuizResults, saveQuizResults } from "../utils/storage.js";

export default function Quiz({ course }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  function submitQuiz(event) {
    event.preventDefault();
    const correct = course.quiz.reduce((sum, question, index) => sum + (Number(answers[index]) === question.answer ? 1 : 0), 0);
    const score = Math.round((correct / course.quiz.length) * 100);
    const results = getQuizResults();
    results.unshift({ courseId: course.id, courseTitle: course.title, score, correct, total: course.quiz.length, date: new Date().toISOString() });
    saveQuizResults(results.slice(0, 30));
    setResult({ correct, total: course.quiz.length, score });
  }

  function restart() {
    setAnswers({});
    setResult(null);
  }

  return (
    <section className="panel quiz-panel">
      <div className="panel-heading"><div><span className="eyebrow">POUR T'ENTRAÎNER</span><h2>Quiz de la formation</h2></div><span className="pill">{course.quiz.length} questions</span></div>
      {result ? (
        <div className="quiz-result">
          <div className="result-score">{result.score}%</div>
          <h3>{result.score >= 70 ? "Bravo, continue comme ça !" : "Continue à t'entraîner !"}</h3>
          <p>{result.correct} bonne(s) réponse(s) sur {result.total}.</p>
          <button className="button" onClick={restart}>Recommencer le quiz</button>
        </div>
      ) : (
        <form onSubmit={submitQuiz}>
          {course.quiz.map((question, index) => (
            <fieldset className="quiz-question" key={question.question}>
              <legend>{index + 1}. {question.question}</legend>
              {question.options.map((option, optionIndex) => (
                <label className="quiz-option" key={option}>
                  <input type="radio" name={`question-${index}`} value={optionIndex} checked={String(answers[index]) === String(optionIndex)} onChange={() => setAnswers({ ...answers, [index]: optionIndex })} required />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          ))}
          <button className="button button-fill-left button-primary-hover" type="submit"><span>Valider mes réponses</span></button>
        </form>
      )}
    </section>
  );
}
