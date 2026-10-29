import SignIn from './SignIn';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContextType } from '../../types/auth';
import { AuthContext } from '../../store/auth-context';

export const testLoadUser = vi.fn();
const testSubmitFunction = vi.fn();

export const signInRenderer = (
  providerProps: AuthContextType,
  loadUser: () => {},
) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <MemoryRouter initialEntries={['/']}>
        <SignIn loadUser={loadUser} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

const generateContextValues = () => {
  return {
    formInputData: {},
    responseText: '',
    loading: false,
    handleInputChange: () => () => {},
    submitForm: testSubmitFunction,
    handleInputBlur: () => () => {},
    setResponseText: () => {},
    setLoading: () => {},
    resetForm: () => {},
  };
};

export let signInContext = generateContextValues();

beforeEach(() => {
  testSubmitFunction.mockClear();
  signInContext = generateContextValues();
});

describe('SignIn', () => {
  it('should render email and password-type input groups', () => {
    // arrange

    // act
    signInRenderer(signInContext, testLoadUser);

    // assert
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should call a submitForm function if the "Sign In" button is clicked', async () => {
    // arrange
    const user = userEvent.setup();
    // act
    signInRenderer(signInContext, testLoadUser);
    await user.click(screen.getByRole('button'));
    // assert
    expect(testSubmitFunction).toHaveBeenCalled();
  });
});
