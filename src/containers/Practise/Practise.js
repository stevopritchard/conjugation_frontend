import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Question from '../../components/Question/Question'
import './Practise.css'

class Practise extends React.Component {
    constructor() {
        super()
        this.state = {
            testActive: false,
            selectedTenses: [],
            currentQuestion: 1,
            totalQuestions: 6,
            conjugation: {},
            score: 0,
            testCounter: 0
        };
        this.randNum = Math.floor(Math.random()*(5))
    }

    getVerbs() {
        let tense = this.state.selectedTenses[Math.floor(Math.random()*this.state.selectedTenses.length)]
        fetch('http://localhost:5000/get_conjugations',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                tense: tense
            })
        })
        .then(response => response.json())
        .then(verbs => this.setState({conjugation: verbs[0]}))
        .catch(err => console.log(err))
    }

    startTest = (selection) => { //this is a function expression... function declaration didn't work!
        let checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
        if(this.state.selectedTenses.length > 0) {
            if(selection === true) { this.setState({ score: 0 })}
            this.setState({ 
                testActive: selection, 
                currentQuestion: 1,
                testCounter: this.state.testCounter+1 
            })
            this.getVerbs()
        }
        if(selection === false) { 
            if(this.state.currentQuestion < this.state.totalQuestions){
                this.setState({ score: 0 })
            }
            this.setState({ selectedTenses: [] })
        }
    };

    selectTense = (e) => {
        if(e.target.checked === true) {
            this.setState({selectedTenses: this.state.selectedTenses.concat(e.target.id)})
        } else if(e.target.checked === false) {
            this.setState({selectedTenses: this.state.selectedTenses.filter((item) => item !== e.target.id)
                }
            )
        }
    }

    setQuestions = (e) => {
        this.setState({ totalQuestions: e.target.value })
    }

    nextQuestion = (answer) => {
            this.setState({score: this.state.score+answer})
            const {currentQuestion, totalQuestions} = this.state
            if(currentQuestion < totalQuestions) {
                this.setState({currentQuestion: this.state.currentQuestion+1})
                this.getVerbs()
            } else {
                this.startTest(false)
                this.setState({selectedTenses:[]})
            }
    }

    render() {
        const {
            testActive, 
            totalQuestions,
            currentQuestion,
            conjugation,
            score,
            testCounter
        } = this.state;
        return (
          <div className="container-fluid">
              { testActive === true
                ?
                <Question 
                    quit={this.startTest}
                    questionNumber={currentQuestion}
                    nextQuestion={this.nextQuestion}
                    conjugation={conjugation}
                    score={score}
                    randNum={this.randNum}
                />
                :
                <Card className='practiseCard'>
                    <Card.Body>
                        <Card.Title>
                            Practise
                        </Card.Title>
                        {
                            testCounter === 0 
                            ?
                            null
                            :
                            <p>Your score is {score} out of {totalQuestions}</p>
                        }
                        <Form.Group>
                            <div className="checkboxes">
                                <Row>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Presente'
                                            label='Presente'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Pretérito'
                                            label='Pretérito'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Imperfecto'
                                            label='Imperfecto'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Presente perfecto'
                                            label='Presente perfecto'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Pluscuamperfecto'
                                            label='Pluscuamperfecto'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Futuro'
                                            label='Futuro'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Condicional'
                                            label='Condicional'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Condicional perfecto'
                                            label='Condicional perfecto'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                    <Col xs={12} sm={4} md={4} xl={4} lg={4}>
                                        <Form.Check 
                                            type='checkbox'
                                            id='Futuro perfecto'
                                            label='Futuro perfecto'
                                            onChange={this.selectTense}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <Form.Label>Number of Questions: {totalQuestions}
                            </Form.Label>
                                <Form.Control 
                                    type='range'
                                    min="1" max="10" step="1"
                                    onChange={(e) => this.setState({ totalQuestions: e.target.value }) }
                                />
                        </Form.Group>
                        <Button 
                            variant="primary"
                            onClick={() => this.startTest(true)}
                        >
                            Begin
                        </Button>
                    </Card.Body>
                </Card>
              }
          </div>  
        )
    }
}

export default Practise;