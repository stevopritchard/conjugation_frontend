import { useContext } from 'react';
import { Userform } from '../Userform';
import { AuthContext } from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

function Register({ loadUser }) {
  const {
    formInputData,
    responseText,
    loading,
    handleInputChange,
    submitForm,
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
      onSubmitFunction={() => submitForm('register', loadUser, navigate)}
      buttonTitle={'Register'}
    />
  );
}

export default Register;
