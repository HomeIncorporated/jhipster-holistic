const Utils = require('../utils')

describe('JobHistory Screen Tests', () => {
  before(async () => {
    await device.reloadReactNative()
    await Utils.loginAsUser()
  })
  after(async () => {
    await Utils.goBack()
    await Utils.goBack()
    await Utils.logout()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToJobHistoryScreen()
  })

  const navigateToJobHistoryScreen = async () => {
    await expect(element(by.id('launchScreen'))).toBeVisible()
    await element(by.id('menuButton')).tap()
    await element(by.id('entitiesDrawerButton')).tap()
    await Utils.scrollTo('jobHistoryEntityScreenButton', 'entityScreenScrollList')
    await element(by.id('jobHistoryEntityScreenButton')).tap()
  }

  it('should allow you to create an entity', async () => {
    await expect(element(by.id('jobHistoryScreen'))).toBeVisible()
    await expect(element(by.text('Create'))).toBeVisible()
    // create
    await element(by.id('jobHistoryCreateButton')).tap()
    await element(by.id('submitButton')).tap()
    await element(by.text('View')).tap()
    // update
    await element(by.text('EDIT')).tap()
    await element(by.id('submitButton')).tap()
    await element(by.text('OK')).tap()
    // delete
    await element(by.text('DELETE')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('jobHistoryScreen'))).toBeVisible()
  })
})
