import { combineReducers } from 'redux';

const initialState = {
  // define initial state
};

// Example reducer
const exampleReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case 'EXAMPLE_ACTION':
      return {
        ...state,
        // handle action
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  example: exampleReducer,
  // add other reducers here
});

export default rootReducer;
