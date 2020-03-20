import React from 'react'
import { Card, Form, Button, FormGroup } from 'react-bootstrap'

function routes(props) {
    if (props) {
        return (
            <Form.Text onClick = {() => props('register')} className="text-muted">
                Register
            </Form.Text>
        )
    }
}

class UserForm extends React.Component {
    render() {
        const { 
            cardTitle, 
            formGroup, 
            onSubmitFunction, 
            responseText,
            routeChangeFunction, 
            buttonTitle 
        } = this.props
        return (
            <Card style={{ width: '25rem' ,margin: "0 auto"}}>
                <Card.Body>
                    <Card.Title>{cardTitle}</Card.Title>
                        {
                            formGroup.map((val, i) => {
                                return (
                                    <FormGroup controlId={formGroup[i].controlId}>
                                        <Form.Control
                                            type = {formGroup[i].type}
                                            placeholder = {formGroup[i].placeholder}
                                            onChange = {formGroup[i].onChange}
                                        />
                                    </FormGroup>
                                );
                            })
                        }
                        <p style={{pointerEvents: 'none', color:'tomato', fontSize:'0.75em'}}>{responseText}</p>
                        <Button variant="primary" type="submit" onClick= {() => onSubmitFunction()}>
                            {buttonTitle}
                        </Button>
                        {routes(routeChangeFunction)}
                </Card.Body>
            </Card>
        )
        
    }
}

export default UserForm