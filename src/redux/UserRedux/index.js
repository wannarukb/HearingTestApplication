const types = {
    LOGOUT: 'LOGOUT',
    LOGIN: 'LOGIN_SUCCESS',
};
  
export const actions = {
    login: user => {
        return {type: types.LOGIN, user};
    },
    logout() {
        return {type: types.LOGOUT};
    },
};
  
const initialState = {   
    "token": "",
    "id": "",
    "isAuthenticated" : false
};
  
export const reducer = (state = initialState, action) => {
    const {type, user} = action;  
    switch (type) {
        case types.LOGOUT:
            return Object.assign({}, initialState);
  
        case types.LOGIN:
            return Object.assign({}, state, {
                ...state,
                ...action.payload, // this is what we expect to get back from API call and login page input
                // "token": user.token,
                // "id":user.id,
                "isAuthenticated" : true
            });
  
        default:
            return state;
    }
};
  