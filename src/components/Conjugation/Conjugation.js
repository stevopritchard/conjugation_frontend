import React from 'react';
import Card from 'react-bootstrap/Card';
import VerbTable from '../VerbTable/VerbTable'

const Conjugation = ({ 
    infinitive, 
    gerund, 
    past_participle,
    indicative_present,
    indicative_preterite,
    indicative_imperfect,
    indicative_conditional,
    indicative_future
}) => {
 return (
    <Card style={{ width: '700px', margin: "20px"}}>
        <Card.Body>
            <Card.Title>{infinitive}</Card.Title>
            <Card.Subtitle className="mb-2">Present Participle: {gerund.gerund} - {gerund.gerund_english}</Card.Subtitle>
            <Card.Subtitle className="mb-2">Past Participle: {past_participle.pastparticiple} - {past_participle.pastparticiple_english}</Card.Subtitle>
            <VerbTable 
                indicative_present={indicative_present}
                indicative_preterite={indicative_preterite}
                indicative_imperfect={indicative_imperfect}
                indicative_conditional={indicative_conditional}
                indicative_future={indicative_future}
            />
        </Card.Body>
    </Card>
 )   
}

export default Conjugation;