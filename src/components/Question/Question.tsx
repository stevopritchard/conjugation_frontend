import { useEffect, useState, useMemo } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './Question.css';

const PRONOUNS: Record<string, string> = {
  form_1s: 'Yo',
  form_2s: 'Tú',
  form_3s: 'Él/Ella/Ud.',
  form_1p: 'Nosotros',
  form_2p: 'Vosostros',
  form_3p: 'Ellos/Ellas/Uds.',
};

interface QuestionProps {
  questionNumber: number;
  nextQuestion: (answer: number) => void;
  quit: (selection: boolean) => void;
  conjugation: Record<string, string>;
  score: number;
  errorText: string;
}

const Question = ({
  questionNumber,
  nextQuestion,
  quit,
  conjugation,
  score,
  errorText,
}: QuestionProps) => {
  const [correctPronoun, setCorrectPronoun] = useState('');
  const [correctForm, setCorrectForm] = useState('');
  const [selectedForm, setSelectedForm] = useState('');

  const forms = useMemo(
    () => Object.keys(conjugation).filter((form) => form !== 'infinitive'),
    [conjugation]
  );

  useEffect(() => {
    const randNum = Math.floor(Math.random() * forms.length);
    var randomForm = forms[randNum];
    setCorrectForm(randomForm);
    setCorrectPronoun(PRONOUNS[randomForm]);
  }, [forms]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedForm(e.target.id);
  };

  function submitAnswer() {
    if (selectedForm) {
      const answer = selectedForm === correctForm ? 1 : 0;
      nextQuestion(answer);
      setSelectedForm('');
    }
  }

  return (
    <Card>
      <Card.Title>Question {questionNumber}</Card.Title>
      <p>Your score is {score}</p>
      <p>{correctPronoun + ' [' + conjugation.infinitive + ']'}</p>
      <Form.Group>
        <Row>
          <Col
            xs={{ span: 8, offset: 4 }}
            sm={{ span: 4, offset: 2 }}
            md={{ span: 4, offset: 2 }}
            xl={{ span: 4, offset: 2 }}
            lg={{ span: 4, offset: 2 }}
          >
            <Form.Check
              // ref={radio}
              type="radio"
              name="multipleChoice"
              id={forms[0]}
              label={conjugation[forms[0]]}
              checked={selectedForm === forms[0]}
              onChange={handleChange}
            />
          </Col>
          <Col
            xs={{ span: 8, offset: 4 }}
            sm={{ span: 4, offset: 2 }}
            md={{ span: 4, offset: 2 }}
            xl={{ span: 4, offset: 2 }}
            lg={{ span: 4, offset: 2 }}
          >
            <Form.Check
              type="radio"
              name="multipleChoice"
              id={forms[1]}
              label={conjugation[forms[1]]}
              checked={selectedForm === forms[1]}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={{ span: 8, offset: 4 }}
            sm={{ span: 4, offset: 2 }}
            md={{ span: 4, offset: 2 }}
            xl={{ span: 4, offset: 2 }}
            lg={{ span: 4, offset: 2 }}
          >
            <Form.Check
              type="radio"
              name="multipleChoice"
              id={forms[2]}
              label={conjugation[forms[2]]}
              checked={selectedForm === forms[2]}
              onChange={handleChange}
            />
          </Col>
          <Col
            xs={{ span: 8, offset: 4 }}
            sm={{ span: 4, offset: 2 }}
            md={{ span: 4, offset: 2 }}
            xl={{ span: 4, offset: 2 }}
            lg={{ span: 4, offset: 2 }}
          >
            <Form.Check
              type="radio"
              name="multipleChoice"
              id={forms[3]}
              label={conjugation[forms[3]]}
              checked={selectedForm === forms[3]}
              onChange={handleChange}
            />
          </Col>
        </Row>
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
      <Row>
        <Button onClick={submitAnswer}>Next</Button>
        <Button variant="danger" onClick={() => quit(false)}>
          Quit
        </Button>
      </Row>
    </Card>
  );
};

export default Question;
