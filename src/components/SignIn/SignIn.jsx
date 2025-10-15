import { useContext } from 'react';
import { Userform } from '../Userform';
import { AuthContext } from '../../store/auth-context';

function SignIn({ routeChange, loadUser }) {
  const {
    formInputData,
    responseText,
    setResponseText,
    loading,
    setLoading,
    handleInputChange,
  } = useContext(AuthContext);

  function onSubmitSignIn() {
    fetch('http://localhost:3001/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formInputData.email,
        password: formInputData.password,
      }),
    })
      .then((response) => {
        // Check HTTP status first
        if (!response.ok) {
          // Handle different status codes
          if (response.status === 404) {
            throw new Error('Sign in endpoint not found');
          }
          if (response.status === 500) {
            throw new Error('Server error, please try again');
          }
          throw new Error(
            'Sign in failed - please check your credentials and try again'
          );
        }
        return response.json(); // Only parse if response was ok
      })
      .then((user) => {
        // Check if sign in actually succeeded
        if (!user.id) {
          throw new Error('Sign in failed - no user returned');
        }
        loadUser(user);
        routeChange('home');
      })
      .catch((error) => {
        // All errors end up here - network or HTTP
        setResponseText(error.message);
        setLoading(false); // Only set loading false on error (component still mounted)
      });
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
