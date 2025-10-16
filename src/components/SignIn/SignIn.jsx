import { useContext } from 'react';
import { Userform } from '../Userform';
import { AuthContext } from '../../store/auth-context';

function SignIn({ routeChange, loadUser }) {
  const {
    formInputData,
    responseText,
    loading,
    handleInputChange,
    submitForm,
  } = useContext(AuthContext);

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
      onSubmitFunction={() => submitForm('signin', routeChange, loadUser)}
      buttonTitle={'Sign In'}
      routeChangeFunction={routeChange}
    />
  );
}

export default SignIn;
