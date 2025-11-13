import { useState, useReducer } from 'react';
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
  const [errorText, setErrorText] = useState('');
  const [quizReducerState, quizDispatch] = useReducer(quizReducer, {
    isActive: false,
    currentQuestion: 1,
    totalQuestions: 6,
    selectedTenses: [],
    score: 0,
    prevQuizLength: 0,
  });

  function getVerbs() {
    let { selectedTenses } = quizReducerState;
    let tense =
      selectedTenses[Math.floor(Math.random() * selectedTenses.length)];
    fetch('http://localhost:3001/get_conjugations', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tense: tense,
      }),
    })
      .then((response) => {
        // Check HTTP status first
        if (!response.ok) {
          // Handle different status codes
          if (response.status === 404) {
            throw new Error(`Conjugation endpoint not found`);
          }
          if (response.status === 500) {
            throw new Error('Server error, please try again');
          }
          throw new Error('Conjugation failed - please try again.');
        }
        return response.json(); // Only parse if response was ok
      })

      .then((verbs) => {
        // Check if a conjugation is actually returned
        if (!verbs.length) {
          throw new Error(`Request failed - no verb conjugation returned`);
        }
        setErrorText(''); // clear error message on successful response
        setConjugation(verbs[0]);
      })
      .catch((error) => setErrorText(error.message));
  }

  function startTest(selection) {
    let { selectedTenses } = quizReducerState;
    if (selection === true) {
      if (selectedTenses.length > 0) {
        quizDispatch({
          type: 'START_TEST',
        });
        setTestCounter((prevTestCounter) => {
          return prevTestCounter + 1;
        });
        getVerbs();
      }
      return;
    }
    if (selection === false) {
      quizDispatch({
        type: 'STOP_TEST',
      });
    }
  }

  function selectTense(e) {
    quizDispatch({
      type: 'SELECT_TENSES',
      payload: e.target,
    });
  }

  function setQuestions(e) {
    quizDispatch({
      type: 'SET_QUIZ_LENGTH',
      payload: e.target.value,
    });
  }

  function nextQuestion(answer) {
    quizDispatch({
      type: 'UPDATE_SCORE',
      payload: answer,
    });
    if (quizReducerState.currentQuestion < quizReducerState.totalQuestions) {
      quizDispatch({
        type: 'NEXT_QUESTION',
      });
      getVerbs();
    } else {
      startTest(false);
    }
  }
  return (
    <div className="container-fluid">
      {quizReducerState.isActive === true ? (
        <Question
          quit={startTest}
          questionNumber={quizReducerState.currentQuestion}
          nextQuestion={nextQuestion}
          conjugation={conjugation}
          score={quizReducerState.score}
          errorText={errorText}
        />
      ) : (
        <Card className="practiseCard">
          <Card.Body>
            <Card.Title>Practise</Card.Title>
            {testCounter === 0 ? null : (
              <p>
                Your score is {quizReducerState.score} out of{' '}
                {quizReducerState.prevQuizLength}
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
                Number of Questions: {quizReducerState.totalQuestions}
              </Form.Label>
              <Form.Control
                type="range"
                min="1"
                max="10"
                step="1"
                onChange={(e) => setQuestions(e)}
              />
            </Form.Group>
            <p
              style={{
                pointerEvents: 'none',
                color: 'tomato',
                fontSize: '0.75em',
              }}
            >
              {errorText}
            </p>
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
