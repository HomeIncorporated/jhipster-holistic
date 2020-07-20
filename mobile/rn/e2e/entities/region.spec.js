const Utils = require('../utils')

describe('Region Screen Tests', () => {
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
    await navigateToRegionScreen()
  })

  const navigateToRegionScreen = async () => {
    await expect(element(by.id('launchScreen'))).toBeVisible()
    await element(by.id('menuButton')).tap()
    await element(by.id('entitiesDrawerButton')).tap()
    await Utils.scrollTo('regionEntityScreenButton', 'entityScreenScrollList')
    await element(by.id('regionEntityScreenButton')).tap()
  }

  it('should allow you to create an entity', async () => {
    await expect(element(by.id('regionScreen'))).toBeVisible()
    await expect(element(by.text('Create'))).toBeVisible()
    // create
    await element(by.id('regionCreateButton')).tap()
    await Utils.scrollTo('regionNameInput', 'regionEditScrollView')
    await element(by.id('regionNameInput')).replaceText('sample-data')
    await element(by.id('submitButton')).tap()
    await element(by.text('View')).tap()
    await Utils.scrollTo('regionName', 'regionDetailScrollView')
    await expect(element(by.id('regionName'))).toHaveText('RegionName: sample-data')
    // update
    await element(by.text('EDIT')).tap()
    await Utils.scrollTo('regionNameInput', 'regionEditScrollView')
    await element(by.id('regionNameInput')).replaceText('sample-data-2')
    await element(by.id('submitButton')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('regionName'))).toHaveText('RegionName: sample-data-2')
    // delete
    await element(by.text('DELETE')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('regionScreen'))).toBeVisible()
  })
})
