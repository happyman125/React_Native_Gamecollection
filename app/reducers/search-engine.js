import {
  combineReducers,
} from 'redux'
import {
  START_SEARCHING,
  UPDATE_SEARCHTEXT,
  REQUEST_FRANCHISES,
  RECEIVE_FRANCHISES_SUCCESS,
  RECEIVE_FRANCHISES_FAILURE,
  SUBMIT_SEARCH,
  SELECT_FRANCHISE,
  STOP_SEARCHING,
} from '@actions/search-engine'
import {
  RECEIVE_GAMES_SUCCESS,
} from '@actions/games'

const initialState = {
  searchText: '',
  franchises: [],
  franchisesStatus: {
    pending: false,
    error: null
  },
}

function searchText(
  state = initialState.searchText,
  action,
) {
  const {
    type
  } = action
  
  switch (type) {
    case UPDATE_SEARCHTEXT:
      return action.searchText
    case SELECT_FRANCHISE:
      return action.selectedFranchise.name
    default:
      return state
  }
}

function franchises(
  state = initialState.franchises,
  action,
) {
  switch (action.type) {    
    case RECEIVE_FRANCHISES_SUCCESS:
      return action.franchises;
    case RECEIVE_FRANCHISES_FAILURE:
    case STOP_SEARCHING: // maybe a hide could be better to avoid to request the api again :s
    case RECEIVE_GAMES_SUCCESS: // to close the suggestion to be sure to see the games
      return []
    default:
      return state
  }
}

function franchisesStatus(
  state = initialState.franchisesStatus,
  action,
) {
  switch (action.type) {
    case REQUEST_FRANCHISES:
      return {
        pending: true,
        error: null
      }
    case RECEIVE_FRANCHISES_SUCCESS:
      return initialState.franchisesStatus;
    case RECEIVE_FRANCHISES_FAILURE:
      return {
        pending: false,
        error: action.error
      }
    default:
      return state
  }
}

export default combineReducers({
  searchText,
  franchises,
  franchisesStatus,
})