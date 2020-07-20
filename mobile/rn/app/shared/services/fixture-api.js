export default {
  // Functions return fixtures

  // entity fixtures
  updateRegion: (region) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-region.json'),
    }
  },
  getRegions: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-regions.json'),
    }
  },
  getRegion: (regionId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-region.json'),
    }
  },
  deleteRegion: (regionId) => {
    return {
      ok: true,
    }
  },
  searchRegions: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-regions.json'),
    }
  },
  updateCountry: (country) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-country.json'),
    }
  },
  getCountries: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-countries.json'),
    }
  },
  getCountry: (countryId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-country.json'),
    }
  },
  deleteCountry: (countryId) => {
    return {
      ok: true,
    }
  },
  searchCountries: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-countries.json'),
    }
  },
  updateLocation: (location) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-location.json'),
    }
  },
  getLocations: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-locations.json'),
    }
  },
  getLocation: (locationId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-location.json'),
    }
  },
  deleteLocation: (locationId) => {
    return {
      ok: true,
    }
  },
  searchLocations: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-locations.json'),
    }
  },
  updateDepartment: (department) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-department.json'),
    }
  },
  getDepartments: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-departments.json'),
    }
  },
  getDepartment: (departmentId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-department.json'),
    }
  },
  deleteDepartment: (departmentId) => {
    return {
      ok: true,
    }
  },
  searchDepartments: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-departments.json'),
    }
  },
  updateTask: (task) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-task.json'),
    }
  },
  getTasks: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-tasks.json'),
    }
  },
  getTask: (taskId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-task.json'),
    }
  },
  deleteTask: (taskId) => {
    return {
      ok: true,
    }
  },
  searchTasks: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-tasks.json'),
    }
  },
  updateEmployee: (employee) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-employee.json'),
    }
  },
  getEmployees: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-employees.json'),
    }
  },
  getEmployee: (employeeId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-employee.json'),
    }
  },
  deleteEmployee: (employeeId) => {
    return {
      ok: true,
    }
  },
  searchEmployees: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-employees.json'),
    }
  },
  updateJob: (job) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-job.json'),
    }
  },
  getJobs: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-jobs.json'),
    }
  },
  getJob: (jobId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-job.json'),
    }
  },
  deleteJob: (jobId) => {
    return {
      ok: true,
    }
  },
  searchJobs: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-jobs.json'),
    }
  },
  updateJobHistory: (jobHistory) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-jobhistory.json'),
    }
  },
  getJobHistories: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-jobhistories.json'),
    }
  },
  getJobHistory: (jobHistoryId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-jobhistory.json'),
    }
  },
  deleteJobHistory: (jobHistoryId) => {
    return {
      ok: true,
    }
  },
  searchJobHistories: (query) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/search-jobhistories.json'),
    }
  },
  // ignite-jhipster-api-fixture-needle

  // user fixtures
  updateUser: (user) => {
    return {
      ok: true,
      data: require('../fixtures/update-user.json'),
    }
  },
  getUsers: () => {
    return {
      ok: true,
      data: require('../fixtures/get-users.json'),
    }
  },
  getUser: (userId) => {
    return {
      ok: true,
      data: require('../fixtures/get-user.json'),
    }
  },
  deleteUser: (userId) => {
    return {
      ok: true,
    }
  },
  // auth fixtures
  logout: () => {
    return {
      ok: true,
    }
  },
  login: (authObj) => {
    if (authObj.username === 'user' && authObj.password === 'user') {
      return {
        ok: true,
        data: require('../fixtures/login.json'),
      }
    } else {
      return {
        ok: false,
        status: 400,
        data: 'Invalid credentials',
      }
    }
  },
  register: ({ user }) => {
    if (user === 'user') {
      return {
        ok: true,
      }
    } else {
      return {
        ok: false,
        data: {
          title: 'Invalid email',
        },
      }
    }
  },
  forgotPassword: ({ email }) => {
    if (email === 'valid@gmail.com') {
      return {
        ok: true,
      }
    } else {
      return {
        ok: false,
        data: 'Invalid email',
      }
    }
  },
  getAccount: () => {
    return {
      ok: true,
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      data: require('../fixtures/get-account.json'),
    }
  },
  updateAccount: () => {
    return {
      ok: true,
    }
  },
  changePassword: ({ currentPassword }) => {
    if (currentPassword === 'valid-password') {
      return {
        ok: true,
      }
    } else {
      return {
        ok: false,
        data: 'Password error',
      }
    }
  },
}
