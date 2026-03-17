import { useContext } from 'react';
import { Userform } from '../Userform';
import { AuthContext } from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/user';

function SignIn({ loadUser }: { loadUser: (user: User) => void }) {
  const {
    formInputData,
    responseText,
    loading,
    handleInputChange,
    submitForm,
  } = useContext(AuthContext);
  const navigate = useNavigate();

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
      onRegisterClick={() => navigate('/register')}
      onSubmitFunction={() => submitForm('signin', loadUser, navigate)}
      buttonTitle={'Sign In'}
      registerLink={true}
    />
  );
}

export default SignIn;
