import React from 'react';
import Card from 'react-bootstrap/Card'

const VerbCard = ({ spanish, english }) => {
    return (
        <Card bg="light" style={{width: '500px', margin: "20px"}}>
            <Card.Body>
                <Card.Title>{spanish}</Card.Title>
                <Card.Text>{english}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default VerbCard;