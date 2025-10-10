import { useState } from 'react';
import { Userform } from '../Userform';

function Register({ routeChange, loadUser }) {
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [responseText, setResponseText] = useState('');

  function onNameChange(event) {
    setRegisterName(event.target.value);
  }

  function onEmailChange(event) {
    setRegisterEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setRegisterPassword(event.target.value);
  }

  function onSubmitRegister() {
    fetch('http://localhost:3001/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
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
          value: registerName,
        },
        {
          controlId: 'formBasicEmail',
          type: 'email',
          placeholder: 'Enter email',
          onChange: onEmailChange,
          value: registerEmail,
        },
        {
          controlId: 'formBasicPassword',
          type: 'password',
          placeholder: 'Password',
          onChange: onPasswordChange,
          value: registerPassword,
        },
      ]}
      responseText={responseText}
      onSubmitFunction={onSubmitRegister}
      buttonTitle={'Register'}
    />
  );
}

export default Register;
