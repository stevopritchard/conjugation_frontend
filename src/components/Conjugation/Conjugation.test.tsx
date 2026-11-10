import Conjugation from './Conjugation';
import {
  ConjugationContext,
  ConjugationContextType,
} from '../../store/conjugation-context';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const EMPTYINDICATIVEFORM = {
  form_1s: '',
  form_1p: '',
  form_2s: '',
  form_2p: '',
  form_3s: '',
  form_3p: '',
};

const EMPTYIMPERATIVEFORM = {
  form_2s: '',
  form_2p: '',
  form_3s: '',
  form_3p: '',
};

const CONJUGATION_FAVOURITE = {
  infinitive: 'prever',
  gerund: 'previendo',
  gerund_english: 'foreseeing',
  past_participle: 'previsto',
  past_participle_english: 'foreseen',
  indicative_present: EMPTYINDICATIVEFORM,
  indicative_presentperfect: EMPTYINDICATIVEFORM,
  indicative_preterite: EMPTYINDICATIVEFORM,
  indicative_imperfect: EMPTYINDICATIVEFORM,
  indicative_pastperfect: EMPTYINDICATIVEFORM,
  indicative_conditional: EMPTYINDICATIVEFORM,
  indicative_conditionalperfect: EMPTYINDICATIVEFORM,
  indicative_future: EMPTYINDICATIVEFORM,
  indicative_futureperfect: EMPTYINDICATIVEFORM,
  imperative_affirmative: EMPTYIMPERATIVEFORM,
  imperative_negative: EMPTYIMPERATIVEFORM,
  subjunctive_present: EMPTYINDICATIVEFORM,
  subjunctive_presentperfect: EMPTYINDICATIVEFORM,
  subjunctive_pastperfect: EMPTYINDICATIVEFORM,
  subjunctive_imperfect: EMPTYINDICATIVEFORM,
  subjunctive_future: EMPTYINDICATIVEFORM,
  subjunctive_futureperfect: EMPTYINDICATIVEFORM,
};

const mockFetchFavourite = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve(['prever', 'conjugar', 'recoger']),
});

const mockFetchNoFavourite = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve(['estar']),
});

describe('Conjugation', () => {
  beforeEach(() => {
    conjugationContext = generateContextValues();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const conjugationRenderer = (
    providerProps: ConjugationContextType,
    id: number,
  ) => {
    return render(
      <ConjugationContext.Provider value={providerProps}>
        <Conjugation id={id} />
      </ConjugationContext.Provider>,
    );
  };

  const generateContextValues = () => {
    return {
      setSearchfield: () => {},
      favourites: [],
      filteredVerbs: [],
      verbSelected: false,
      conjugation: CONJUGATION_FAVOURITE,
      responseText: '',
      listFavourites: () => Promise.resolve(),
      searchVerbs: () => {},
      verbSelection: () => {},
      addFavourite: () => Promise.resolve(),
      removeFavourite: () => Promise.resolve(),
    };
  };

  let conjugationContext = generateContextValues();

  it('should display the full conjugation of a given verb that is provided in context', () => {
    // arrange
    vi.stubGlobal('fetch', mockFetchNoFavourite);

    // act
    conjugationRenderer(conjugationContext, 0);

    // assert
    expect(
      screen.getByText(CONJUGATION_FAVOURITE.infinitive),
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONJUGATION_FAVOURITE.gerund, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONJUGATION_FAVOURITE.gerund_english, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONJUGATION_FAVOURITE.past_participle, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONJUGATION_FAVOURITE.past_participle_english, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it("should render the 'favourite' icon with a grey colour if the conjugated verb is not in the user's favourites", async () => {
    // arrange
    vi.stubGlobal('fetch', mockFetchNoFavourite);

    // act
    conjugationRenderer(conjugationContext, 0);
    // assert
    await waitFor(() => {
      expect(screen.getByRole('generic', { name: 'favourite' })).toHaveStyle({
        color: 'rgb(128, 128, 128)', // {color: 'grey'}
      });
    });
  });

  it("should render the 'favourite' icon with a gold colour if the conjugated verb is in the user's favourites", async () => {
    // arrange
    vi.stubGlobal('fetch', mockFetchFavourite);

    // act
    conjugationRenderer(conjugationContext, 0);
    // assert
    await waitFor(() => {
      expect(screen.getByRole('generic', { name: 'favourite' })).toHaveStyle({
        color: 'rgb(255, 215, 0)', // {color: 'gold'}
      });
    });
  });

  it("should change the 'favourite' icon if said icon is clicked", async () => {
    // arrange
    vi.stubGlobal('fetch', mockFetchNoFavourite);
    const user = userEvent.setup();

    // act
    conjugationRenderer(conjugationContext, 0);
    await user.click(screen.getByRole('generic', { name: 'favourite' }));

    // assert
    await waitFor(() => {
      expect(screen.getByRole('generic', { name: 'favourite' })).toHaveStyle({
        color: 'rgb(255, 215, 0)', // {color: 'gold'}
      });
    });
  });
});
