import { useState, useMemo } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Header from './components/Header/Header';
import { Reference } from './containers/Reference';
import { Practise } from './containers/Practise';
import { SignIn } from './components/SignIn';
import { Register } from './components/Register';
import AuthContextProvider from './store/auth-context';
import './App.css';

function App() {
  const [route, setRoute] = useState('signin');
  const [signedIn, setSignedIn] = useState(false);
  const [mode, setMode] = useState('reference');
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    favourites: [],
    joined: '',
  });

  function onRouteChange(route) {
    setRoute(route);
    if (route === 'signin' || route === 'register') {
      setSignedIn(false);
    } else if (route === 'home') {
      setSignedIn(true);
    }
  }

  function onModeChange(mode) {
    setMode(mode);
  }

  function loadUser(user) {
    setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      favourites: user.favourites,
      joined: user.joined,
    });
  }

  const router = useMemo(
    () =>
      createBrowserRouter([
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
            <Reference id={user.id} favourites={user.favourites} />
          ) : (
            <Navigate to="/signin" replace />
          ),
        },
        {
          path: '/reference',
          element: user.id ? (
            <Reference id={user.id} favourites={user.favourites} />
          ) : (
            <Navigate to="/signin" replace />
          ),
        },
        {
          path: '/practise',
          element: user.id ? <Practise /> : <Navigate to="/signin" replace />,
        },
      ]),
    [user]
  );

  return (
    <div className="App">
      <AuthContextProvider>
        <Header
          isSignedIn={signedIn}
          routeChange={onRouteChange}
          modeChange={onModeChange}
        />
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

export default App;
