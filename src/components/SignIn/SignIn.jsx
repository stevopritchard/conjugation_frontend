import { useState } from 'react';
import { Userform } from '../Userform';

function SignIn({ routeChange, loadUser }) {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [responseText, setResponseText] = useState('');

  function onEmailChange(event) {
    setSignInEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setSignInPassword(event.target.value);
  }

  function onSubmitSignIn() {
    fetch('http://localhost:3001/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
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
          onChange: onEmailChange,
          value: signInEmail,
        },
        {
          controlId: 'formBasicPassword',
          type: 'password',
          placeholder: 'Password',
          onChange: onPasswordChange,
          value: signInPassword,
        },
      ]}
      onSubmitFunction={onSubmitSignIn}
      buttonTitle={'Sign In'}
      routeChangeFunction={routeChange}
    />
  );
}

export default SignIn;
