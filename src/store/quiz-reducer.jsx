export default function quizReducer(state, action) {
  switch (action.type) {
    case 'SET_QUIZ_LENGTH':
      return {
        ...state,
        totalQuestions: +action.payload,
      };

    case 'SELECT_TENSES':
      if (action.payload.checked) {
        return {
          ...state,
          selectedTenses: state.selectedTenses.concat(action.payload.id),
        };
      } else {
        return {
          ...state,
          selectedTenses: state.selectedTenses.filter(
            (tense) => tense !== action.payload.id
          ),
        };
      }
    case 'START_TEST':
      return {
        ...state,
        score: 0,
        isActive: true,
        currentQuestion: 1,
      };

    case 'UPDATE_SCORE':
      return {
        ...state,
        score: state.score + +action.payload,
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
      };

    case 'STOP_TEST':
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
