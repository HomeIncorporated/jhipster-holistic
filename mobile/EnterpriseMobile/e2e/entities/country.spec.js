const Utils = require('../utils')

describe('Country Screen Tests', () => {
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
    await navigateToCountryScreen()
  })

  const navigateToCountryScreen = async () => {
    await expect(element(by.id('launchScreen'))).toBeVisible()
    await element(by.id('menuButton')).tap()
    await element(by.id('entitiesDrawerButton')).tap()
    await Utils.scrollTo('countryEntityScreenButton', 'entityScreenScrollList')
    await element(by.id('countryEntityScreenButton')).tap()
  }

  it('should allow you to create an entity', async () => {
    await expect(element(by.id('countryScreen'))).toBeVisible()
    await expect(element(by.text('Create'))).toBeVisible()
    // create
    await element(by.id('countryCreateButton')).tap()
    await Utils.scrollTo('countryNameInput', 'countryEditScrollView')
    await element(by.id('countryNameInput')).replaceText('sample-data')
    await element(by.id('submitButton')).tap()
    await element(by.text('View')).tap()
    await Utils.scrollTo('countryName', 'countryDetailScrollView')
    await expect(element(by.id('countryName'))).toHaveText('CountryName: sample-data')
    // update
    await element(by.text('EDIT')).tap()
    await Utils.scrollTo('countryNameInput', 'countryEditScrollView')
    await element(by.id('countryNameInput')).replaceText('sample-data-2')
    await element(by.id('submitButton')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('countryName'))).toHaveText('CountryName: sample-data-2')
    // delete
    await element(by.text('DELETE')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('countryScreen'))).toBeVisible()
  })
})
