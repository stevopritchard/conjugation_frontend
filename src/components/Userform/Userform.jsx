import { useState } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';

function routes(props) {
  if (props) {
    return (
      <Form.Text onClick={() => props('register')} className="text-muted">
        Register
      </Form.Text>
    );
  }
}

function validateName(name) {
  if (name.length < 2) {
    return 'Name must be at least 2 characters.';
  }
  return null;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
}

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password must be 8+ characters with uppercase, number, and special character';
  }
  return null;
}

function Userform({
  cardTitle,
  formGroup,
  onSubmitFunction,
  responseText,
  routeChangeFunction,
  buttonTitle,
}) {
  const [errorMessages, setErrorMessages] = useState({
    name: 'Please enter your name',
    email: 'Please enter your email',
    password: 'Please enter your password',
  });

  return (
    <Card style={{ margin: '0 auto' }}>
      <Card.Body>
        <Card.Title>{cardTitle}</Card.Title>
        {formGroup.map((val, i) => {
          return (
            <Form noValidate>
              <FormGroup controlId={formGroup[i].controlId} key={val}>
                <Form.Control
                  type={formGroup[i].type}
                  placeholder={formGroup[i].placeholder}
                  onChange={formGroup[i].onChange}
                  isInvalid={
                    errorMessages[
                      formGroup[i].type === 'text' ? 'name' : formGroup[i].type
                    ] !== null
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {
                    errorMessages[
                      formGroup[i].type === 'text' ? 'name' : formGroup[i].type
                    ]
                  }
                </Form.Control.Feedback>
              </FormGroup>
            </Form>
          );
        })}
        <p
          style={{ pointerEvents: 'none', color: 'tomato', fontSize: '0.75em' }}
        >
          {responseText}
        </p>
        <Button
          variant="primary"
          type="submit"
          onClick={() => onSubmitFunction()}
        >
          {buttonTitle}
        </Button>
        {routes(routeChangeFunction)}
      </Card.Body>
    </Card>
  );
}

export default Userform;
