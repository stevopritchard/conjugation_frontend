import { useState, useMemo } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import RootLayout from './containers/RootLayout/RootLayout';
import { Reference } from './containers/Reference';
import { Practise } from './containers/Practise';
import { SignIn } from './components/SignIn';
import { Register } from './components/Register';
import AuthContextProvider from './store/auth-context';
import ConjugationContextProvider from './store/conjugation-context';
import './App.css';
import type { User } from './types/user';

const initialUserState = {
  id: 0,
  name: '',
  email: '',
  favourites: [] as string[],
  joined: '',
};

function App() {
  const [user, setUser] = useState(initialUserState);

  function loadUser(user: User) {
    setUser({
      id: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id,
      name: user.name,
      email: user.email,
      favourites: user.favourites,
      joined: user.joined,
    });
  }

  function signOut() {
    setUser(initialUserState);
  }

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <RootLayout user={user} signOut={signOut} />,
          children: [
            {
              path: '/signin',
              element: <SignIn loadUser={loadUser} />,
            },
            {
              path: '/register',
              element: <Register loadUser={loadUser} />,
            },
            {
              path: '/',
              element: user.id ? (
                <ConjugationContextProvider>
                  <Reference id={user.id} />
                </ConjugationContextProvider>
              ) : (
                <Navigate to="/signin" replace />
              ),
            },
            {
              path: '/reference',
              element: user.id ? (
                <ConjugationContextProvider>
                  <Reference id={user.id} />
                </ConjugationContextProvider>
              ) : (
                <Navigate to="/signin" replace />
              ),
            },
            {
              path: '/practise',
              element: user.id ? (
                <Practise />
              ) : (
                <Navigate to="/signin" replace />
              ),
            },
          ],
        },
      ]),
    [user],
  );

  return (
    <div className="App">
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

export default App;
