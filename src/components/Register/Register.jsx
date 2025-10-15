import { useContext } from 'react';
import { Userform } from '../Userform';
import { AuthContext } from '../../store/auth-context';

function Register({ routeChange, loadUser }) {
  const {
    formInputData,
    responseText,
    setResponseText,
    loading,
    setLoading,
    handleInputChange,
  } = useContext(AuthContext);

  function onSubmitRegister() {
    setLoading(true);
    setResponseText(''); // Clear previous errors

    fetch('http://localhost:3001/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formInputData.name,
        email: formInputData.email,
        password: formInputData.password,
      }),
    })
      .then((response) => {
        // Check HTTP status first
        if (!response.ok) {
          // Handle different status codes
          if (response.status === 404) {
            throw new Error('Registration endpoint not found');
          }
          if (response.status === 500) {
            throw new Error('Server error, please try again');
          }
          throw new Error('Registration failed');
        }
        return response.json(); // Only parse if response was ok
      })
      .then((user) => {
        // Check if registration actually succeeded
        if (!user.id) {
          throw new Error('Registration failed - no user returned');
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
      responseText={loading ? 'Checking your info...' : responseText}
      onSubmitFunction={onSubmitRegister}
      buttonTitle={'Register'}
    />
  );
}

export default Register;
