import { createContext, useState } from 'react';

export const AuthContext = createContext({
  formInputData: {},
  responseText: String,
  setResponseText: () => {},
  loading: Boolean,
  setLoading: () => {},
  handleInputChange: () => {},
});

export default function AuthContextProvider({ children }) {
  const [formInputData, setFormInputData] = useState({
    name: '',
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

  const authContextValue = {
    formInputData: formInputData,
    responseText: responseText,
    setResponseText: setResponseText,
    loading: loading,
    setLoading: setLoading,
    handleInputChange: handleInputChange,
  };
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
