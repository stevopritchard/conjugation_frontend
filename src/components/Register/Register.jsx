import React from 'react';
import { Userform } from '../Userform';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerName: '',
      registerEmail: '',
      registerPassword: '',
      responseText: '',
    };
  }

  onNameChange = (event) => {
    this.setState({ registerName: event.target.value });
  };

  onEmailChange = (event) => {
    this.setState({ registerEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ registerPassword: event.target.value });
  };

  onSubmitRegister = () => {
    const { registerName, registerEmail, registerPassword } = this.state;
    if (
      registerName === '' ||
      registerEmail === '' ||
      registerPassword === ''
    ) {
      this.setState({ responseText: 'Please fill in all fields' });
    }
    fetch('http://localhost:3001/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          this.props.loadUser(user);
          this.props.routeChange('home');
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <Userform
        cardTitle={'Sign Up'}
        formGroup={[
          {
            controlId: 'formBasicName',
            type: 'text',
            placeholder: 'Enter name',
            onChange: this.onNameChange,
            value: this.state.registerName,
          },
          {
            controlId: 'formBasicEmail',
            type: 'email',
            placeholder: 'Enter email',
            onChange: this.onEmailChange,
            value: this.state.registerEmail,
          },
          {
            controlId: 'formBasicPassword',
            type: 'password',
            placeholder: 'Password',
            onChange: this.onPasswordChange,
            value: this.state.registerPassword,
          },
        ]}
        responseText={this.state.responseText}
        onSubmitFunction={this.onSubmitRegister}
        buttonTitle={'Register'}
      />
    );
  }
}

export default Register;
