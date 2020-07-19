import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils'
import { parseHeaderForLinks } from '../../../shared/util/url-utils'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  jobHistoryRequest: ['jobHistoryId'],
  jobHistoryAllRequest: ['options'],
  jobHistoryUpdateRequest: ['jobHistory'],
  jobHistorySearchRequest: ['query'],
  jobHistoryDeleteRequest: ['jobHistoryId'],

  jobHistorySuccess: ['jobHistory'],
  jobHistoryAllSuccess: ['jobHistories', 'headers'],
  jobHistoryUpdateSuccess: ['jobHistory'],
  jobHistorySearchSuccess: ['jobHistories'],
  jobHistoryDeleteSuccess: [],

  jobHistoryFailure: ['error'],
  jobHistoryAllFailure: ['error'],
  jobHistoryUpdateFailure: ['error'],
  jobHistorySearchFailure: ['error'],
  jobHistoryDeleteFailure: ['error'],

  jobHistoryReset: [],
})

export const JobHistoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: null,
  fetchingAll: null,
  updating: null,
  searching: null,
  deleting: null,
  jobHistory: null,
  jobHistories: [],
  errorOne: null,
  errorAll: null,
  errorUpdating: null,
  errorSearching: null,
  errorDeleting: null,
  links: { next: 0 },
  totalItems: 0,
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({
    fetchingOne: true,
    errorOne: false,
    jobHistory: null,
  })

// request the data from an api
export const allRequest = (state) =>
  state.merge({
    fetchingAll: true,
    errorAll: false,
  })

// request to update from an api
export const updateRequest = (state) =>
  state.merge({
    updating: true,
  })
// request to search from an api
export const searchRequest = (state) =>
  state.merge({
    searching: true,
  })
// request to delete from an api
export const deleteRequest = (state) =>
  state.merge({
    deleting: true,
  })

// successful api lookup for single entity
export const success = (state, action) => {
  const { jobHistory } = action
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    jobHistory,
  })
}
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { jobHistories, headers } = action
  const links = parseHeaderForLinks(headers.link)
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    jobHistories: loadMoreDataWhenScrolled(state.jobHistories, jobHistories, links),
  })
}
// successful api update
export const updateSuccess = (state, action) => {
  const { jobHistory } = action
  return state.merge({
    updating: false,
    errorUpdating: null,
    jobHistory,
  })
}
// successful api search
export const searchSuccess = (state, action) => {
  const { jobHistories } = action
  return state.merge({
    searching: false,
    errorSearching: null,
    jobHistories,
  })
}
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    jobHistory: null,
  })
}

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    jobHistory: null,
  })
}
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    jobHistories: [],
  })
}
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action
  return state.merge({
    updating: false,
    errorUpdating: error,
    jobHistory: state.jobHistory,
  })
}
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action
  return state.merge({
    deleting: false,
    errorDeleting: error,
    jobHistory: state.jobHistory,
  })
}
// Something went wrong searching the entities.
export const searchFailure = (state, action) => {
  const { error } = action
  return state.merge({
    searching: false,
    errorSearching: error,
    jobHistories: [],
  })
}

export const reset = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.JOB_HISTORY_REQUEST]: request,
  [Types.JOB_HISTORY_ALL_REQUEST]: allRequest,
  [Types.JOB_HISTORY_UPDATE_REQUEST]: updateRequest,
  [Types.JOB_HISTORY_SEARCH_REQUEST]: searchRequest,
  [Types.JOB_HISTORY_DELETE_REQUEST]: deleteRequest,

  [Types.JOB_HISTORY_SUCCESS]: success,
  [Types.JOB_HISTORY_ALL_SUCCESS]: allSuccess,
  [Types.JOB_HISTORY_UPDATE_SUCCESS]: updateSuccess,
  [Types.JOB_HISTORY_SEARCH_SUCCESS]: searchSuccess,
  [Types.JOB_HISTORY_DELETE_SUCCESS]: deleteSuccess,

  [Types.JOB_HISTORY_FAILURE]: failure,
  [Types.JOB_HISTORY_ALL_FAILURE]: allFailure,
  [Types.JOB_HISTORY_UPDATE_FAILURE]: updateFailure,
  [Types.JOB_HISTORY_SEARCH_FAILURE]: searchFailure,
  [Types.JOB_HISTORY_DELETE_FAILURE]: deleteFailure,
  [Types.JOB_HISTORY_RESET]: reset,
})
