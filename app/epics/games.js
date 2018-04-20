import 'rxjs';
import _ from 'lodash'
import { combineEpics } from 'redux-observable'
import { Observable } from 'rxjs/Observable'
import { getSearchText } from '@selectors/search-engine'
import {
  fetchGames,
  fetchGame,
} from '@services/giant-bomb'
import {
  SUBMIT_SEARCH
} from '@actions/search-engine'
import {
  stopSearching,
} from '@actions/search-engine'
import {
  REQUEST_GAMES,
  REQUEST_GAME_COMPLETION,
} from '@actions/games'
import {
  requestGames,
  receiveGames,
  receiveGamesFailure,
  receiveGameCompletion,
  receiveGameCompletionFailure,
} from '@actions/games'

const submitSearchEpic = action$ => action$
  .ofType(SUBMIT_SEARCH)
  .mapTo(requestGames())

const requestGamesToStopEpic = action$ => action$
  .ofType(REQUEST_GAMES)
  .mapTo(stopSearching())

const requestGamesToFetchEpic = (action$, store) => action$
  .ofType(REQUEST_GAMES)
  .switchMap(() => {
    const searchEngineState = store.getState().searchEngine
    const searchText = getSearchText(searchEngineState);

    let observable

    if (searchText) {
      observable = fetchGames(searchText)
        .map(response => receiveGames(response.results, {
          max: response.limit, 
          amount: response.number_of_page_results,
          total: response.number_of_total_results,
          offset: response.offset,
        }))
        .catch(error => Observable.of(receiveGamesFailure(error)))
    } else {
      observable = Observable.of(receiveGames([]))
    }

    return observable
  })

const requestGameCompletionEpic = action$ => action$
  .ofType(REQUEST_GAME_COMPLETION)
  .mergeMap(action => fetchGame(action.game)
    .map(response => receiveGameCompletion(response.results))
    .takeUntil(action$.ofType(SUBMIT_SEARCH))
    .catch(error => Observable.of(receiveGameCompletionFailure(error)))
  )

export default combineEpics(
  submitSearchEpic,
  requestGamesToStopEpic,
  requestGamesToFetchEpic,
  requestGameCompletionEpic,
)
