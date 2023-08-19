import { createContext, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload }
        case 'LOGOUT':
            return { ...state, user: null }
        case 'MATCH':
            return { ...state, match: action.payload }
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const userData = sessionStorage.getItem('user');
    const isMatch = sessionStorage.getItem('match');

    const [state, dispatch] = useReducer(authReducer, {
        user: userData ? JSON.parse(userData) : null,
        match: isMatch ? JSON.parse(isMatch) : null
    });

    // console.log('Auth state: ', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}