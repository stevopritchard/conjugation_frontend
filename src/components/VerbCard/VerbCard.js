import React from 'react';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const VerbCard = ({ spanish, english, select }) => {
    return (
        <Card bg="light" style={{width: '325px', margin: "20px"}}>
            <Card.Body>
                <Card.Title>{spanish}</Card.Title>
                <Card.Text>{english}</Card.Text>
                <Button variant="secondary" onClick={select}>Select</Button>
            </Card.Body>
        </Card>
    )
}

export default VerbCard;

// export default class VerbCard extends React.Component {
//     render() {
//         const { spanish, english, select } = this.props
//         return (
//             <Card bg="light" style={{width: '325px', margin: "20px"}}>
//                 <Card.Body>
//                     <Card.Title>{spanish}</Card.Title>
//                     <Card.Text>{english}</Card.Text>
//                     <Button variant="secondary" onClick={select}>Select</Button>
//                 </Card.Body>
//             </Card>
//         )
//     }
// }