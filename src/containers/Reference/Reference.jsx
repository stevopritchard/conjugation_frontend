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
  const [conjugation, setConjugation] = useState({
    infinitive: '',
    gerund: '',
    past_participle: '',
    indicative_present: [],
    indicative_presentperfect: [],
    indicative_preterite: [],
    indicative_imperfect: [],
    indicative_pastperfect: [],
    indicative_conditional: [],
    indicative_conditionalperfect: [],
    indicative_future: [],
    indicative_futureperfect: [],
    imperative_affirmative: [],
    imperative_negative: [],
    subjunctive_present: [],
    subjunctive_presentperfect: [],
    subjunctive_pastperfect: [],
    subjunctive_imperfect: [],
    subjunctive_future: [],
    subjunctive_futureperfect: [],
  });

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
        // console.log(favoriteInfinitives);

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
    listFavourites();
  }, [listFavourites]);

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
      listFavourites();
    }
  }

  function verbSelection(selection, verb) {
    setVerbSelected(selection);
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
          setConjugation({
            infinitive: verb,
            gerund: tenses[0],
            past_participle: tenses[1],
            indicative_present: tenses[2],
            indicative_presentperfect: tenses[3],
            indicative_preterite: tenses[4],
            indicative_imperfect: tenses[5],
            indicative_pastperfect: tenses[6],
            indicative_conditional: tenses[7],
            indicative_conditionalperfect: tenses[8],
            indicative_future: tenses[9],
            indicative_futureperfect: tenses[10],
            imperative_affirmative: tenses[11],
            imperative_negative: tenses[12],
            subjunctive_present: tenses[13],
            subjunctive_presentperfect: tenses[14],
            subjunctive_pastperfect: tenses[15],
            subjunctive_imperfect: tenses[16],
            subjunctive_future: tenses[17],
            subjunctive_futureperfect: tenses[18],
          });
        })
        .catch((err) => console.log(err));
    }
  }

  async function addFavourite(verb, id) {
    try {
      const response = await fetch('http://localhost:3001/add_favourite', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ infinitive: verb, id }),
      });

      if (!response.ok) throw new Error('Failed to add favorite');

      await listFavourites(); // Reload favorites
    } catch (err) {
      console.error(err);
      // TODO: Show error to user
    }
  }

  async function removeFavourite(verb, id) {
    try {
      const response = await fetch('http://localhost:3001/remove_favourite', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ infinitive: verb, id }),
      });

      if (!response.ok) throw new Error('Failed to add favorite');

      await listFavourites(); // Reload favorites
    } catch (err) {
      console.error(err);
      // TODO: Show error to user
    }
  }

  return (
    <div>
      <SearchBar searchChange={changeOnSearch} filterVerbs={searchVerbs} />
      {verbSelected === true ? (
        <Conjugation
          infinitive={conjugation.infinitive}
          gerund={conjugation.gerund}
          past_participle={conjugation.past_participle}
          indicative_present={conjugation.indicative_present}
          indicative_presentperfect={conjugation.indicative_presentperfect}
          indicative_preterite={conjugation.indicative_preterite}
          indicative_imperfect={conjugation.indicative_imperfect}
          indicative_pastperfect={conjugation.indicative_pastperfect}
          indicative_conditional={conjugation.indicative_conditional}
          indicative_conditionalperfect={
            conjugation.indicative_conditionalperfect
          }
          indicative_future={conjugation.indicative_future}
          indicative_futureperfect={conjugation.indicative_futureperfect}
          imperative_affirmative={conjugation.imperative_affirmative}
          imperative_negative={conjugation.imperative_negative}
          subjunctive_present={conjugation.subjunctive_present}
          subjunctive_presentperfect={conjugation.subjunctive_presentperfect}
          subjunctive_pastperfect={conjugation.subjunctive_pastperfect}
          subjunctive_imperfect={conjugation.subjunctive_imperfect}
          subjunctive_future={conjugation.subjunctive_future}
          subjunctive_futureperfect={conjugation.subjunctive_futureperfect}
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
