import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils'
import { parseHeaderForLinks } from '../../../shared/util/url-utils'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  jobRequest: ['jobId'],
  jobAllRequest: ['options'],
  jobUpdateRequest: ['job'],
  jobSearchRequest: ['query'],
  jobDeleteRequest: ['jobId'],

  jobSuccess: ['job'],
  jobAllSuccess: ['jobs', 'headers'],
  jobUpdateSuccess: ['job'],
  jobSearchSuccess: ['jobs'],
  jobDeleteSuccess: [],

  jobFailure: ['error'],
  jobAllFailure: ['error'],
  jobUpdateFailure: ['error'],
  jobSearchFailure: ['error'],
  jobDeleteFailure: ['error'],

  jobReset: [],
})

export const JobTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: null,
  fetchingAll: null,
  updating: null,
  searching: null,
  deleting: null,
  job: null,
  jobs: [],
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
    job: null,
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
  const { job } = action
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    job,
  })
}
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { jobs, headers } = action
  const links = parseHeaderForLinks(headers.link)
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    jobs: loadMoreDataWhenScrolled(state.jobs, jobs, links),
  })
}
// successful api update
export const updateSuccess = (state, action) => {
  const { job } = action
  return state.merge({
    updating: false,
    errorUpdating: null,
    job,
  })
}
// successful api search
export const searchSuccess = (state, action) => {
  const { jobs } = action
  return state.merge({
    searching: false,
    errorSearching: null,
    jobs,
  })
}
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    job: null,
  })
}

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    job: null,
  })
}
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    jobs: [],
  })
}
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action
  return state.merge({
    updating: false,
    errorUpdating: error,
    job: state.job,
  })
}
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action
  return state.merge({
    deleting: false,
    errorDeleting: error,
    job: state.job,
  })
}
// Something went wrong searching the entities.
export const searchFailure = (state, action) => {
  const { error } = action
  return state.merge({
    searching: false,
    errorSearching: error,
    jobs: [],
  })
}

export const reset = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.JOB_REQUEST]: request,
  [Types.JOB_ALL_REQUEST]: allRequest,
  [Types.JOB_UPDATE_REQUEST]: updateRequest,
  [Types.JOB_SEARCH_REQUEST]: searchRequest,
  [Types.JOB_DELETE_REQUEST]: deleteRequest,

  [Types.JOB_SUCCESS]: success,
  [Types.JOB_ALL_SUCCESS]: allSuccess,
  [Types.JOB_UPDATE_SUCCESS]: updateSuccess,
  [Types.JOB_SEARCH_SUCCESS]: searchSuccess,
  [Types.JOB_DELETE_SUCCESS]: deleteSuccess,

  [Types.JOB_FAILURE]: failure,
  [Types.JOB_ALL_FAILURE]: allFailure,
  [Types.JOB_UPDATE_FAILURE]: updateFailure,
  [Types.JOB_SEARCH_FAILURE]: searchFailure,
  [Types.JOB_DELETE_FAILURE]: deleteFailure,
  [Types.JOB_RESET]: reset,
})
