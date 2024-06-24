// src/redux/reducers/otherReducer.js
const initialState = {
    data: [],
  };
  
  const otherReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_DATA':
        return {
          ...state,
          data: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default otherReducer;
  