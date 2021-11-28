import { SET_CURRENT_CHAT_ROOM, SET_CURRENT_CHAT_FRIEND } from '../types'

export function setCurrentChatRoom(room, isPrivate) {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: room,
    isPrivate: isPrivate,
  }
}

export function setCurrentChatFriend(info, isPrivate) {
  return {
    type: SET_CURRENT_CHAT_FRIEND,
    payload: info,
    isPrivate: isPrivate,
  }
}
