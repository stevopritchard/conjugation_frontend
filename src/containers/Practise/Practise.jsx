import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Question from '../../components/Question/Question';
import './Practise.css';

function Practise() {
  const [testActive, setTestActive] = useState(false);
  const [selectedTenses, setSelectedTenses] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(6);
  const [prevTotalQuestions, setPrevTotalQuestions] = useState(0);
  const [conjugation, setConjugation] = useState({});
  const [score, setScore] = useState(0);
  const [testCounter, setTestCounter] = useState(0);

  let randNum = Math.floor(Math.random() * 5);

  function getVerbs() {
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
      .then((verbs) => setConjugation(verbs[0]))
      .catch((err) => console.log(err));
  }

  function startTest(selection) {
    //this is a function expression... function declaration didn't work!
    // let checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
    if (selectedTenses.length > 0) {
      if (selection === true) {
        setScore(0);
      }
      setTestActive(selection);
      setCurrentQuestion(1);
      setTestCounter((prevTestCounter) => {
        return prevTestCounter + 1;
      });

      getVerbs();
    }
    if (selection === false) {
      setPrevTotalQuestions(totalQuestions);
      if (currentQuestion < totalQuestions) {
        setScore(0);
      }
      setSelectedTenses([]);
    }
  }

  function selectTense(e) {
    if (e.target.checked === true) {
      setSelectedTenses((prevSelectedTenses) => {
        return prevSelectedTenses.concat(e.target.id);
      });
    } else if (e.target.checked === false) {
      setSelectedTenses((prevSelectedTenses) => {
        return prevSelectedTenses.filter((item) => item !== e.target.id);
      });
    }
  }

  function setQuestions(e) {
    setTotalQuestions(e.target.value);
  }

  function nextQuestion(answer) {
    setScore((prevScore) => {
      return prevScore + answer;
    });
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      getVerbs();
    } else {
      startTest(false);
      setSelectedTenses([]);
    }
  }
  return (
    <div className="container-fluid">
      {testActive === true ? (
        <Question
          quit={startTest}
          questionNumber={currentQuestion}
          nextQuestion={nextQuestion}
          conjugation={conjugation}
          score={score}
          randNum={randNum}
        />
      ) : (
        <Card className="practiseCard">
          <Card.Body>
            <Card.Title>Practise</Card.Title>
            {testCounter === 0 ? null : (
              <p>
                Your score is {score} out of {prevTotalQuestions}
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
              <Form.Label>Number of Questions: {totalQuestions}</Form.Label>
              <Form.Control
                type="range"
                min="1"
                max="10"
                step="1"
                onChange={(e) => setTotalQuestions(e.target.value)}
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
