import React from 'react';
import { Card, Form, Button, FormGroup } from 'react-bootstrap'

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: "",
            signInPassword: ""
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
            <Card style={{ width: '25rem' ,margin: "0 auto"}}>
                <Card.Body>
                    <Card.Title>Sign In</Card.Title>
                    <FormGroup>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            onChange = {this.onEmailChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            onChange= {this.onPasswordChange}
                        />
                    </FormGroup>
                    <Button 
                        variant="primary" 
                        type="submit"
                        onClick={this.onSubmitSignIn}
                    >
                        Submit
                    </Button>
                    <Form.Text 
                        onClick={() => routeChange("register")}
                        style={{textDecoration: "underline", cursor: "pointer"}}
                    >
                    Register
                    </Form.Text>
                </Card.Body>
            </Card>
        )
    }
}

export default SignIn