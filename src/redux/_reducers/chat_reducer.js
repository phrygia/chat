import { SET_CURRENT_CHAT_ROOM, SET_CURRENT_CHAT_FRIEND } from "../types";

const initialState = {
    currentChatRoom: null,
    isPrivate: false,
    currentChatFriend: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_CHAT_ROOM:
            return {
                ...state,
                currentChatRoom: action.payload,
                isPrivate: action.isPrivate,
            };
        case SET_CURRENT_CHAT_FRIEND:
            return {
                ...state,
                currentChatFriend: action.payload,
                isPrivate: action.isPrivate,
            };
        default:
            return state;
    }
}
