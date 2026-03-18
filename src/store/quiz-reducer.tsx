export enum QuizActionKind {
  SET_QUIZ_LENGTH = 'SET_QUIZ_LENGTH',
  SELECT_TENSES = 'SELECT_TENSES',
  START_TEST = 'START_TEST',
  UPDATE_SCORE = 'UPDATE_SCORE',
  NEXT_QUESTION = 'NEXT_QUESTION',
  STOP_TEST = 'STOP_TEST',
}

type SetQuizLengthAction = {
  type: QuizActionKind.SET_QUIZ_LENGTH;
  payload: number;
};

type SelectTensesAction = {
  type: QuizActionKind.SELECT_TENSES;
  payload: {
    checked: boolean;
    id: string;
  };
};

type StartTestAction = {
  type: QuizActionKind.START_TEST;
};

type UpdateScoreAction = {
  type: QuizActionKind.UPDATE_SCORE;
  payload: number;
};

type NextQuestionAction = {
  type: QuizActionKind.NEXT_QUESTION;
};

type StopTestAction = {
  type: QuizActionKind.STOP_TEST;
};

type QuizAction =
  | SetQuizLengthAction
  | SelectTensesAction
  | StartTestAction
  | UpdateScoreAction
  | NextQuestionAction
  | StopTestAction;

interface QuizReducerState {
  isActive: boolean;
  currentQuestion: number;
  totalQuestions: number;
  selectedTenses: string[];
  score: number;
  prevQuizLength: number;
}

export default function quizReducer(
  state: QuizReducerState,
  action: QuizAction,
) {
  switch (action.type) {
    case QuizActionKind.SET_QUIZ_LENGTH:
      return {
        ...state,
        totalQuestions: +action.payload,
      };

    case QuizActionKind.SELECT_TENSES:
      if (action.payload.checked) {
        return {
          ...state,
          selectedTenses: state.selectedTenses.concat(action.payload.id),
        };
      } else {
        return {
          ...state,
          selectedTenses: state.selectedTenses.filter(
            (tense) => tense !== action.payload.id,
          ),
        };
      }
    case QuizActionKind.START_TEST:
      return {
        ...state,
        score: 0,
        isActive: true,
        currentQuestion: 1,
      };

    case QuizActionKind.UPDATE_SCORE:
      return {
        ...state,
        score: state.score + +action.payload,
      };

    case QuizActionKind.NEXT_QUESTION:
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
      };

    case QuizActionKind.STOP_TEST:
      return {
        ...state,
        score: state.currentQuestion < state.totalQuestions ? 0 : state.score,
        isActive: false,
        prevQuizLength: state.totalQuestions,
        selectedTenses: [],
      };
    default:
      return state;
  }
}
