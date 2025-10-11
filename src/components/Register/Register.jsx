import { useState } from 'react';
import { Userform } from '../Userform';

function Register({ routeChange, loadUser }) {
  const [formInputData, setFormInputData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [responseText, setResponseText] = useState('');

  function handleInputChange(fieldName) {
    return function (event) {
      const { value } = event.target;
      setFormInputData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    };
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
          onChange: handleInputChange('name'),
          value: formInputData.name,
        },
        {
          controlId: 'formBasicEmail',
          type: 'email',
          placeholder: 'Enter email',
          onChange: handleInputChange('email'),
          value: formInputData.email,
        },
        {
          controlId: 'formBasicPassword',
          type: 'password',
          placeholder: 'Password',
          onChange: handleInputChange('password'),
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
