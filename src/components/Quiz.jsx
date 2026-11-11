import { useState } from "react";
import { Link } from "react-router-dom";
import { getQuizResults, saveQuizResults } from "../utils/storage.js";

export default function Quiz({ course, quiz, moduleId, moduleTitle, nextUrl, onPass, canProceed = false }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [validationError, setValidationError] = useState("");
  const questions = Array.isArray(quiz?.questions)
    ? quiz.questions
    : Array.isArray(course.quiz) ? course.quiz : [];
  const passingScore = quiz?.passingScore ?? 70;
  const quizTitle = quiz?.title || "Quiz de la formation";

  function updateAnswer(questionIndex, optionIndex, multiple) {
    setAnswers((currentAnswers) => {
      if (!multiple) {
        return { ...currentAnswers, [questionIndex]: optionIndex };
      }

      const selectedOptions = currentAnswers[questionIndex] || [];
      const nextOptions = selectedOptions.includes(optionIndex)
        ? selectedOptions.filter((selectedOption) => selectedOption !== optionIndex)
        : [...selectedOptions, optionIndex];
      return { ...currentAnswers, [questionIndex]: nextOptions };
    });
    setValidationError("");
  }

  function submitQuiz(event) {
    event.preventDefault();
    const unansweredCount = questions.filter((_, index) => {
      const answer = answers[index];
      return Array.isArray(answer) ? answer.length === 0 : answer === undefined;
    }).length;
    if (unansweredCount > 0) {
      const questionLabel = unansweredCount === 1 ? "question sans réponse" : "questions sans réponse";
      setValidationError(`Réponds à toutes les questions avant de valider (${unansweredCount} ${questionLabel}).`);
      return;
    }

    const correct = questions.reduce((sum, question, index) => {
      const expected = Array.isArray(question.answer) ? question.answer : [question.answer];
      const selected = Array.isArray(answers[index]) ? answers[index] : [answers[index]];
      const isCorrect = selected.length === expected.length
        && expected.every((answer) => selected.includes(Number(answer)));
      return sum + (isCorrect ? 1 : 0);
    }, 0);
    const incorrect = questions.length - correct;
    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const results = getQuizResults();
    results.unshift({
      courseId: course.id,
      courseTitle: course.title,
      quizId: quiz?.id || `${course.id}-final-quiz`,
      quizTitle,
      moduleId: moduleId || null,
      moduleTitle: moduleTitle || null,
      score,
      correct,
      incorrect,
      total: questions.length,
      date: new Date().toISOString(),
    });
    saveQuizResults(results.slice(0, 30));
    setResult({ correct, incorrect, total: questions.length, score, answers: { ...answers } });
    if (score >= passingScore) onPass?.();
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setValidationError("");
  }

  return (
    <section className="panel quiz-panel">
      <div className="panel-heading"><div><span className="eyebrow">{quiz ? (quiz.required ? "QUIZ OBLIGATOIRE" : "QUIZ FACULTATIF") : "POUR T'ENTRAÎNER"}</span><h2>{quizTitle}</h2></div><span className="pill">{questions.length} questions · réussite à {passingScore}%</span></div>
      {result ? (
        <div className="quiz-result">
          <div className="result-score">{result.score}%</div>
          <h3>{result.score >= passingScore ? "Bravo, continue comme ça !" : "Continue à t'entraîner !"}</h3>
          <div className="quiz-result-breakdown" aria-label="Détail des réponses">
            <p className="quiz-result-correct">{result.correct} bonne(s) réponse(s)</p>
            <p className="quiz-result-incorrect">{result.incorrect} mauvaise(s) réponse(s)</p>
            <p>{result.total} question(s) au total</p>
          </div>
          <ol className="quiz-answer-review">
            {questions.map((question, index) => {
              const expected = Array.isArray(question.answer) ? question.answer : [question.answer];
              const storedAnswer = result.answers[index];
              const selected = Array.isArray(storedAnswer) ? storedAnswer : [storedAnswer];
              const correct = selected.length === expected.length
                && expected.every((answer) => selected.includes(Number(answer)));
              const selectedText = selected
                .filter((answer) => answer !== undefined)
                .map((answer) => question.options[answer])
                .join(", ") || "Aucune réponse";
              const correctText = expected.map((answer) => question.options[answer]).join(", ");

              return (
                <li className={correct ? "is-correct" : "is-incorrect"} key={question.question}>
                  <strong>{question.question}</strong>
                  <span>Ta réponse : {selectedText}</span>
                  {!correct && <span>Réponse correcte : {correctText}</span>}
                  <small>{question.explanation || `À retenir : ${correctText}.`}</small>
                </li>
              );
            })}
          </ol>
          <div className="quiz-result-actions">
            <button className="button" onClick={restart}>Recommencer le quiz</button>
            {nextUrl && (!quiz?.required || result.score >= passingScore || canProceed) && (
              <Link className="button button-ghost" to={nextUrl}>Module suivant →</Link>
            )}
          </div>
        </div>
      ) : questions.length === 0 ? (
        <p className="quiz-empty">Aucune question n’est disponible pour cette formation.</p>
      ) : (
        <form onSubmit={submitQuiz}>
          {questions.map((question, index) => {
            const multiple = question.multiple === true || Array.isArray(question.answer);
            const selectedOptions = Array.isArray(answers[index]) ? answers[index] : [answers[index]];
            return (
              <fieldset className="quiz-question" key={question.question}>
                <legend>{index + 1}. {question.question}</legend>
                <p className="quiz-answer-hint">{multiple ? "Sélectionne toutes les réponses correctes." : "Sélectionne une seule réponse."}</p>
                {question.options.map((option, optionIndex) => (
                  <label className="quiz-option" key={option}>
                    <input
                      type={multiple ? "checkbox" : "radio"}
                      name={`question-${index}`}
                      value={optionIndex}
                      checked={selectedOptions.includes(optionIndex)}
                      onChange={() => updateAnswer(index, optionIndex, multiple)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>
            );
          })}
          {validationError && <p className="quiz-validation-error" role="alert">{validationError}</p>}
          <button className="button button-fill-left button-primary-hover" type="submit"><span>Valider mes réponses</span></button>
        </form>
      )}
    </section>
  );
}
