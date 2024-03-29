import React from 'react';
import Header from './components/Header/Header';
import {Reference} from './containers/Reference';
import {Practise} from './containers/Practise';
import {SignIn} from './components/SignIn';
import {Register} from './components/Register';
import './App.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      route: "signin",
      signedIn: false,
      mode: 'reference',
      user: {
        id: '',
        name: '',
        email: '',
        favourites: [],
        joined: ''
      }
    };
  }

  onRouteChange = ( route ) => {
      
    this.setState({route: route})
    if(route === 'signin' || route === 'register') {
      this.setState({signedIn: false})
    } else if(route === 'home'){
      this.setState({signedIn: true})
    }
  }

  onModeChange = (mode) => {
    this.setState({mode: mode})
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        favourites: user.favourites,
        joined: user.joined
      }
    })
  }
  

  render() {
    const { 
      route,
      mode
    } = this.state;
    return (
      <div className="App">
        <Header 
          isSignedIn={this.state.signedIn} 
          routeChange={this.onRouteChange}
          modeChange={this.onModeChange}
        />
        { route === 'home'
          ?
          ( mode === 'reference'
            ?
            <Reference
              id={this.state.user.id}
              favourites={this.state.user.favourites}
            />
            :
            <Practise />
          )
          : 
          ( route ==='signin' 
            ?
            <SignIn 
              routeChange={this.onRouteChange}
              loadUser={this.loadUser}
            />
            :
            <Register 
              routeChange={this.onRouteChange}
              loadUser={this.loadUser}
            />
          )
        }
      </div>
    )
  }
};

export default App;
