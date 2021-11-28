import {
  LOGIN_USER,
  LOGOUT_USER,
  CHANGE_IMAGE,
  CHANGE_PROFILE,
  LOAD_STATUS_MESSAGE,
  LOAD_STATUS_NAME,
  LOAD_FRIENDS_LIST,
  LOAD_ALL_FRIENDS_LIST,
  LOAD_ALARM_STATUS
} from '../types'

const initialState = {
  isLoading: true,
  currentUser: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, isLoading: false, currentUser: action.payload }
    case LOGOUT_USER:
      return { ...state, isLoading: false, currentUser: null }
    case CHANGE_IMAGE:
      return {
        ...state,
        isLoading: false,
        currentUser: { ...state.currentUser, photoURL: action.payload },
      }
    case CHANGE_PROFILE:
      return {
        ...state,
        isLoading: false,
        currentUser: {
          ...state.currentUser,
          statusMessage: action.payload,
          displayName: action.displayName,
        },
      }
    case LOAD_STATUS_MESSAGE:
      return {
        ...state,
        isLoading: false,
        currentUser: {
          ...state.currentUser,
          statusMessage: action.payload,
        },
      }
    case LOAD_STATUS_NAME:
      return {
        ...state,
        isLoading: false,
        currentUser: {
          ...state.currentUser,
          statusName: action.payload,
        },
      }
    case LOAD_FRIENDS_LIST:
      return {
        ...state,
        isLoading: false,
        currentUser: {
          ...state.currentUser,
          myFriendsList: action.payload,
        },
      }
    case LOAD_ALL_FRIENDS_LIST:
      return {
        ...state,
        isLoading: false,
        currentUser: {
          ...state.currentUser,
          allFriendsList: action.payload,
        },
      }
    case LOAD_ALARM_STATUS:
      return {
        ...state,
        isLoading: false,
        currentUser: {
          ...state.currentUser,
          alarmStatus: action.payload,
        },
      }
    default:
      return state
  }
}
