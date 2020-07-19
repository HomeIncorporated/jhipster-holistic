import FixtureAPI from '../../../../app/shared/services/fixture-api'
import { call, put } from 'redux-saga/effects'

import { login, logout } from '../../../../app/modules/login/login.sagas'
import LoginActions from '../../../../app/modules/login/login.reducer'
import AccountActions from '../../../../app/shared/reducers/account.reducer'

const stepper = (fn) => (mock) => fn.next(mock).value

test('login success path', () => {
  const authObj = {
    username: 'user',
    password: 'user',
    rememberMe: true,
  }
  const response = FixtureAPI.login(authObj)
  const step = stepper(login(FixtureAPI, { username: 'user', password: 'user' }))

  expect(step(response)).toEqual(call(FixtureAPI.login, authObj))
  // Call success with the response
  expect(step(response)).toEqual(put(LoginActions.loginSuccess(response.data)))
  // Request the account details
  expect(step()).toEqual(put(AccountActions.accountRequest()))
  // Close the relogin popup if needed
  expect(step()).toEqual(put({ type: 'RELOGIN_OK' }))
})
test('login failure path', () => {
  const authObj = {
    username: 'user',
    password: 'user2',
    rememberMe: true,
  }
  const response = FixtureAPI.login(authObj)
  const step = stepper(login(FixtureAPI, { username: 'user', password: 'user2' }))

  // Attempt to login and fail
  expect(step(response)).toEqual(call(FixtureAPI.login, authObj))
  // Send the error
  expect(step(response)).toEqual(put(LoginActions.loginFailure('Bad credentials')))
})
test('logout success path', () => {
  const step = stepper(logout(FixtureAPI))
  const response = FixtureAPI.logout()
  // Remove the API token
  expect(step(response)).toEqual(call(FixtureAPI.logout))
  // Reset the account and logout
  expect(step()).toEqual(put(AccountActions.accountRequest()))
  expect(step()).toEqual(put(LoginActions.logoutSuccess()))
  expect(step()).toEqual(put({ type: 'RELOGIN_ABORT' }))
})
