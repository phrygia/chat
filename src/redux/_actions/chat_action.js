import { SET_CURRENT_CHAT_FRIEND } from '../types';

export function setCurrentChatFriend(info) {
  return {
    type: SET_CURRENT_CHAT_FRIEND,
    payload: info,
  };
}
