import { combineReducers } from "redux"

// раскодируем JWT-токен
const jwtDecode = function (token) {
    try {
        let parseData = token.split('.')[1]
        return JSON.parse(atob(parseData))
    }
    catch (e) {
        return undefined
    }
}

// authReducer
export function authReducer(state = {}, { type, token }) {
    if (type === 'AUTH_LOGIN') {
        let payload = jwtDecode(token)

        return state = {
            token,
            payload
        }
    }

    if (type === 'AUTH_LOGOUT') {
        return {}
    }

    return state
}


// универсальный создатель редьюсеров в зависимости от передаваемого типа
function createReducer(type) {
    function wrapper(state = {}, action) {
        const { status, payload, error, nameOfPromise } = action
        if (action.type === type) {
            return {
                ...state,
                [nameOfPromise]: { status, payload, error }
            }
        }

        if (action.type === 'AUTH_LOGOUT') {
            return {}
        }

        return state
    }
    return wrapper
}


// localStoredReducer, который обрабатывает все наши редьюсеры для разных направлений и добавляет в localStorage
export function localStoredReducer(originalReducer, localStorageKey) {
    function wrapper(state, action) {
        if (!state) {
            try {
                return JSON.parse(localStorage[localStorageKey])
            }
            catch (error) {

            }
        }

        const newState = originalReducer(state, action)
        localStorage[localStorageKey] = JSON.stringify(newState)

        return newState
    }

    return wrapper
}


export const reducers = {
    auth: localStoredReducer(authReducer, 'auth'),
    promise: localStoredReducer(createReducer('PROMISE'), 'promise'),
    feed: localStoredReducer(createReducer('FEED'), 'feed'),
    search: localStoredReducer(createReducer('SEARCH'), 'search'),
    collection: localStoredReducer(createReducer('COLLECTIONS'), 'collection')
}

export const totalReducer = combineReducers(reducers)