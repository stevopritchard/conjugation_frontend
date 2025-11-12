export default function quizReducer(state, action) {
  if (action.type === 'SET_QUIZ_LENGTH') {
    return {
      ...state,
      totalQuestions: +action.payload,
    };
  }

  if (action.type === 'SELECT_TENSES') {
    let updatedTenses = state.selectedTenses;
    if (action.payload.checked === true) {
      updatedTenses = updatedTenses.concat(action.payload.id);
    } else {
      updatedTenses = updatedTenses.filter(
        (tense) => tense !== action.payload.id
      );
    }
    return {
      ...state,
      selectedTenses: updatedTenses,
    };
  }

  if (action.type === 'START_TEST') {
    return {
      ...state,
      score: 0,
      isActive: true,
      currentQuestion: 1,
      // counter: state.counter + 1,
    };
  }

  if (action.type === 'UPDATE_SCORE') {
    return {
      ...state,
      score: state.score + +action.payload,
    };
  }

  if (action.type === 'NEXT_QUESTION') {
    return {
      ...state,
      currentQuestion:
        state.currentQuestion < state.totalQuestions &&
        state.currentQuestion + 1,
    };
  }

  if (action.type === 'STOP_TEST') {
    return {
      ...state,
      score: state.currentQuestion < state.totalQuestions ? 0 : state.score,
      isActive: false,
      prevTotalQuestions: state.totalQuestions,
      selectedTenses: [],
    };
  }

  return state;
}
