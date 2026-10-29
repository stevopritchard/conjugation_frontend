import Register from './Register';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContextType } from '../../types/auth';
import { AuthContext } from '../../store/auth-context';

const testLoadUser = vi.fn();
const testSubmitFunction = vi.fn();

const registerRenderer = (
  providerProps: AuthContextType,
  loadUser: () => {},
) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <MemoryRouter initialEntries={['/']}>
        <Register loadUser={loadUser} />
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

let registerContext = generateContextValues();

beforeEach(() => {
  testSubmitFunction.mockClear();
  registerContext = generateContextValues();
});

describe('Register', () => {
  it('should render name, email and password-type input groups', () => {
    // arrange

    // act
    registerRenderer(registerContext, testLoadUser);

    // assert
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should call a submitForm function if the "Register" button is clicked', async () => {
    // arrange
    const user = userEvent.setup();

    // act
    registerRenderer(registerContext, testLoadUser);
    await user.click(screen.getByRole('button'));

    // assert
    expect(testSubmitFunction).toHaveBeenCalled();
  });
});
