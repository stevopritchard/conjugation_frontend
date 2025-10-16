import React, { useState } from 'react';
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

  return (
    <div className="App">
      <AuthContextProvider>
        <Header
          isSignedIn={signedIn}
          routeChange={onRouteChange}
          modeChange={onModeChange}
        />
        {route === 'home' ? (
          mode === 'reference' ? (
            <Reference id={user.id} favourites={user.favourites} />
          ) : (
            <Practise />
          )
        ) : route === 'signin' ? (
          <SignIn routeChange={onRouteChange} loadUser={loadUser} />
        ) : (
          <Register routeChange={onRouteChange} loadUser={loadUser} />
        )}
      </AuthContextProvider>
    </div>
  );
}

export default App;
