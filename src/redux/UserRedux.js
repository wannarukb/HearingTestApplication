const types = {
    LOGOUT: 'LOGOUT',
    LOGIN: 'LOGIN_SUCCESS',
    REGISTER: 'REGISTER'
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
};
  
const initialState = {   
    "isAuthenticated" : false,
    "language" : "en",
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
                "isAuthenticated" : true
            });
        case types.REGISTER:
            return Object.assign({}, state, {
                ...state,
                user,
                "isAuthenticated" : false
            });
        default:
            return state;
    }
};
  