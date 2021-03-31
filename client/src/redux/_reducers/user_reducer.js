import { LOGIN_USER, REGISTER_USER, AUTH_USER, EDIT_PASSWORD } from "../types";

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload };
        case REGISTER_USER:
            return { ...state, register: action.payload };
        case AUTH_USER:
            return { ...state, userData: action.payload };
        case EDIT_PASSWORD:
            console.log(action.payload);
            return { ...state, successMsg: action.payload };
        default:
            return state;
    }
}
