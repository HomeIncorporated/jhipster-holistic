import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/job-history/job-history.reducer'

test('attempt retrieving a single jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryRequest({ id: 1 }))

  expect(state.fetchingOne).toBe(true)
  expect(state.jobHistory).toBe(null)
})

test('attempt retrieving a list of jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryAllRequest({ id: 1 }))

  expect(state.fetchingAll).toBe(true)
  expect(state.jobHistories).toEqual([])
})

test('attempt updating a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryUpdateRequest({ id: 1 }))

  expect(state.updating).toBe(true)
})
test('attempt searching a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistorySearchRequest(1))

  expect(state.searching).toBe(true)
})
test('attempt to deleting a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryDeleteRequest({ id: 1 }))

  expect(state.deleting).toBe(true)
})

test('success retrieving a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistorySuccess({ id: 1 }))

  expect(state.fetchingOne).toBe(false)
  expect(state.errorOne).toBe(null)
  expect(state.jobHistory).toEqual({ id: 1 })
})

test('success retrieving a list of jobHistory', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.jobHistoryAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  )

  expect(state.fetchingAll).toBe(false)
  expect(state.errorAll).toBe(null)
  expect(state.jobHistories).toEqual([{ id: 1 }, { id: 2 }])
  expect(state.links).toEqual({ first: 0, last: 1 })
  expect(state.totalItems).toEqual(5)
})

test('success updating a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryUpdateSuccess({ id: 1 }))

  expect(state.updating).toBe(false)
  expect(state.errorUpdating).toBe(null)
  expect(state.jobHistory).toEqual({ id: 1 })
})
test('success searching a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistorySearchSuccess({ id: 1 }))

  expect(state.searching).toBe(false)
  expect(state.errorSearching).toBe(null)
  expect(state.jobHistories).toEqual({ id: 1 })
})
test('success deleting a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryDeleteSuccess())

  expect(state.deleting).toBe(false)
  expect(state.errorDeleting).toBe(null)
  expect(state.jobHistory).toEqual(null)
})

test('failure retrieving a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryFailure({ error: 'Not found' }))

  expect(state.fetchingOne).toBe(false)
  expect(state.errorOne).toEqual({ error: 'Not found' })
  expect(state.jobHistory).toEqual(null)
})

test('failure retrieving a list of jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryAllFailure({ error: 'Not found' }))

  expect(state.fetchingAll).toBe(false)
  expect(state.errorAll).toEqual({ error: 'Not found' })
  expect(state.jobHistories).toEqual([])
})

test('failure updating a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryUpdateFailure({ error: 'Not found' }))

  expect(state.updating).toBe(false)
  expect(state.errorUpdating).toEqual({ error: 'Not found' })
  expect(state.jobHistory).toEqual(INITIAL_STATE.jobHistory)
})
test('failure searching a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistorySearchFailure({ error: 'Not found' }))

  expect(state.searching).toBe(false)
  expect(state.errorSearching).toEqual({ error: 'Not found' })
  expect(state.jobHistories).toEqual([])
})
test('failure deleting a jobHistory', () => {
  const state = reducer(INITIAL_STATE, Actions.jobHistoryDeleteFailure({ error: 'Not found' }))

  expect(state.deleting).toBe(false)
  expect(state.errorDeleting).toEqual({ error: 'Not found' })
  expect(state.jobHistory).toEqual(INITIAL_STATE.jobHistory)
})
