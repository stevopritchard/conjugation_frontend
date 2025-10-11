import { useState } from 'react';
import { Userform } from '../Userform';

function Register({ routeChange, loadUser }) {
  const [formInputData, setFormInputData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [responseText, setResponseText] = useState('');

  function onNameChange(event) {
    const { value } = event.target;
    setFormInputData((prevState) => ({
      ...prevState,
      name: value,
    }));
  }

  function onEmailChange(event) {
    const { value } = event.target;
    setFormInputData((prevState) => ({
      ...prevState,
      email: value,
    }));
  }

  function onPasswordChange(event) {
    const { value } = event.target;
    setFormInputData((prevState) => ({
      ...prevState,
      password: value,
    }));
  }

  function onSubmitRegister() {
    fetch('http://localhost:3001/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formInputData.name,
        email: formInputData.email,
        password: formInputData.password,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          loadUser(user);
          routeChange('home');
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Userform
      cardTitle={'Sign Up'}
      formGroup={[
        {
          controlId: 'formBasicName',
          type: 'text',
          placeholder: 'Enter name',
          onChange: onNameChange,
          value: formInputData.name,
        },
        {
          controlId: 'formBasicEmail',
          type: 'email',
          placeholder: 'Enter email',
          onChange: onEmailChange,
          value: formInputData.email,
        },
        {
          controlId: 'formBasicPassword',
          type: 'password',
          placeholder: 'Password',
          onChange: onPasswordChange,
          value: formInputData.password,
        },
      ]}
      responseText={responseText}
      onSubmitFunction={onSubmitRegister}
      buttonTitle={'Register'}
    />
  );
}

export default Register;
