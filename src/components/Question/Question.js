import React from 'react';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import './Question.css'

const Question = ({ questionNumber, nextQuestion, quit, conjugation, score, randNum }) => {
    const pronouns = {
        'form_1s':'Yo', 
        'form_2s':'Tú', 
        'form_3s':'Él/Ella/Ud.', 
        'form_1p':'Nosotros', 
        'form_2p':'Vosostros', 
        'form_3p':'Ellos/Ellas/Uds.'
    }
    var buttons = document.getElementsByTagName('input') 
    var forms = Object.keys(conjugation);
    var correctForm = forms[1+(randNum)]
    var correctPronoun = pronouns[correctForm];
    var answer = 0;
    const checked = (e)=> {
        if(e.target.id ===correctForm) {
            answer = 1
        } 
    }

    function uncheckButtons() {
        for (let i=0; i<buttons.length; i++) {
            buttons[i].checked = false
        }
    }
    
    function submitAnswer() {
        let checkedButtons = 0
        for (let i=0; i<buttons.length; i++) {
            if(buttons[i].checked){
                checkedButtons += 1
            }
        }
        if(checkedButtons > 0){
            nextQuestion(answer)
        }
    }

    return (
        <Card>
            <Card.Title>Question {questionNumber}</Card.Title>
            <p>Your score is {score}</p>
            <p>{correctPronoun+" ["+conjugation.infinitive+"]"}</p>
            <Form.Group>
                <Row>
                    <Col xs={{span:8, offset: 4}} sm={{span:4, offset: 2}} md={{span:4, offset: 2}} xl={{span:4, offset: 2}} lg={{span:4, offset: 2}}>
                        <Form.Check 
                            // ref={radio}
                            type='radio'
                            name='multipleChoice'
                            id={forms[1]}
                            label={conjugation[forms[1]]}
                            onChange={checked}
                        />
                    </Col>
                    <Col xs={{span:8, offset: 4}} sm={{span:4, offset: 2}} md={{span:4, offset: 2}} xl={{span:4, offset: 2}} lg={{span:4, offset: 2}}>
                        <Form.Check
                            type='radio'
                            name='multipleChoice'
                            id={forms[2]}
                            label={conjugation[forms[2]]}
                            onChange={checked}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={{span:8, offset: 4}} sm={{span:4, offset: 2}} md={{span:4, offset: 2}} xl={{span:4, offset: 2}} lg={{span:4, offset: 2}}>
                        <Form.Check
                            type='radio'
                            name='multipleChoice'
                            id={forms[3]}
                            label={conjugation[forms[3]]}
                            onChange={checked}
                        />
                    </Col>
                    <Col xs={{span:8, offset: 4}} sm={{span:4, offset: 2}} md={{span:4, offset: 2}} xl={{span:4, offset: 2}} lg={{span:4, offset: 2}}>
                        <Form.Check
                            type='radio'
                            name='multipleChoice'
                            id={forms[4]}
                            label={conjugation[forms[4]]}
                            onChange={checked}
                        />
                    </Col>
                </Row>
            </Form.Group>
            <Row>
                <Button
                    onClick={() => {submitAnswer(); uncheckButtons()}}
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