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
      const response = await fetch(
        'http://localhost:3001/api/check_favourite',
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        }
      );

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
        fetch('http://localhost:3001/api/favourite_verbs', {
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
      fetch('http://localhost:3001/api/verb/search', {
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
      fetch('http://localhost:3001/api/verb/conjugation', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          infinitive: verb,
        }),
      })
        .then((response) => {
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
        })
        .then((conjugatedVerb) => {
          setConjugation({
            infinitive: verb,
            gerund: conjugatedVerb.gerund,
            gerund_english: conjugatedVerb.gerund_english,
            past_participle: conjugatedVerb.past_participle,
            past_participle_english: conjugatedVerb.past_participle_english,
            indicative_present: conjugatedVerb.indicative['Presente'],
            indicative_presentperfect:
              conjugatedVerb.indicative['Presente perfecto'],
            indicative_preterite: conjugatedVerb.indicative['Pretérito'],
            indicative_imperfect: conjugatedVerb.indicative['Imperfecto'],
            indicative_pastperfect:
              conjugatedVerb.indicative['Pluscuamperfecto'],
            indicative_conditional: conjugatedVerb.indicative['Condicional'],
            indicative_conditionalperfect:
              conjugatedVerb.indicative['Condicional perfecto'],
            indicative_future: conjugatedVerb.indicative['Futuro'],
            indicative_futureperfect:
              conjugatedVerb.indicative['Futuro perfecto'],
            imperative_affirmative: conjugatedVerb.imperative['affirmative'],
            imperative_negative: conjugatedVerb.imperative['negative'],
            subjunctive_present: conjugatedVerb.subjunctive['Presente'],
            subjunctive_presentperfect:
              conjugatedVerb.subjunctive['Presente perfecto'],
            subjunctive_pastperfect:
              conjugatedVerb.subjunctive['Pluscuamperfecto'],
            subjunctive_imperfect: conjugatedVerb.subjunctive['Imperfecto'],
            subjunctive_future: conjugatedVerb.subjunctive['Futuro'],
            subjunctive_futureperfect:
              conjugatedVerb.subjunctive['Futuro perfecto'],
          });
        })
        .catch((err) => setResponseText(err.message));
    }
  }

  async function addFavourite(verb, id) {
    try {
      const response = await fetch('http://localhost:3001/api/add_favourite', {
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
      const response = await fetch(
        'http://localhost:3001/api/remove_favourite',
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ infinitive: verb, id }),
        }
      );

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
