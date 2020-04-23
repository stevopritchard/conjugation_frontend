import React from 'react';
import Card from 'react-bootstrap/Card';

const Conjugation = ({ infinitive, gerund }) => {
 return (
    <Card style={{ width: '500px', margin: "20px"}}>
        <Card.Body>
            <Card.Title>{infinitive}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Present Participle: {gerund.gerund} - {gerund.gerund_english}</Card.Subtitle>
            <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
            </Card.Text>
        </Card.Body>
    </Card>
 )   
}

export default Conjugation;