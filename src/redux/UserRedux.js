/* eslint-disable prettier/prettier */
const types = {
    LOGOUT: 'LOGOUT',
    LOGIN: 'LOGIN_SUCCESS',
    REGISTER: 'REGISTER',
    REGISTER_GUEST : 'REGISTER_GUEST',
    LOGIN_GUEST : 'LOGIN_GUEST'
};
  
export const actions = {
    login: user => {
        return {type: types.LOGIN, user};
    },
    logout() {
        return {type: types.LOGOUT};
    },
    register: user => {
        return {type: types.REGISTER, user};
    },

    loginGuest : user => {
        return {type: types.LOGIN_GUEST, user};
    },
    registerGuest: user => {
        return {type: types.REGISTER_GUEST, user};
    },
};
  
const initialState = {   
    "isAuthenticated" : false,
    "isGuest" : true,
    "user" : {}
};
  
export const reducer = (state = initialState, action) => {
    const {type, user} = action;  
    switch (type) {
        case types.LOGOUT:
            console.log(initialState);
            return Object.assign({}, initialState);
  
        case types.LOGIN:
            return Object.assign({}, state, {
                ...state,
                user,
                "isAuthenticated" : true,
                "isGuest" : false
            });
        case types.REGISTER:
            return Object.assign({}, state, {
                ...state,
                user,
                "isAuthenticated" : false,
                "isGuest" : false,
            });
        case types.LOGIN_GUEST:
            return Object.assign({}, state, {
                ...state,
                user,
                "isAuthenticated" : true,
                "isGuest" : true
            });
        case types.REGISTER_GUEST:
            return Object.assign({}, state, {
                ...state,
                user,
                "isAuthenticated" : false,
                "isGuest" : true,
            });
        default:
            return state;
    }
};
  