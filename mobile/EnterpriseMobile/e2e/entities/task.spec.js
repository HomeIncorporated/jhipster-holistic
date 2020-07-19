const Utils = require('../utils')

describe('Task Screen Tests', () => {
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
    await navigateToTaskScreen()
  })

  const navigateToTaskScreen = async () => {
    await expect(element(by.id('launchScreen'))).toBeVisible()
    await element(by.id('menuButton')).tap()
    await element(by.id('entitiesDrawerButton')).tap()
    await Utils.scrollTo('taskEntityScreenButton', 'entityScreenScrollList')
    await element(by.id('taskEntityScreenButton')).tap()
  }

  it('should allow you to create an entity', async () => {
    await expect(element(by.id('taskScreen'))).toBeVisible()
    await expect(element(by.text('Create'))).toBeVisible()
    // create
    await element(by.id('taskCreateButton')).tap()
    await Utils.scrollTo('titleInput', 'taskEditScrollView')
    await element(by.id('titleInput')).replaceText('sample-data')
    await Utils.scrollTo('descriptionInput', 'taskEditScrollView')
    await element(by.id('descriptionInput')).replaceText('sample-data')
    await element(by.id('submitButton')).tap()
    await element(by.text('View')).tap()
    await Utils.scrollTo('title', 'taskDetailScrollView')
    await expect(element(by.id('title'))).toHaveText('Title: sample-data')
    await Utils.scrollTo('description', 'taskDetailScrollView')
    await expect(element(by.id('description'))).toHaveText('Description: sample-data')
    // update
    await element(by.text('EDIT')).tap()
    await Utils.scrollTo('titleInput', 'taskEditScrollView')
    await element(by.id('titleInput')).replaceText('sample-data-2')
    await Utils.scrollTo('descriptionInput', 'taskEditScrollView')
    await element(by.id('descriptionInput')).replaceText('sample-data-2')
    await element(by.id('submitButton')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('title'))).toHaveText('Title: sample-data-2')
    await expect(element(by.id('description'))).toHaveText('Description: sample-data-2')
    // delete
    await element(by.text('DELETE')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('taskScreen'))).toBeVisible()
  })
})
