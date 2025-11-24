import { useEffect, useState, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VerbTable from '../VerbTable/VerbTable';
import './Conjugation.css';

function Conjugation({
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
  addFavourite,
  removeFavourite,
  id,
  favourites,
}) {
  const [isFavourite, setIsFavourite] = useState(false);

  const checkFavourites = useCallback(
    function checkFavourites(verb) {
      return infinitive === verb;
    },
    [infinitive]
  );

  useEffect(() => {
    fetch('http://localhost:3001/check_favourite', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((favouritesList) => {
        if (favourites !== null) {
          favouritesList.some(checkFavourites)
            ? setIsFavourite(true)
            : setIsFavourite(false);
        }
      });
  }, [id, favourites, checkFavourites]);

  function makeFavourite(verb, id) {
    if (isFavourite === true) {
      setIsFavourite(false);
      removeFavourite(verb, id);
    } else {
      setIsFavourite(true);
      addFavourite(verb, id);
    }
  }

  const styles = {
    starStyle: { color: isFavourite ? 'gold' : 'grey' },
  };

  const { starStyle } = styles;

  return (
    <Card className="conjugation">
      <Card.Body>
        <Card.Title>{infinitive}</Card.Title>
        <Row>
          <Col xs={11} sm={11} md={11} xl={11} lg={11}>
            <Card.Subtitle className="mb-2">
              Present Participle: {gerund.gerund} - {gerund.gerund_english}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2">
              Past Participle: {past_participle.pastparticiple} -{' '}
              {past_participle.pastparticiple_english}
            </Card.Subtitle>
          </Col>
          <Col xs={1} sm={1} md={1} xl={1} lg={1}>
            <i
              className="fas fa-star"
              style={starStyle}
              onClick={() => makeFavourite(infinitive, id)}
            ></i>
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
  );
}

export default Conjugation;
