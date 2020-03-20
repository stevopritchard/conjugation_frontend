import React from 'react';
import Card from 'react-bootstrap/Card'

const VerbCard = ({verb}) => {
    return (
        <Card bg="light" style={{width: '18rem', margin: "20px"}}>
            <Card.Body>
                <Card.Title>{verb}</Card.Title>
                <Card.Text>Verb Table goes here...</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default VerbCard;