import React from 'react'
import Question from '../Question/Question'

class Test extends React.Component {
    constructor() {
        super()
        this.state = {
            score: 0,
        }
    }
    render() {
        return (
            <div>
                <p>Test</p>
                <Question />
            </div>
        )
    }
}

export default Test