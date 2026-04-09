import { createContext, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import type { User } from '../types/user';
import { FormInputDataType, AuthContextType } from '../types/auth';

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

const validatePassword = (password: string) => {
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const longEnough = password.length >= 8;

  return hasCapital && hasNumber && hasSpecial && longEnough;
};

export const AuthContext = createContext<AuthContextType>({
  formInputData: {},
  responseText: '',
  setResponseText: () => {},
  loading: false,
  setLoading: () => {},
  handleInputChange: () => () => {},
  submitForm: () => {},
  resetForm: () => {},
  handleInputBlur: () => () => {},
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
      if (fieldName === 'email') {
        if (!validateEmail(value)) {
          setResponseText('Please enter a valid email');
        } else {
          setResponseText('');
        }
      }
      setFormInputData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    };
  }

  function handleInputBlur(fieldName: string) {
    return function (event: React.ChangeEvent<HTMLInputElement>) {
      const { value } = event.target;
      if (fieldName === 'password') {
        if (!validatePassword(value)) {
          setResponseText('You must enter a valid password');
        } else {
          setResponseText('');
        }
      }
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
    navigate: NavigateFunction,
  ) {
    const config = authConfig[formType];
    console.log(typeof config.fields);
    const body = config.fields.reduce(
      (acc, field) => {
        acc[field] = formInputData[field];
        return acc;
      },
      {} as Record<(typeof config.fields)[number], string>,
    );

    // config.fields.forEach((field) => {
    //   body[field] = formInputData[field];
    // });
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
              : `${errorType} failed - please check your credentials and try again`,
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
    handleInputBlur: handleInputBlur,
  };
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
