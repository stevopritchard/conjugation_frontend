import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
} from 'react';

type ConjugationType = {
  infinitive: string;
  gerund: string;
  gerund_english: string;
  past_participle: string;
  past_participle_english: string;
  indicative_present: string[];
  indicative_presentperfect: string[];
  indicative_preterite: string[];
  indicative_imperfect: string[];
  indicative_pastperfect: string[];
  indicative_conditional: string[];
  indicative_conditionalperfect: string[];
  indicative_future: string[];
  indicative_futureperfect: string[];
  imperative_affirmative: string[];
  imperative_negative: string[];
  subjunctive_present: string[];
  subjunctive_presentperfect: string[];
  subjunctive_pastperfect: string[];
  subjunctive_imperfect: string[];
  subjunctive_future: string[];
  subjunctive_futureperfect: string[];
};

type favouriteVerbType = {
  infinitive: string;
  infinitive_english: string;
};

type ConjugationContextType = {
  setSearchfield: Dispatch<SetStateAction<string>>;
  favourites: string[];
  filteredVerbs: favouriteVerbType[];
  verbSelected: boolean;
  conjugation: ConjugationType;
  responseText: string;
  listFavourites: (id: string) => Promise<void>;
  searchVerbs: (id: string) => void;
  verbSelection: (selection: boolean, verb: string) => void;
  addFavourite: (verb: string, id: string) => Promise<void>;
  removeFavourite: (verb: string, id: string) => Promise<void>;
};

export const ConjugationContext = createContext<ConjugationContextType>({
  setSearchfield: () => {},
  favourites: [],
  filteredVerbs: [],
  verbSelected: false,
  conjugation: {
    infinitive: '',
    gerund: '',
    gerund_english: '',
    past_participle: '',
    past_participle_english: '',
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
  },
  responseText: '',
  // using underscore to denote 'intentionally unused' to prevent linter warnings
  listFavourites: (_id: string) => Promise.resolve(),
  searchVerbs: (_id: string) => {},
  verbSelection: (_selection: boolean, _verb: string) => {},
  addFavourite: async (_verb: string, _id: string) => {},
  removeFavourite: async (_verb: string, _id: string) => {},
});

export default function ConjugationContextProvider({
  children,
}: {
  children: React.JSX.Element;
}) {
  const [searchfield, setSearchfield] = useState('');
  const [favourites, setFavourites] = useState<string[]>([]);
  const [filteredVerbs, setFilteredVerbs] = useState<favouriteVerbType[]>([]);
  const [verbSelected, setVerbSelected] = useState(false);
  const [conjugation, setConjugation] = useState({
    infinitive: '',
    gerund: '',
    gerund_english: '',
    past_participle: '',
    past_participle_english: '',
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

  const listFavourites = useCallback(async function listFavourites(id: string) {
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

      const verbPromises = favoriteInfinitives.map((infinitive: string) =>
        fetch('http://localhost:3001/api/favourite_verbs', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ infinitive }),
        }).then((res) => res.json())
      );

      const verbs: favouriteVerbType[] = await Promise.all(verbPromises);
      setFilteredVerbs(verbs);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.log(`An unexpected error occurred: ${err}`);
      }
      // will be logged to the console;
      // user will simply not see any favourites
    }
  }, []);

  function searchVerbs(id: string) {
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
        .catch((err) => {
          if (err instanceof Error) {
            console.error(err.message);
          } else {
            console.log(`An unexpected error occurred: ${err}`);
          }
        });
    } else {
      setFilteredVerbs([]);
      listFavourites(id);
    }
  }

  function verbSelection(selection: boolean, verb: string) {
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
          return response.json();
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
        .catch((err) => {
          if (err instanceof Error) {
            setResponseText(err.message);
          } else {
            setResponseText(`An unexpected error occurred: ${err}`);
          }
        });
    }
  }

  async function addFavourite(verb: string, id: string) {
    try {
      const response = await fetch('http://localhost:3001/api/add_favourite', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ infinitive: verb, id }),
      });

      if (!response.ok) throw new Error('Failed to add favorite');

      await listFavourites(id); // Reload favorites
    } catch (err) {
      if (err instanceof Error) {
        setResponseText(err.message);
      } else {
        setResponseText(`An unexpected error occurred: ${err}`);
      }
    }
  }

  async function removeFavourite(verb: string, id: string) {
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
      if (err instanceof Error) {
        setResponseText(err.message);
      } else {
        setResponseText(`An unexpected error occurred: ${err}`);
      }
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
