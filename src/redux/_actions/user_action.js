import {
  CHANGE_IMAGE,
  LOGIN_USER,
  LOGOUT_USER,
  CHANGE_PROFILE,
  LOAD_STATUS_MESSAGE,
  LOAD_STATUS_NAME,
  LOAD_FRIENDS_LIST,
  LOAD_ALL_FRIENDS_LIST,
  LOAD_ALARM_STATUS,
} from '../types';

export function loginUser(user) {
  return {
    type: LOGIN_USER,
    payload: user,
  };
}
export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}
export function changeImage(url) {
  return {
    type: CHANGE_IMAGE,
    payload: url,
  };
}
export function changeProfile(message, name) {
  return {
    type: CHANGE_PROFILE,
    payload: message,
    displayName: name,
  };
}
export function loadStatusMessage(message) {
  return {
    type: LOAD_STATUS_MESSAGE,
    payload: message,
  };
}
export function loadStatusName(name) {
  return {
    type: LOAD_STATUS_NAME,
    payload: name,
  };
}
export function loadFriendsList(list) {
  return {
    type: LOAD_FRIENDS_LIST,
    payload: list,
  };
}
export function loadAllFriendsList(list) {
  return {
    type: LOAD_ALL_FRIENDS_LIST,
    payload: list,
  };
}
export function loadAlarmStatus(status) {
  return {
    type: LOAD_ALARM_STATUS,
    payload: status,
  };
}
