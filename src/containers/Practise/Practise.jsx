import { useState, useReducer, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Question from '../../components/Question/Question';
import quizReducer from '../../store/quiz-reducer';
import './Practise.css';

function Practise() {
  const [conjugation, setConjugation] = useState({});
  const [testCounter, setTestCounter] = useState(0);

  const [quizState, setQuizState] = useState({
    isActive: false,
    currentQuestion: 1,
    totalQuestions: 6,
    selectedTenses: [],
    score: 0,
    prevQuizLength: 0,
  });

  useEffect(() => {
    console.log(quizState);
  }, [quizState]);

  //   const [quizReducerState, quizDispatch] = useReducer(quizReducer);

  let randNum = Math.floor(Math.random() * 5);

  function getVerbs() {
    let { selectedTenses } = quizState;
    let tense =
      selectedTenses[Math.floor(Math.random() * selectedTenses.length)];
    fetch('http://localhost:3001/get_conjugations', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tense: tense,
      }),
    })
      .then((response) => response.json())
      .then((verbs) => {
        console.log(verbs[0]);
        return setConjugation(verbs[0]);
      })
      .catch((err) => console.log(err));
  }

  function startTest(selection) {
    let { selectedTenses } = quizState;
    if (selection === true) {
      if (selectedTenses.length > 0) {
        setQuizState({
          ...quizState,
          score: 0,
          isActive: selection,
          currentQuestion: 1,
        });
        setTestCounter((prevTestCounter) => {
          return prevTestCounter + 1;
        });
        getVerbs();
      }
      return;
    }
    if (selection === false) {
      setQuizState({
        ...quizState,
        isActive: false,
        selectedTenses: [],
        prevQuizLength: quizState.totalQuestions,
      });
      if (quizState.currentQuestion < quizState.totalQuestions) {
        setQuizState((prevQuizState) => ({ ...prevQuizState, score: 0 }));
      }
    }
  }

  function selectTense(e) {
    if (e.target.checked === true) {
      setQuizState((prevQuizState) => ({
        ...prevQuizState,
        selectedTenses: prevQuizState.selectedTenses.concat(e.target.id),
      }));
    } else if (e.target.checked === false) {
      setQuizState((prevQuizState) => ({
        ...prevQuizState,
        selectedTenses: prevQuizState.selectedTenses.filter(
          (item) => item !== e.target.id
        ),
      }));
    }
  }

  function setQuestions(e) {
    setQuizState({
      ...quizState,
      totalQuestions: e.target.value,
    });
  }

  function nextQuestion(answer) {
    setQuizState((prevQuizState) => ({
      ...prevQuizState,
      score: prevQuizState.score + answer,
    }));
    if (quizState.currentQuestion < quizState.totalQuestions) {
      setQuizState((prevQuizState) => ({
        ...prevQuizState,
        currentQuestion: prevQuizState.currentQuestion + 1,
      }));
      getVerbs();
    } else {
      startTest(false);
    }
  }
  return (
    <div className="container-fluid">
      {quizState.isActive === true ? (
        <Question
          quit={startTest}
          questionNumber={quizState.currentQuestion}
          nextQuestion={nextQuestion}
          conjugation={conjugation}
          score={quizState.score}
          randNum={randNum}
        />
      ) : (
        <Card className="practiseCard">
          <Card.Body>
            <Card.Title>Practise</Card.Title>
            {testCounter === 0 ? null : (
              <p>
                Your score is {quizState.score} out of{' '}
                {quizState.prevQuizLength}
              </p>
            )}
            <Form.Group>
              <div className="checkboxes">
                <Row>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Presente"
                      label="Presente"
                      onChange={selectTense}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Pretérito"
                      label="Pretérito"
                      onChange={selectTense}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Imperfecto"
                      label="Imperfecto"
                      onChange={selectTense}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Presente perfecto"
                      label="Presente perfecto"
                      onChange={selectTense}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Pluscuamperfecto"
                      label="Pluscuamperfecto"
                      onChange={selectTense}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Futuro"
                      label="Futuro"
                      onChange={selectTense}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Condicional"
                      label="Condicional"
                      onChange={selectTense}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Condicional perfecto"
                      label="Condicional perfecto"
                      onChange={selectTense}
                    />
                  </Col>
                  <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                    <Form.Check
                      type="checkbox"
                      id="Futuro perfecto"
                      label="Futuro perfecto"
                      onChange={selectTense}
                    />
                  </Col>
                </Row>
              </div>
              <Form.Label>
                Number of Questions: {quizState.totalQuestions}
              </Form.Label>
              <Form.Control
                type="range"
                min="1"
                max="10"
                step="1"
                onChange={(e) => setQuestions(e)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => startTest(true)}>
              Begin
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Practise;
