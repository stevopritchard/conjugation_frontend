import React from 'react';
import Userform from '../Userform/Userform'

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: "",
            signInPassword: "",
            responseText: ""
        }
    }

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

    onSubmitSignIn = () => {
        const { signInEmail, signInPassword } = this.state;
        fetch('http://localhost:5000/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: signInEmail,
              password: signInPassword
            })
        })
        .then(response => response.json())
        .then(user => {if(user.id) {
            this.props.loadUser(user)
            this.props.routeChange("home");
            }
        })
    }

    render(){
        const { routeChange } = this.props;
        return(
            <Userform 
                cardTitle = {"Sign In"}
                formGroup = {[
                    {
                        controlId: "formBasicEmail",
                        type: "email",
                        placeholder: "Enter email",
                        onChange: this.onEmailChange
                    },
                    {
                        controlId: "formBasicPassword",
                        type: "password",
                        placeholder: "Password",
                        onChange: this.onPasswordChange

                    }
                ]}
                onSubmitFunction = {this.onSubmitSignIn}
                buttonTitle = {"Sign In"}
                routeChangeFunction = {routeChange}
            />
        )
    }
}

export default SignIn