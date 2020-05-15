import React from 'react';
import Reference from './containers/Reference/Reference';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';



class App extends React.Component {
  constructor() {
    super()
    this.state = {
      route: "signin",
      signedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        favourites: [],
        joined: ''
      }
    };
  }

  // componentDidUpdate(prevProps, prevState) {
    // if(this.state.user.id !== prevState.user.id) {
    //   fetch('http://localhost:5000/check_favourite', {
    //     method: 'post',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({
    //     id: prevState.user.id
    //     })
    //   })
    //   .then(response => response.json())
    //   .then(favourites => {
    //       this.setState({user: {
    //         favourites: favourites
    //         }
    //       })
      // })
    // }
  // }

  onRouteChange = ( route ) => {
      
    this.setState({route: route})
    if(route === 'signin' || route === 'register') {
      this.setState({signedIn: false})
    } else if(route === 'home'){
      this.setState({signedIn: true})
    }
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
      route 
    } = this.state;
    console.log(this.state.user.id)
    return (
      <div className="App">
        <Navigation isSignedIn={this.state.signedIn} routeChange={this.onRouteChange}/>
        { route === 'home'
          ?
          <Reference 
            id={this.state.user.id}
            favourites={this.state.user.favourites}
          />
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
}

export default App;
