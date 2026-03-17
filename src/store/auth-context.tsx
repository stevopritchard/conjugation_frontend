import { createContext, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import type { User } from '../types/user';
import { FormInputDataType, AuthContextType } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({
  formInputData: {},
  responseText: '',
  setResponseText: () => {},
  loading: false,
  setLoading: () => {},
  handleInputChange: () => () => {},
  submitForm: () => {},
  resetForm: () => {},
});

export default function AuthContextProvider({
  children,
}: {
  children: React.JSX.Element;
}) {
  const [formInputData, setFormInputData] = useState<FormInputDataType>({
    name: '',
    email: '',
    password: '',
  });
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  function handleInputChange(fieldName: string) {
    return function (event: React.ChangeEvent<HTMLInputElement>) {
      const { value } = event.target;
      setFormInputData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    };
  }

  const authConfig = {
    register: {
      endpoint: '/register',
      fields: ['name', 'email', 'password'] as const,
      errorMessage: 'Registration',
    },
    signin: {
      endpoint: '/signin',
      fields: ['email', 'password'] as const,
      errorMessage: 'Sign in',
    },
  } as const;

  function submitForm(
    formType: 'register' | 'signin',
    loadUser: (user: User) => void,
    navigate: NavigateFunction
  ) {
    const config = authConfig[formType];
    const body = config.fields.reduce((acc, field) => {
      acc[field] = formInputData[field];
      return acc;
    }, {} as Record<string, string>);

    config.fields.forEach((field) => {
      body[field] = formInputData[field];
    });
    const errorType = config.errorMessage;
    fetch(`http://localhost:3001/api/auth${config.endpoint}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((response) => {
        // Check HTTP status first
        if (!response.ok) {
          // Handle different status codes
          if (response.status === 404) {
            throw new Error(`${errorType} endpoint not found`);
          }
          if (response.status === 500) {
            throw new Error('Server error, please try again');
          }
          throw new Error(
            // NEED DIFFERENT MESSAGES FOR REGISTRATION & SIGNIN
            formType === 'register'
              ? `${errorType} failed - no user was created`
              : `${errorType} failed - please check your credentials and try again`
          );
        }
        return response.json(); // Only parse if response was ok
      })
      .then((user) => {
        // Check if sign in actually succeeded
        if (!user.id) {
          throw new Error(`${errorType} failed - no user returned`);
        }
        loadUser(user);
        navigate('/reference');
      })
      .catch((error) => {
        // All errors end up here - network or HTTP
        setResponseText(error.message);
        setLoading(false); // Only set loading false on error (component still mounted)
      });
  }

  function resetForm() {
    setFormInputData({
      name: '',
      email: '',
      password: '',
    });
  }

  const authContextValue = {
    formInputData: formInputData,
    responseText: responseText,
    setResponseText: setResponseText,
    loading: loading,
    setLoading: setLoading,
    handleInputChange: handleInputChange,
    submitForm: submitForm,
    resetForm: resetForm,
  };
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
