import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils'
import { parseHeaderForLinks } from '../../../shared/util/url-utils'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  employeeRequest: ['employeeId'],
  employeeAllRequest: ['options'],
  employeeUpdateRequest: ['employee'],
  employeeSearchRequest: ['query'],
  employeeDeleteRequest: ['employeeId'],

  employeeSuccess: ['employee'],
  employeeAllSuccess: ['employees', 'headers'],
  employeeUpdateSuccess: ['employee'],
  employeeSearchSuccess: ['employees'],
  employeeDeleteSuccess: [],

  employeeFailure: ['error'],
  employeeAllFailure: ['error'],
  employeeUpdateFailure: ['error'],
  employeeSearchFailure: ['error'],
  employeeDeleteFailure: ['error'],

  employeeReset: [],
})

export const EmployeeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: null,
  fetchingAll: null,
  updating: null,
  searching: null,
  deleting: null,
  employee: null,
  employees: [],
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
    employee: null,
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
  const { employee } = action
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    employee,
  })
}
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { employees, headers } = action
  const links = parseHeaderForLinks(headers.link)
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    employees: loadMoreDataWhenScrolled(state.employees, employees, links),
  })
}
// successful api update
export const updateSuccess = (state, action) => {
  const { employee } = action
  return state.merge({
    updating: false,
    errorUpdating: null,
    employee,
  })
}
// successful api search
export const searchSuccess = (state, action) => {
  const { employees } = action
  return state.merge({
    searching: false,
    errorSearching: null,
    employees,
  })
}
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    employee: null,
  })
}

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    employee: null,
  })
}
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    employees: [],
  })
}
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action
  return state.merge({
    updating: false,
    errorUpdating: error,
    employee: state.employee,
  })
}
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action
  return state.merge({
    deleting: false,
    errorDeleting: error,
    employee: state.employee,
  })
}
// Something went wrong searching the entities.
export const searchFailure = (state, action) => {
  const { error } = action
  return state.merge({
    searching: false,
    errorSearching: error,
    employees: [],
  })
}

export const reset = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.EMPLOYEE_REQUEST]: request,
  [Types.EMPLOYEE_ALL_REQUEST]: allRequest,
  [Types.EMPLOYEE_UPDATE_REQUEST]: updateRequest,
  [Types.EMPLOYEE_SEARCH_REQUEST]: searchRequest,
  [Types.EMPLOYEE_DELETE_REQUEST]: deleteRequest,

  [Types.EMPLOYEE_SUCCESS]: success,
  [Types.EMPLOYEE_ALL_SUCCESS]: allSuccess,
  [Types.EMPLOYEE_UPDATE_SUCCESS]: updateSuccess,
  [Types.EMPLOYEE_SEARCH_SUCCESS]: searchSuccess,
  [Types.EMPLOYEE_DELETE_SUCCESS]: deleteSuccess,

  [Types.EMPLOYEE_FAILURE]: failure,
  [Types.EMPLOYEE_ALL_FAILURE]: allFailure,
  [Types.EMPLOYEE_UPDATE_FAILURE]: updateFailure,
  [Types.EMPLOYEE_SEARCH_FAILURE]: searchFailure,
  [Types.EMPLOYEE_DELETE_FAILURE]: deleteFailure,
  [Types.EMPLOYEE_RESET]: reset,
})
