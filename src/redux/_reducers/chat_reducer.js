import { SET_CURRENT_CHAT_FRIEND } from '../types';

const initialState = {
  currentChatFriend: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_FRIEND:
      return {
        ...state,
        currentChatFriend: action.payload,
      };
    default:
      return state;
  }
}
