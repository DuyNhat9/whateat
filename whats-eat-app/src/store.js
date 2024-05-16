import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { userSigninReducer } from './reducers/userReducers';

//redux strore
const initialState = {
	// cart: {
	// 	cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
	// 	shippingAddress: localStorage.getItem('shippingAddress')
	// 		? JSON.parse(localStorage.getItem('shippingAddress'))
	// 		: {},
	// 	paymentMethod: 'PayPal'
	// },
	userSignin: {
		userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
	}
};
const reducer = combineReducers({
	//cart: cartReducer,
	userSignin: userSigninReducer,
	//orderCreate: orderCreateReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;
