import { render, RenderOptions, screen, within } from '@testing-library/react';
import VerbTable from './VerbTable';
import {
  ConjugationContext,
  ConjugationContextType,
} from '../../store/conjugation-context';
import {
  ConjugationForm,
  ConjugationType,
  createEmptyConjugationForm,
  createEmptyImperativeForm,
  ImperativeForm,
} from '../../types/conjugation';

const customVerbTableRender = (
  providerProps: ConjugationContextType,
  renderOptions?: RenderOptions,
) => {
  return render(
    <ConjugationContext.Provider value={providerProps}>
      <VerbTable />
    </ConjugationContext.Provider>,
    renderOptions,
  );
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
};

let testConjguation = structuredClone(INITIAL_CONJUGATION);

beforeEach(() => {
  testConjguation = structuredClone(INITIAL_CONJUGATION);
});

const generateContextValues = (conjugation: ConjugationType) => {
  return {
    setSearchfield: () => {},
    favourites: [],
    filteredVerbs: [],
    verbSelected: false,
    conjugation: conjugation,
    responseText: '',
    listFavourites: () => Promise.resolve(),
    searchVerbs: (_id: number) => {},
    verbSelection: () => {},
    addFavourite: () => Promise.resolve(),
    removeFavourite: () => Promise.resolve(),
  };
};

describe('VerbTable', () => {
  it('should show values provided to the context provider', () => {
    // arrange
    testConjguation.indicative_present.form_1s = 'Here is a context value';
    const providedContext = generateContextValues(testConjguation);

    // act
    const { container } = customVerbTableRender(providedContext);

    // assert
    expect(container).toHaveTextContent('Here is a context value');
  });

  it('should render a provided conjugation as arranged values in its table', () => {
    // arrange
    const indicativePresent = {
      form_1s: 'soy',
      form_1p: 'somos',
      form_2s: 'eres',
      form_2p: 'sois',
      form_3s: 'es',
      form_3p: 'son',
    };

    const imperativAffirmative: ImperativeForm = {
      form_2s: 'sé',
      form_2p: 'sed',
      form_3s: 'sea',
      form_3p: 'sean',
    };

    const subjunctivePresent: ConjugationForm = {
      form_1s: 'sea',
      form_1p: 'seas',
      form_2s: 'sea',
      form_2p: 'seamos',
      form_3s: 'seáis',
      form_3p: 'sean',
    };

    testConjguation.indicative_present = indicativePresent;
    testConjguation.imperative_affirmative = imperativAffirmative;
    testConjguation.subjunctive_present = subjunctivePresent;
    const providedContext = generateContextValues(testConjguation);

    // act
    customVerbTableRender(providedContext);
    const tables = screen.getAllByRole('table');

    // assert
    for (const tense of Object.values(indicativePresent)) {
      expect(within(tables[0]).getByText(tense)).toBeInTheDocument();
    }
    for (const tense of Object.values(imperativAffirmative)) {
      expect(within(tables[1]).getByText(tense)).toBeInTheDocument();
    }
    // adjusted the assertion because "sea" is used in more than one conjugation
    for (let key in indicativePresent) {
      expect(
        within(tables[0]).getByText(
          indicativePresent[key as keyof ConjugationForm],
        ),
      ).toBeInTheDocument();
    }
  });
});
