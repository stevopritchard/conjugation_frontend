import { useEffect, useState, useCallback, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VerbTable from '../VerbTable/VerbTable';
import './Conjugation.css';
import { ConjugationContext } from '../../store/conjugation-context';

function Conjugation({ id }: { id: number }) {
  const {
    favourites,
    conjugation,
    responseText,
    addFavourite,
    removeFavourite,
  } = useContext(ConjugationContext);

  const [isFavourite, setIsFavourite] = useState(false);

  const checkFavourites = useCallback(
    function checkFavourites(verb: string) {
      return conjugation.infinitive === verb;
    },
    [conjugation.infinitive],
  );

  useEffect(() => {
    fetch('http://localhost:3001/api/check_favourite', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to check favourites');
        }
        return response.json();
      })
      .then((favouritesList) => {
        const isFav = favouritesList.some(checkFavourites);
        setIsFavourite(isFav);
      })
      .catch((err) => {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log(`Unexpected error: ${err}`);
        }
      });
  }, [id, favourites, checkFavourites]);

  function makeFavourite(verb: string, id: number) {
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
        <Card.Title>{conjugation.infinitive}</Card.Title>
        <p
          style={{ pointerEvents: 'none', color: 'tomato', fontSize: '0.75em' }}
        >
          {responseText}
        </p>
        <Row>
          <Col xs={11} sm={11} md={11} xl={11} lg={11}>
            <Card.Subtitle className="mb-2">
              Present Participle: {conjugation.gerund} -{' '}
              {conjugation.gerund_english}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2">
              Past Participle: {conjugation.past_participle} -{' '}
              {conjugation.past_participle_english}
            </Card.Subtitle>
          </Col>
          <Col xs={1} sm={1} md={1} xl={1} lg={1}>
            <i
              className="fas fa-star"
              style={starStyle}
              onClick={() => makeFavourite(conjugation.infinitive, id)}
            ></i>
          </Col>
        </Row>
        <VerbTable />
      </Card.Body>
    </Card>
  );
}

export default Conjugation;
