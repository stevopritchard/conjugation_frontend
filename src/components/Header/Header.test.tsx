import { render, screen } from '@testing-library/react';
import Header from './Header.tsx';
import { AuthContext } from '../../store/auth-context.tsx';
import { AuthContextType } from '../../types/auth.ts';
import { MemoryRouter } from 'react-router-dom';
import { User } from '../../types/user.ts';
import userEvent from '@testing-library/user-event';

const testSignOutFn = vi.fn();

afterEach(() => {
  testSignOutFn.mockClear();
});

const customHeaderRender = (providerProps: AuthContextType, user: User) => {
  return render(
    <AuthContext.Provider value={providerProps}>
      <MemoryRouter initialEntries={['/']}>
        <Header user={user} signOut={testSignOutFn} />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

const testUser0: User = {
  id: 0,
  name: '',
  email: '',
  favourites: [] as string[],
  joined: '',
};

const testUser1: User = {
  id: 1,
  name: '',
  email: '',
  favourites: [] as string[],
  joined: '',
};

const generateContextValues = () => {
  return {
    formInputData: {},
    responseText: '',
    setResponseText: () => {},
    loading: false,
    setLoading: () => {},
    handleInputChange: () => () => {},
    submitForm: () => {},
    resetForm: testSignOutFn,
    handleInputBlur: () => () => {},
  };
};

describe('Header', () => {
  it('should render Sign In and Register buttons if no id is received', () => {
    // arrange
    const providedContext = generateContextValues();

    // act
    customHeaderRender(providedContext, testUser0);

    // assert
    expect(screen.getByText(/Sign In/)).toBeInTheDocument();
    expect(screen.getByText(/Register/)).toBeInTheDocument();
  });

  it('should render Reference, Practise and Sign Out buttons if an id is received', () => {
    // arrange
    const providedContext = generateContextValues();

    // act
    customHeaderRender(providedContext, testUser1);

    // assert
    expect(screen.getByText(/Reference/)).toBeInTheDocument();
    expect(screen.getByText(/Practise/)).toBeInTheDocument();
    expect(screen.getByText(/Sign Out/)).toBeInTheDocument();
  });

  it('should call reset function if Sign Out Nav Link element is clicked', async () => {
    // arrange
    const providedContext = generateContextValues();
    const user = userEvent.setup();

    // act
    customHeaderRender(providedContext, testUser1);
    await user.click(screen.getByText(/Sign Out/));

    // assert
    expect(testSignOutFn).toHaveBeenCalled();
  });
});
