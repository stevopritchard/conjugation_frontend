import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VerbTable from '../VerbTable/VerbTable'
import './Conjugation.css'

class Conjugation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isFavourite: false
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/check_favourite', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.props.id
            })
        })
        .then(response => response.json())
        .then(favourites => {
            if(this.props.favourites != null ){
                favourites.some(this.checkFavourites)
                ?
                this.setState({isFavourite: true})
                :
                this.setState({isFavourite: false})
            }
        })
    }

    checkFavourites = (verb) => {
        return this.props.infinitive === verb
    }

    makeFavourite = (verb, id) => {
        if(this.state.isFavourite === true) {
            this.setState({isFavourite: false})
            this.props.removeFavourite(verb, id)
        } else {
            this.setState({isFavourite: true})
            this.props.addFavourite(verb, id)
        }
    }

    render() {
        const { 
            infinitive, 
            gerund, 
            past_participle,
            indicative_present,
            indicative_presentperfect,
            indicative_preterite,
            indicative_imperfect,
            indicative_pastperfect,
            indicative_conditional,
            indicative_conditionalperfect,
            indicative_future,
            indicative_futureperfect,
            imperative_affirmative,
            imperative_negative,
            subjunctive_present,
            subjunctive_presentperfect,
            subjunctive_pastperfect,
            subjunctive_imperfect,
            subjunctive_future,
            subjunctive_futureperfect,
            id
        } = this.props;
    
    
        const styles = {
            starStyle: {color: this.state.isFavourite ? 'gold' : 'grey'}
        };
    
        const { starStyle } = styles;
    
        return (
            <Card className='conjugation' style={{ width: '100vw', margin: "20px"}}>
                <Card.Body>
                    <Card.Title>{infinitive}</Card.Title>
                    <Row>
                        <Col xs={11} sm={11} md={11} xl={11} lg={11}>
                            <Card.Subtitle 
                                className="mb-2">Present Participle: {gerund.gerund} - {gerund.gerund_english}
                            </Card.Subtitle>
                            <Card.Subtitle 
                                className="mb-2">Past Participle: {past_participle.pastparticiple} - {past_participle.pastparticiple_english}
                            </Card.Subtitle>
                        </Col>
                        <Col xs={1} sm={1} md={1} xl={1} lg={1}>
                            <i className="fas fa-star" style={starStyle} onClick={() => this.makeFavourite(infinitive, id)}></i>
                        </Col>
                    </Row>
                    <VerbTable 
                        indicative_present={indicative_present}
                        indicative_presentperfect={indicative_presentperfect}
                        indicative_preterite={indicative_preterite}
                        indicative_imperfect={indicative_imperfect}
                        indicative_pastperfect={indicative_pastperfect}
                        indicative_conditional={indicative_conditional}
                        indicative_conditionalperfect={indicative_conditionalperfect}
                        indicative_future={indicative_future}
                        indicative_futureperfect={indicative_futureperfect}
                        imperative_affirmative={imperative_affirmative}
                        imperative_negative={imperative_negative}
                        subjunctive_present={subjunctive_present}
                        subjunctive_presentperfect={subjunctive_presentperfect}
                        subjunctive_pastperfect={subjunctive_pastperfect}
                        subjunctive_imperfect={subjunctive_imperfect}
                        subjunctive_future={subjunctive_future}
                        subjunctive_futureperfect={subjunctive_futureperfect}
                    />
                </Card.Body>
            </Card>
        )   
    }
}

export default Conjugation;