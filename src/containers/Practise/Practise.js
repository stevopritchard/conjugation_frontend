import React from 'react'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
// import Test from '../../components/Test/Test'
import Question from '../../components/Question/Question'
import Conjugation from '../../components/Conjugation/Conjugation'
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
            score: 0
        };
    }

    getVerbs() {
        let tense = this.state.selectedTenses[Math.floor(Math.random()*this.state.selectedTenses.length)]
        console.log(tense)
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
        this.setState({ 
            testActive: selection, 
            currentQuestion: 1 
        })
        this.getVerbs()
    };

    selectTense = (e) => {
        console.log(e.target.id)
        if(e.target.checked === true) {
            this.setState({selectedTenses: this.state.selectedTenses.concat(e.target.id)
                }, function() {console.log(this.state.selectedTenses)}
            )
        } else if(e.target.checked === false) {
            this.setState({selectedTenses: this.state.selectedTenses.filter((item) => item !== e.target.id)
                }, function() {console.log(this.state.selectedTenses)}
            )
        }
    }

    setQuestions = (e) => {
        this.setState({ totalQuestions: e.target.value })
    }

    nextQuestion = (answer) => {

        this.setState({score: this.state.score+answer}, function(){console.log(this.state.score)})
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
            selectedTenses,
            totalQuestions,
            currentQuestion,
            conjugation,
            score
        } = this.state;
        return (
          <div>
              { testActive === true
              ?
              <Question 
                quit={this.startTest}
                questionNumber={currentQuestion}
                nextQuestion={this.nextQuestion}
                conjugation={conjugation}
                score={score}
              />
              :
              <Card>
                  <Card.Body>
                    <Card.Title>
                        Practise
                    </Card.Title>
                    <p>Your score is {score}</p>
                    <Form.Group>
                        <Row>
                            <Form.Check 
                                type='checkbox'
                                id='Presente'
                                label='Presente'
                                onChange={this.selectTense}
                            />
                            <Form.Check 
                                type='checkbox'
                                id='Pretérito'
                                label='Pretérito'
                                onChange={this.selectTense}
                            />
                            <Form.Check 
                                type='checkbox'
                                id='Imperfecto'
                                label='Imperfecto'
                                onChange={this.selectTense}
                            />
                        </Row>
                        <Row>
                            <Form.Check 
                                type='checkbox'
                                id='Presente perfecto'
                                label='Presente perfecto'
                                onChange={this.selectTense}
                            />
                            <Form.Check 
                                type='checkbox'
                                id='Pluscuamperfecto'
                                label='Pluscuamperfecto'
                                onChange={this.selectTense}
                            />
                            <Form.Check 
                                type='checkbox'
                                id='Futuro'
                                label='Futuro'
                                onChange={this.selectTense}
                            />
                        </Row>
                        <Row>
                            <Form.Check 
                                type='checkbox'
                                id='Condicional'
                                label='Condicional'
                                onChange={this.selectTense}
                            />
                            <Form.Check 
                                type='checkbox'
                                id='Condicional perfecto'
                                label='Condicional perfecto'
                                onChange={this.selectTense}
                            />
                            <Form.Check 
                                type='checkbox'
                                id='Futuro perfecto'
                                label='Futuro perfecto'
                                onChange={this.selectTense}
                            />
                        </Row>
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