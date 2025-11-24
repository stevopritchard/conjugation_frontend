import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import Scroll from '../../components/Scroll/Scroll';
import CardList from '../../components/CardList/CardList';
import { Conjugation } from '../../components/Conjugation';
import './Reference.css';

function Reference({ id }) {
  const [searchfield, setSearchfield] = useState('');
  const [favourites, setFavourites] = useState([]);
  const [filteredVerbs, setFilteredVerbs] = useState([]);
  const [verbSelected, setVerbSelected] = useState(false);
  const [infinitive, setInfinitive] = useState('');
  const [gerund, setGerund] = useState('');
  const [past_participle, setpast_participle] = useState('');
  const [indicative_present, setindicative_present] = useState([]);
  const [indicative_presentperfect, setindicative_presentperfect] = useState(
    []
  );
  const [indicative_preterite, setindicative_preterite] = useState([]);
  const [indicative_imperfect, setindicative_imperfect] = useState([]);
  const [indicative_pastperfect, setindicative_pastperfect] = useState([]);
  const [indicative_conditional, setindicative_conditional] = useState([]);
  const [indicative_conditionalperfect, setindicative_conditionalperfect] =
    useState([]);
  const [indicative_future, setindicative_future] = useState([]);
  const [indicative_futureperfect, setindicative_futureperfect] = useState([]);
  const [imperative_affirmative, setimperative_affirmative] = useState([]);
  const [imperative_negative, setimperative_negative] = useState([]);
  const [subjunctive_present, setsubjunctive_present] = useState([]);
  const [subjunctive_presentperfect, setsubjunctive_presentperfect] = useState(
    []
  );
  const [subjunctive_pastperfect, setsubjunctive_pastperfect] = useState([]);
  const [subjunctive_imperfect, setsubjunctive_imperfect] = useState([]);
  const [subjunctive_future, setsubjunctive_future] = useState([]);
  const [subjunctive_futureperfect, setsubjunctive_futureperfect] = useState(
    []
  );

  const listFavourites = useCallback(
    async function listFavourites() {
      try {
        const response = await fetch('http://localhost:3001/check_favourite', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Failed to fetch favorites');

        const favoriteInfinitives = await response.json();
        setFavourites(favoriteInfinitives);

        const verbPromises = favoriteInfinitives.map((infinitive) =>
          fetch('http://localhost:3001/favourite_verbs', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ infinitive }),
          }).then((res) => res.json())
        );

        const verbs = await Promise.all(verbPromises);
        setFilteredVerbs(verbs);
      } catch (err) {
        console.error(err);
        // TODO: Set error state
      }
    },
    [id]
  );

  useEffect(() => {
    if (!filteredVerbs?.length) {
      listFavourites();
    }
  }, [filteredVerbs, listFavourites]);

  function changeOnSearch(event) {
    setSearchfield(event.target.value.toLowerCase());
  }

  function searchVerbs() {
    setVerbSelected(false);
    if (searchfield !== '') {
      fetch('http://localhost:3001/infinitive', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          infinitive: searchfield,
        }),
      })
        .then((response) => response.json())
        .then((data) => setFilteredVerbs(data))
        .catch((err) => console.log(err));
    } else {
      setFilteredVerbs([]);
    }
  }

  function verbSelection(selection, verb) {
    setVerbSelected(selection);
    setInfinitive(verb);
    if (selection === true) {
      const tenses = [
        'http://localhost:3001/gerund',
        'http://localhost:3001/past_participle',
        'http://localhost:3001/indicative_present',
        'http://localhost:3001/indicative_presentperfect',
        'http://localhost:3001/indicative_preterite',
        'http://localhost:3001/indicative_imperfect',
        'http://localhost:3001/indicative_pastperfect',
        'http://localhost:3001/indicative_conditional',
        'http://localhost:3001/indicative_conditionalperfect',
        'http://localhost:3001/indicative_future',
        'http://localhost:3001/indicative_futureperfect',
        'http://localhost:3001/imperative_affirmative',
        'http://localhost:3001/imperative_negative',
        'http://localhost:3001/subjunctive_present',
        'http://localhost:3001/subjunctive_presentperfect',
        'http://localhost:3001/subjunctive_pastperfect',
        'http://localhost:3001/subjunctive_imperfect',
        'http://localhost:3001/subjunctive_future',
        'http://localhost:3001/subjunctive_futureperfect',
      ];
      Promise.all(
        tenses.map(async function (tense) {
          return fetch(tense, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              infinitive: verb,
            }),
          }).then((response) => Promise.resolve(response.json())); //Promise.resolve required to return map array
        })
      )
        .then((tenses) => {
          setGerund(tenses[0]);
          setpast_participle(tenses[1]);
          setindicative_present(tenses[2]);
          setindicative_presentperfect(tenses[3]);
          setindicative_preterite(tenses[4]);
          setindicative_imperfect(tenses[5]);
          setindicative_pastperfect(tenses[6]);
          setindicative_conditional(tenses[7]);
          setindicative_conditionalperfect(tenses[8]);
          setindicative_future(tenses[9]);
          setindicative_futureperfect(tenses[10]);
          setimperative_affirmative(tenses[11]);
          setimperative_negative(tenses[12]);
          setsubjunctive_present(tenses[13]);
          setsubjunctive_presentperfect(tenses[14]);
          setsubjunctive_pastperfect(tenses[15]);
          setsubjunctive_imperfect(tenses[16]);
          setsubjunctive_future(tenses[17]);
          setsubjunctive_futureperfect(tenses[18]);
        })
        .catch((err) => console.log(err));
    }
  }

  function addFavourite(verb, id) {
    fetch('http://localhost:3001/add_favourite', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        infinitive: verb,
        id: id,
      }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }

  function removeFavourite(verb, id) {
    fetch('http://localhost:3001/remove_favourite', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        infinitive: verb,
        id: id,
      }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <SearchBar searchChange={changeOnSearch} filterVerbs={searchVerbs} />
      {verbSelected === true ? (
        <Conjugation
          infinitive={infinitive}
          gerund={gerund}
          past_participle={past_participle}
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
          addFavourite={addFavourite}
          removeFavourite={removeFavourite}
          id={id}
          favourites={favourites}
        />
      ) : (
        <Scroll>
          <CardList verbs={filteredVerbs} select={verbSelection} />
        </Scroll>
      )}
    </div>
  );
}

export default Reference;
