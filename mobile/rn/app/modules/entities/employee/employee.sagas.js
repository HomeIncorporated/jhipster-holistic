import { call, put } from 'redux-saga/effects'
import { callApi } from '../../../shared/sagas/call-api.saga'
import EmployeeActions from './employee.reducer'

export function* getEmployee(api, action) {
  const { employeeId } = action
  // make the call to the api
  const apiCall = call(api.getEmployee, employeeId)
  const response = yield call(callApi, apiCall)

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data)
    yield put(EmployeeActions.employeeSuccess(response.data))
  } else {
    yield put(EmployeeActions.employeeFailure(response.data))
  }
}

export function* getEmployees(api, action) {
  const { options } = action
  // make the call to the api
  const apiCall = call(api.getEmployees, options)
  const response = yield call(callApi, apiCall)

  // success?
  if (response.ok) {
    yield put(EmployeeActions.employeeAllSuccess(response.data, response.headers))
  } else {
    yield put(EmployeeActions.employeeAllFailure(response.data))
  }
}

export function* updateEmployee(api, action) {
  const { employee } = action
  // make the call to the api
  const idIsNotNull = !!employee.id
  const apiCall = call(idIsNotNull ? api.updateEmployee : api.createEmployee, employee)
  const response = yield call(callApi, apiCall)

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data)
    yield put(EmployeeActions.employeeUpdateSuccess(response.data))
  } else {
    yield put(EmployeeActions.employeeUpdateFailure(response.data))
  }
}

export function* searchEmployees(api, action) {
  const { query } = action
  // make the call to the api
  const apiCall = call(api.searchEmployees, query)
  const response = yield call(callApi, apiCall)

  // success?
  if (response.ok) {
    yield put(EmployeeActions.employeeSearchSuccess(response.data))
  } else {
    yield put(EmployeeActions.employeeSearchFailure(response.data))
  }
}
export function* deleteEmployee(api, action) {
  const { employeeId } = action
  // make the call to the api
  const apiCall = call(api.deleteEmployee, employeeId)
  const response = yield call(callApi, apiCall)

  // success?
  if (response.ok) {
    yield put(EmployeeActions.employeeDeleteSuccess())
  } else {
    yield put(EmployeeActions.employeeDeleteFailure(response.data))
  }
}
function mapDateFields(data) {
  if (data.hireDate) {
    data.hireDate = new Date(data.hireDate)
  }
  return data
}
