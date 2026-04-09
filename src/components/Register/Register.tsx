import { useContext } from 'react';
import { Userform } from '../Userform';
import { AuthContext } from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/user';

function Register({ loadUser }: { loadUser: (user: User) => void }) {
  const {
    formInputData,
    responseText,
    loading,
    handleInputChange,
    submitForm,
    handleInputBlur,
  } = useContext(AuthContext);
  let navigate = useNavigate();

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
          onBlur: handleInputBlur('name'),
        },
        {
          controlId: 'formBasicEmail',
          type: 'email',
          placeholder: 'Enter email',
          onChange: handleInputChange('email'),
          value: formInputData.email,
          onBlur: handleInputBlur('name'),
        },
        {
          controlId: 'formBasicPassword',
          type: 'password',
          placeholder: 'Password',
          onChange: handleInputChange('password'),
          value: formInputData.password,
          onBlur: handleInputBlur('name'),
        },
      ]}
      responseText={loading ? 'Checking your info...' : responseText}
      onSubmitFunction={() => submitForm('register', loadUser, navigate)}
      buttonTitle={'Register'}
    />
  );
}

export default Register;
