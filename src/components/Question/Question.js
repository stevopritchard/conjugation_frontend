import React from 'react';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

//I think answers will be accompanied by 'radio' control
//https://react-bootstrap.github.io/components/forms/#forms-form-check


const Question = ({ questionNumber, nextQuestion, quit, conjugation, score }) => {
    const pronouns = {'form_1s':'Yo', 'form_2s':'Tú', 'form_3s':'Él/Ella/Ud.', 'form_1p':'Nosotros', 'form_2p':'Vosostros', 'form_3p':'Ellos/Ellas/Uds.'}
    var forms = Object.keys(conjugation);
    var correctForm = forms[1+(Math.floor(Math.random()*(forms.length-1)))]
    var correctPronoun = pronouns[correctForm];
    var answer = 0;
    const checked = (e)=> {
        console.log(e.target.id+", "+correctForm)
        if(e.target.id ===correctForm) {
            answer += 1
        } 
    }

    function uncheckButtons() {
        let buttons = document.getElementsByTagName('input') 
        for (let i=0; i<buttons.length; i++) {
            buttons[i].checked = false
        }
    }
    
    return (
        <Card>
            <Card.Title>Question {questionNumber}</Card.Title>
            <p>Your score is {score}</p>
            <p>{correctPronoun+" ["+conjugation.infinitive+"]"}</p>
            <Form.Group>
                <Row>
                    <Form.Check
                        type='radio'
                        name='multipleChoice'
                        id={forms[1]}
                        label={conjugation[forms[1]]}
                        onChange={checked}
                    />
                    <Form.Check
                        type='radio'
                        name='multipleChoice'
                        id={forms[2]}
                        label={conjugation[forms[2]]}
                        onChange={checked}
                    />
                </Row>
                <Row>
                    <Form.Check
                        type='radio'
                        name='multipleChoice'
                        id={forms[3]}
                        label={conjugation[forms[3]]}
                        onChange={checked}
                    />
                    <Form.Check
                        type='radio'
                        name='multipleChoice'
                        id={forms[4]}
                        label={conjugation[forms[4]]}
                        onChange={checked}
                    />
                </Row>
            </Form.Group>
            <Row>
                <Button
                    onClick={() => {nextQuestion(answer); uncheckButtons()}}
                >
                    Next
                </Button>
                <Button 
                    variant='danger'
                    onClick={() => quit(false)}
                >
                    Quit
                </Button>
            </Row>
        </Card>
    )        
};

export default Question;