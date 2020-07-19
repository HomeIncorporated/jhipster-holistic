const Utils = require('../utils')

describe('Job Screen Tests', () => {
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
    await navigateToJobScreen()
  })

  const navigateToJobScreen = async () => {
    await expect(element(by.id('launchScreen'))).toBeVisible()
    await element(by.id('menuButton')).tap()
    await element(by.id('entitiesDrawerButton')).tap()
    await Utils.scrollTo('jobEntityScreenButton', 'entityScreenScrollList')
    await element(by.id('jobEntityScreenButton')).tap()
  }

  it('should allow you to create an entity', async () => {
    await expect(element(by.id('jobScreen'))).toBeVisible()
    await expect(element(by.text('Create'))).toBeVisible()
    // create
    await element(by.id('jobCreateButton')).tap()
    await Utils.scrollTo('jobTitleInput', 'jobEditScrollView')
    await element(by.id('jobTitleInput')).replaceText('sample-data')
    await Utils.scrollTo('minSalaryInput', 'jobEditScrollView')
    await element(by.id('minSalaryInput')).replaceText('123')
    await Utils.scrollTo('maxSalaryInput', 'jobEditScrollView')
    await element(by.id('maxSalaryInput')).replaceText('123')
    await element(by.id('submitButton')).tap()
    await element(by.text('View')).tap()
    await Utils.scrollTo('jobTitle', 'jobDetailScrollView')
    await expect(element(by.id('jobTitle'))).toHaveText('JobTitle: sample-data')
    await Utils.scrollTo('minSalary', 'jobDetailScrollView')
    await expect(element(by.id('minSalary'))).toHaveText('MinSalary: 123')
    await Utils.scrollTo('maxSalary', 'jobDetailScrollView')
    await expect(element(by.id('maxSalary'))).toHaveText('MaxSalary: 123')
    // update
    await element(by.text('EDIT')).tap()
    await Utils.scrollTo('jobTitleInput', 'jobEditScrollView')
    await element(by.id('jobTitleInput')).replaceText('sample-data-2')
    await Utils.scrollTo('minSalaryInput', 'jobEditScrollView')
    await element(by.id('minSalaryInput')).replaceText('1234')
    await Utils.scrollTo('maxSalaryInput', 'jobEditScrollView')
    await element(by.id('maxSalaryInput')).replaceText('1234')
    await element(by.id('submitButton')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('jobTitle'))).toHaveText('JobTitle: sample-data-2')
    await expect(element(by.id('minSalary'))).toHaveText('MinSalary: 1234')
    await expect(element(by.id('maxSalary'))).toHaveText('MaxSalary: 1234')
    // delete
    await element(by.text('DELETE')).tap()
    await element(by.text('OK')).tap()
    await expect(element(by.id('jobScreen'))).toBeVisible()
  })
})
