import { combineReducers } from 'redux';
import counterReducer  from './counterSlice/CounterSlice';
import journeyReducer from './journeySlice/journey'

const rootReducer = combineReducers({
    counter: counterReducer,
    journey: journeyReducer
});

export default rootReducer;