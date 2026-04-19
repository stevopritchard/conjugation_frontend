import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
} from 'react';
import {
  ConjugationType,
  createEmptyConjugationForm,
  createEmptyImperativeForm,
} from '../types/conjugation';

type favouriteVerbType = {
  infinitive: string;
  infinitive_english: string;
};

const INITIAL_CONJUGATION = {
  infinitive: '',
  gerund: '',
  gerund_english: '',
  past_participle: '',
  past_participle_english: '',
  indicative_present: createEmptyConjugationForm(),
  indicative_presentperfect: createEmptyConjugationForm(),
  indicative_preterite: createEmptyConjugationForm(),
  indicative_imperfect: createEmptyConjugationForm(),
  indicative_pastperfect: createEmptyConjugationForm(),
  indicative_conditional: createEmptyConjugationForm(),
  indicative_conditionalperfect: createEmptyConjugationForm(),
  indicative_future: createEmptyConjugationForm(),
  indicative_futureperfect: createEmptyConjugationForm(),
  imperative_affirmative: createEmptyImperativeForm(),
  imperative_negative: createEmptyImperativeForm(),
  subjunctive_present: createEmptyConjugationForm(),
  subjunctive_presentperfect: createEmptyConjugationForm(),
  subjunctive_pastperfect: createEmptyConjugationForm(),
  subjunctive_imperfect: createEmptyConjugationForm(),
  subjunctive_future: createEmptyConjugationForm(),
  subjunctive_futureperfect: createEmptyConjugationForm(),
} satisfies ConjugationType;

export type ConjugationContextType = {
  setSearchfield: Dispatch<SetStateAction<string>>;
  favourites: string[];
  filteredVerbs: favouriteVerbType[];
  verbSelected: boolean;
  conjugation: ConjugationType;
  responseText: string;
  listFavourites: (id: number) => Promise<void>;
  searchVerbs: (id: number) => void;
  verbSelection: (selection: boolean, verb: string) => void;
  addFavourite: (verb: string, id: number) => Promise<void>;
  removeFavourite: (verb: string, id: number) => Promise<void>;
};

export const ConjugationContext = createContext<ConjugationContextType>({
  setSearchfield: () => {},
  favourites: [],
  filteredVerbs: [],
  verbSelected: false,
  conjugation: INITIAL_CONJUGATION,
  responseText: '',
  // using underscore to denote 'intentionally unused' to prevent linter warnings
  listFavourites: (_id: number) => Promise.resolve(),
  searchVerbs: (_id: number) => {},
  verbSelection: (_selection: boolean, _verb: string) => {},
  addFavourite: async (_verb: string, _id: number) => {},
  removeFavourite: async (_verb: string, _id: number) => {},
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
  const [conjugation, setConjugation] = useState(INITIAL_CONJUGATION);
  const [responseText, setResponseText] = useState('');

  const listFavourites = useCallback(async function listFavourites(id: number) {
    try {
      const response = await fetch(
        'http://localhost:3001/api/check_favourite',
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        },
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
        }).then((res) => res.json()),
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

  async function searchVerbs(id: number) {
    setVerbSelected(false);
    if (searchfield !== '') {
      try {
        const response = await fetch('http://localhost:3001/api/verb/search', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            infinitive: searchfield,
          }),
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Verb endpoint not found');
          }
          if (response.status === 500) {
            throw new Error('Server error, please try again');
          }
          throw new Error('Search failed');
        }
        const data = await response.json();
        setFilteredVerbs(data);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.log(`An unexpected error occurred: ${err}`);
        }
      }
    } else {
      setFilteredVerbs([]);
      await listFavourites(id);
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

  async function addFavourite(verb: string, id: number) {
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

  async function removeFavourite(verb: string, id: number) {
    try {
      const response = await fetch(
        'http://localhost:3001/api/remove_favourite',
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ infinitive: verb, id }),
        },
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
