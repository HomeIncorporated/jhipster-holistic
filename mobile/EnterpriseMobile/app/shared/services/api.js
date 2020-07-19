// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import CookieManager from '@react-native-community/cookies'

import AppConfig from '../../config/app-config'

// our "constructor"
const create = (baseURL = AppConfig.apiUrl) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
    },
    // 10 second timeout...
    timeout: 10000,
  })
  api.addAsyncRequestTransform((request) => async (request) => {
    const cookies = await CookieManager.get(baseURL)
    if (cookies['XSRF-TOKEN']) {
      request.headers['X-XSRF-TOKEN'] = cookies['XSRF-TOKEN']
    }
    return request
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const login = (userAuth) => api.post('auth/login', userAuth)
  const logout = () => api.post('auth/logout')
  const register = (user) => api.post(AppConfig.uaaBaseUrl + 'api/register', user)
  const forgotPassword = (data) =>
    api.post(AppConfig.uaaBaseUrl + 'api/account/reset-password/init', data, {
      headers: { 'Content-Type': 'text/plain', Accept: 'application/json, text/plain, */*' },
    })

  const getAccount = () => api.get(AppConfig.uaaBaseUrl + 'api/account')
  const updateAccount = (account) => api.post(AppConfig.uaaBaseUrl + 'api/account', account)
  const changePassword = (currentPassword, newPassword) =>
    api.post(
      AppConfig.uaaBaseUrl + 'api/account/change-password',
      { currentPassword, newPassword },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain, */*' } },
    )

  const getUser = (userId) => api.get('api/users/' + userId)
  const getUsers = (options) => api.get('api/users', options)
  const createUser = (user) => api.post('api/users', user)
  const updateUser = (user) => api.put('api/users', user)
  const deleteUser = (userId) => api.delete('api/users/' + userId)

  const getRegion = (regionId) => api.get('services/enterpriseapp/api/regions/' + regionId)
  const getRegions = (options) => api.get('services/enterpriseapp/api/regions', options)
  const createRegion = (region) => api.post('services/enterpriseapp/api/regions', region)
  const updateRegion = (region) => api.put('services/enterpriseapp/api/regions', region)
  const deleteRegion = (regionId) => api.delete('services/enterpriseapp/api/regions/' + regionId)
  const searchRegions = (query) => api.get('services/enterpriseapp/api/_search/regions', { query: query })

  const getCountry = (countryId) => api.get('services/enterpriseapp/api/countries/' + countryId)
  const getCountries = (options) => api.get('services/enterpriseapp/api/countries', options)
  const createCountry = (country) => api.post('services/enterpriseapp/api/countries', country)
  const updateCountry = (country) => api.put('services/enterpriseapp/api/countries', country)
  const deleteCountry = (countryId) => api.delete('services/enterpriseapp/api/countries/' + countryId)
  const searchCountries = (query) => api.get('services/enterpriseapp/api/_search/countries', { query: query })

  const getLocation = (locationId) => api.get('services/enterpriseapp/api/locations/' + locationId)
  const getLocations = (options) => api.get('services/enterpriseapp/api/locations', options)
  const createLocation = (location) => api.post('services/enterpriseapp/api/locations', location)
  const updateLocation = (location) => api.put('services/enterpriseapp/api/locations', location)
  const deleteLocation = (locationId) => api.delete('services/enterpriseapp/api/locations/' + locationId)
  const searchLocations = (query) => api.get('services/enterpriseapp/api/_search/locations', { query: query })

  const getDepartment = (departmentId) => api.get('services/enterpriseapp/api/departments/' + departmentId)
  const getDepartments = (options) => api.get('services/enterpriseapp/api/departments', options)
  const createDepartment = (department) => api.post('services/enterpriseapp/api/departments', department)
  const updateDepartment = (department) => api.put('services/enterpriseapp/api/departments', department)
  const deleteDepartment = (departmentId) => api.delete('services/enterpriseapp/api/departments/' + departmentId)
  const searchDepartments = (query) => api.get('services/enterpriseapp/api/_search/departments', { query: query })

  const getTask = (taskId) => api.get('services/enterpriseapp/api/tasks/' + taskId)
  const getTasks = (options) => api.get('services/enterpriseapp/api/tasks', options)
  const createTask = (task) => api.post('services/enterpriseapp/api/tasks', task)
  const updateTask = (task) => api.put('services/enterpriseapp/api/tasks', task)
  const deleteTask = (taskId) => api.delete('services/enterpriseapp/api/tasks/' + taskId)
  const searchTasks = (query) => api.get('services/enterpriseapp/api/_search/tasks', { query: query })

  const getEmployee = (employeeId) => api.get('services/enterpriseapp/api/employees/' + employeeId)
  const getEmployees = (options) => api.get('services/enterpriseapp/api/employees', options)
  const createEmployee = (employee) => api.post('services/enterpriseapp/api/employees', employee)
  const updateEmployee = (employee) => api.put('services/enterpriseapp/api/employees', employee)
  const deleteEmployee = (employeeId) => api.delete('services/enterpriseapp/api/employees/' + employeeId)
  const searchEmployees = (query) => api.get('services/enterpriseapp/api/_search/employees', { query: query })

  const getJob = (jobId) => api.get('services/enterpriseapp/api/jobs/' + jobId)
  const getJobs = (options) => api.get('services/enterpriseapp/api/jobs', options)
  const createJob = (job) => api.post('services/enterpriseapp/api/jobs', job)
  const updateJob = (job) => api.put('services/enterpriseapp/api/jobs', job)
  const deleteJob = (jobId) => api.delete('services/enterpriseapp/api/jobs/' + jobId)
  const searchJobs = (query) => api.get('services/enterpriseapp/api/_search/jobs', { query: query })

  const getJobHistory = (jobHistoryId) => api.get('services/enterpriseapp/api/job-histories/' + jobHistoryId)
  const getJobHistories = (options) => api.get('services/enterpriseapp/api/job-histories', options)
  const createJobHistory = (jobHistory) => api.post('services/enterpriseapp/api/job-histories', jobHistory)
  const updateJobHistory = (jobHistory) => api.put('services/enterpriseapp/api/job-histories', jobHistory)
  const deleteJobHistory = (jobHistoryId) => api.delete('services/enterpriseapp/api/job-histories/' + jobHistoryId)
  const searchJobHistories = (query) => api.get('services/enterpriseapp/api/_search/job-histories', { query: query })
  // ignite-jhipster-api-method-needle

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    createUser,
    updateUser,
    getUsers,
    getUser,
    deleteUser,

    createRegion,
    updateRegion,
    getRegions,
    getRegion,
    deleteRegion,
    searchRegions,

    createCountry,
    updateCountry,
    getCountries,
    getCountry,
    deleteCountry,
    searchCountries,

    createLocation,
    updateLocation,
    getLocations,
    getLocation,
    deleteLocation,
    searchLocations,

    createDepartment,
    updateDepartment,
    getDepartments,
    getDepartment,
    deleteDepartment,
    searchDepartments,

    createTask,
    updateTask,
    getTasks,
    getTask,
    deleteTask,
    searchTasks,

    createEmployee,
    updateEmployee,
    getEmployees,
    getEmployee,
    deleteEmployee,
    searchEmployees,

    createJob,
    updateJob,
    getJobs,
    getJob,
    deleteJob,
    searchJobs,

    createJobHistory,
    updateJobHistory,
    getJobHistories,
    getJobHistory,
    deleteJobHistory,
    searchJobHistories,
    // ignite-jhipster-api-export-needle
    logout,
    login,
    register,
    forgotPassword,
    getAccount,
    updateAccount,
    changePassword,
  }
}

// let's return back our create method as the default.
export default {
  create,
}
