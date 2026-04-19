import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
import type { User } from '../types/user';

export type FormInputDataType = {
  [prop: string]: string;
};

export type AuthContextType = {
  formInputData: FormInputDataType;
  responseText: string;
  setResponseText: Dispatch<SetStateAction<string>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  handleInputChange: (
    fieldName: string,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  submitForm: (
    formType: 'register' | 'signin',
    loadUser: (user: User) => void,
    navigate: NavigateFunction,
  ) => void;
  resetForm: () => void;

  handleInputBlur: (
    fieldName: string,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type FormGroupType = {
  controlId: 'formBasicName' | 'formBasicEmail' | 'formBasicPassword';
  type: 'text' | 'email' | 'password';
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};
