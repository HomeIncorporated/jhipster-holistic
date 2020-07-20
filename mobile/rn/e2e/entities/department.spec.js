const Utils = require('../utils')

describe('Department Screen Tests', () => {
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
    await navigateToDepartmentScreen()
  })

  const navigateToDepartmentScreen = async () => {
    await expect(element(by.id('launchScreen'))).toBeVisible()
    await element(by.id('menuButton')).tap()
    await element(by.id('entitiesDrawerButton')).tap()
    await Utils.scrollTo('departmentEntityScreenButton', 'entityScreenScrollList')
    await element(by.id('departmentEntityScreenButton')).tap()
  }

  it('should allow you to create an entity', async () => {
    await expect(element(by.id('departmentScreen'))).toBeVisible()
    await expect(element(by.text('Create'))).toBeVisible()
    // create
    await element(by.id('departmentCreateButton')).tap()
    await Utils.scrollTo('departmentNameInput', 'departmentEditScrollView')
    await element(by.id('departmentNameInput')).replaceText('sample-data')
    await element(by.id('submitButton')).tap()
    await element(by.text('View')).tap()
    await Utils.scrollTo('departmentName', 'departmentDetailScrollView')
    await expect(element(by.id('departmentName'))).toHaveText('DepartmentName: sample-data')
    // update
    await element(by.text('EDIT')).tap()
    await Utils.scrollTo('departmentNameInput', 'departmentEditScrollView')
    await element(by.id('departmentNameInput')).replaceText('sample-data-2')
    await element(by.id('submitButton')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('departmentName'))).toHaveText('DepartmentName: sample-data-2')
    // delete
    await element(by.text('DELETE')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('departmentScreen'))).toBeVisible()
  })
})
