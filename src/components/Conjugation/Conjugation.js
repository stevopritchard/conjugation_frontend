import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VerbTable from '../VerbTable/VerbTable'

const Conjugation = ({ 
    infinitive, 
    gerund, 
    past_participle,
    indicative_present,
    indicative_preterite,
    indicative_imperfect,
    indicative_conditional,
    indicative_future,
    addFavourite,
    id,
    isFavourite
}) => {



    const starStyle = () => {
        return (
            {color: isFavourite ? 'gold' : 'blue'}
        )
    };

    // const { starStyle } = styles;

    return (
        <Card style={{ width: '700px', margin: "20px"}}>
            <Card.Body>
                <Card.Title>{infinitive}</Card.Title>
                <Row>
                    <Col>
                        <Card.Subtitle 
                            className="mb-2">Present Participle: {gerund.gerund} - {gerund.gerund_english}
                        </Card.Subtitle>
                        <Card.Subtitle 
                            className="mb-2">Past Participle: {past_participle.pastparticiple} - {past_participle.pastparticiple_english}
                        </Card.Subtitle>
                    </Col>
                    <Col>
                        <i className="fas fa-star" style={{starStyle}} onClick={() => addFavourite(infinitive, id)}></i>
                    </Col>
                </Row>
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