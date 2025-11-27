import { createContext, useState, useCallback } from 'react';

export const ConjugationContext = createContext({
  setSearchfield: () => {},
  favourites: [],
  filteredVerbs: [],
  verbSelected: Boolean,
  conjugation: {},
  responseText: String,
  listFavourites: () => {},
  searchVerbs: () => {},
  verbSelection: () => {},
  addFavourite: () => {},
  removeFavourite: () => {},
});

export default function ConjugationContextProvider({ children }) {
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
  const [responseText, setResponseText] = useState('');

  const listFavourites = useCallback(async function listFavourites(id) {
    try {
      const response = await fetch('http://localhost:3001/check_favourite', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Favourites endpoint not found');
        }
        if (response.status === 500) {
          throw new Error('Server error, please try again');
        }
        throw new Error('Failed to fetch favorites');
      }

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
      console.error(err.message);
      // will be logged to the console;
      // user will simply not see any favourites
    }
  }, []);

  function searchVerbs(id) {
    setVerbSelected(false);
    if (searchfield !== '') {
      fetch('http://localhost:3001/infinitive', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          infinitive: searchfield,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Verb endpoint not found');
            }
            if (response.status === 500) {
              throw new Error('Server error, please try again');
            }
            throw new Error('Search failed');
          }
          return response.json();
        })
        .then((data) => setFilteredVerbs(data))
        .catch((err) => console.log(err.message));
    } else {
      setFilteredVerbs([]);
      listFavourites(id);
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
          }).then((response) => {
            if (!response.ok) {
              if (response.status === 404) {
                throw new Error('One or more conjugations not found');
              }
              if (response.status === 500) {
                throw new Error('Server error, please try again');
              }
              throw new Error('Conjugation failed');
            }
            return Promise.resolve(response.json());
          }); //Promise.resolve required to return map array
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
        .catch((err) => setResponseText(err.message));
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

      await listFavourites(id); // Reload favorites
    } catch (err) {
      setResponseText(err.message);
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

      await listFavourites(id); // Reload favorites
    } catch (err) {
      setResponseText(err.message);
    }
  }

  const conjugationContextValue = {
    setSearchfield,
    favourites,
    filteredVerbs,
    verbSelected,
    conjugation,
    responseText,
    listFavourites,
    searchVerbs,
    verbSelection,
    addFavourite,
    removeFavourite,
  };
  return (
    <ConjugationContext.Provider value={conjugationContextValue}>
      {children}
    </ConjugationContext.Provider>
  );
}
