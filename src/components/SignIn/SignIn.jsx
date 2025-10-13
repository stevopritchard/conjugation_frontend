import { useState } from 'react';
import { Userform } from '../Userform';

function SignIn({ routeChange, loadUser }) {
  const [formInputData, setFormInputData] = useState({
    email: '',
    password: '',
  });
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  function handleInputChange(fieldName) {
    return function (event) {
      const { value } = event.target;
      setFormInputData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    };
  }

  function onSubmitSignIn() {
    fetch('http://localhost:3001/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      cardTitle={'Sign In'}
      formGroup={[
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
      responseText={loading ? 'Checking your info...' : responseText}
      onSubmitFunction={onSubmitSignIn}
      buttonTitle={'Sign In'}
      routeChangeFunction={routeChange}
    />
  );
}

export default SignIn;
