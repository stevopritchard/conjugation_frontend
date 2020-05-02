import React from 'react';
import { Card, Form, Button, FormGroup } from 'react-bootstrap'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registerEmail: "",
            registerPassword: ""
        }
    }

    onNameChange = (event) => {
        this.setState({registerName: event.target.value})
    }

    onEmailChange = (event) => {
        this.setState({registerEmail: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({registerPassword: event.target.value})
    }

    onSubmitRegister = () => {
        const { registerName, registerEmail, registerPassword } = this.state;
        fetch('http://localhost:5000/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: registerName,
                email: registerEmail,
                password: registerPassword
            })
        })
        .then(response => response.json())
        .then(user => {if(user.id) {
            this.props.loadUser(user)
            this.props.routeChange("home");
            }
        })
    }

    render() {
        
        return(
            <Card style={{ width: '25rem' ,margin: "0 auto"}}>
                <Card.Body>
                    <Card.Title>Register</Card.Title>
                    <FormGroup>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            onChange={this.onNameChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            onChange={this.onEmailChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            onChange={this.onPasswordChange}
                        />
                    </FormGroup>
                    <Button 
                        variant="primary" 
                        type="submit"
                        onClick={this.onSubmitRegister}
                    >
                        Register
                    </Button>
                </Card.Body>
            </Card>
        )
    }
}

export default Register