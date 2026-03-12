export type ConjugationForm = {
  form_1s: string;
  form_1p: string;
  form_2s: string;
  form_2p: string;
  form_3s: string;
  form_3p: string;
};

export type ImperativeForm = {
  form_2s: string;
  form_2p: string;
  form_3s: string;
  form_3p: string;
};

export type ConjugationType = {
  infinitive: string;
  gerund: string;
  gerund_english: string;
  past_participle: string;
  past_participle_english: string;
  indicative_present: ConjugationForm;
  indicative_presentperfect: ConjugationForm;
  indicative_preterite: ConjugationForm;
  indicative_imperfect: ConjugationForm;
  indicative_pastperfect: ConjugationForm;
  indicative_conditional: ConjugationForm;
  indicative_conditionalperfect: ConjugationForm;
  indicative_future: ConjugationForm;
  indicative_futureperfect: ConjugationForm;
  imperative_affirmative: ImperativeForm;
  imperative_negative: ImperativeForm;
  subjunctive_present: ConjugationForm;
  subjunctive_presentperfect: ConjugationForm;
  subjunctive_pastperfect: ConjugationForm;
  subjunctive_imperfect: ConjugationForm;
  subjunctive_future: ConjugationForm;
  subjunctive_futureperfect: ConjugationForm;
};

export function createEmptyConjugationForm(): ConjugationForm {
  return {
    form_1s: '',
    form_1p: '',
    form_2s: '',
    form_2p: '',
    form_3s: '',
    form_3p: '',
  };
}

export function createEmptyImperativeForm(): ImperativeForm {
  return {
    form_2s: '',
    form_2p: '',
    form_3s: '',
    form_3p: '',
  };
}
