const Utils = require('../utils')

describe('Location Screen Tests', () => {
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
    await navigateToLocationScreen()
  })

  const navigateToLocationScreen = async () => {
    await expect(element(by.id('launchScreen'))).toBeVisible()
    await element(by.id('menuButton')).tap()
    await element(by.id('entitiesDrawerButton')).tap()
    await Utils.scrollTo('locationEntityScreenButton', 'entityScreenScrollList')
    await element(by.id('locationEntityScreenButton')).tap()
  }

  it('should allow you to create an entity', async () => {
    await expect(element(by.id('locationScreen'))).toBeVisible()
    await expect(element(by.text('Create'))).toBeVisible()
    // create
    await element(by.id('locationCreateButton')).tap()
    await Utils.scrollTo('streetAddressInput', 'locationEditScrollView')
    await element(by.id('streetAddressInput')).replaceText('sample-data')
    await Utils.scrollTo('postalCodeInput', 'locationEditScrollView')
    await element(by.id('postalCodeInput')).replaceText('sample-data')
    await Utils.scrollTo('cityInput', 'locationEditScrollView')
    await element(by.id('cityInput')).replaceText('sample-data')
    await Utils.scrollTo('stateProvinceInput', 'locationEditScrollView')
    await element(by.id('stateProvinceInput')).replaceText('sample-data')
    await element(by.id('submitButton')).tap()
    await element(by.text('View')).tap()
    await Utils.scrollTo('streetAddress', 'locationDetailScrollView')
    await expect(element(by.id('streetAddress'))).toHaveText('StreetAddress: sample-data')
    await Utils.scrollTo('postalCode', 'locationDetailScrollView')
    await expect(element(by.id('postalCode'))).toHaveText('PostalCode: sample-data')
    await Utils.scrollTo('city', 'locationDetailScrollView')
    await expect(element(by.id('city'))).toHaveText('City: sample-data')
    await Utils.scrollTo('stateProvince', 'locationDetailScrollView')
    await expect(element(by.id('stateProvince'))).toHaveText('StateProvince: sample-data')
    // update
    await element(by.text('EDIT')).tap()
    await Utils.scrollTo('streetAddressInput', 'locationEditScrollView')
    await element(by.id('streetAddressInput')).replaceText('sample-data-2')
    await Utils.scrollTo('postalCodeInput', 'locationEditScrollView')
    await element(by.id('postalCodeInput')).replaceText('sample-data-2')
    await Utils.scrollTo('cityInput', 'locationEditScrollView')
    await element(by.id('cityInput')).replaceText('sample-data-2')
    await Utils.scrollTo('stateProvinceInput', 'locationEditScrollView')
    await element(by.id('stateProvinceInput')).replaceText('sample-data-2')
    await element(by.id('submitButton')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('streetAddress'))).toHaveText('StreetAddress: sample-data-2')
    await expect(element(by.id('postalCode'))).toHaveText('PostalCode: sample-data-2')
    await expect(element(by.id('city'))).toHaveText('City: sample-data-2')
    await expect(element(by.id('stateProvince'))).toHaveText('StateProvince: sample-data-2')
    // delete
    await element(by.text('DELETE')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('locationScreen'))).toBeVisible()
  })
})
