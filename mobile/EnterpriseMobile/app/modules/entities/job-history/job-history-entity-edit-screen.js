import React from 'react'
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import JobHistoryActions from './job-history.reducer'
import JobActions from '../job/job.reducer'
import DepartmentActions from '../department/department.reducer'
import EmployeeActions from '../employee/employee.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { jobHistoryEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './job-history-entity-edit-screen-style'

let Form = t.form.Form
const Language = t.enums({
  FRENCH: 'FRENCH',
  ENGLISH: 'ENGLISH',
  SPANISH: 'SPANISH',
})

class JobHistoryEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        startDate: t.maybe(t.Date),
        endDate: t.maybe(t.Date),
        language: t.maybe(Language),
        jobId: this.getJobs(),
        departmentId: this.getDepartments(),
        employeeId: this.getEmployees(),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          jobId: {
            testID: 'jobIdInput',
            label: 'Job',
          },
          departmentId: {
            testID: 'departmentIdInput',
            label: 'Department',
          },
          employeeId: {
            testID: 'employeeIdInput',
            label: 'Employee',
          },
          startDate: {
            mode: 'date',
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('endDate').refs.input.focus(),
            testID: 'startDateInput',
          },
          endDate: {
            mode: 'date',
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('language').refs.input.focus(),
            testID: 'endDateInput',
          },
          language: {
            testID: 'languageInput',
          },
        },
      },
      jobHistory: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getJobHistory(props.data.entityId)
    }
    this.props.getAllJobs()
    this.props.getAllDepartments()
    this.props.getAllEmployees()

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.jobHistory !== prevState.jobHistory && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.jobHistory), jobHistory: nextProps.jobHistory }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        const entityId = this.props.jobHistory.id
        this.props.reset()
        this.props.getJobHistory(entityId)
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: jobHistoryEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  getJobs = () => {
    const jobs = {}
    this.props.jobs.forEach((job) => {
      jobs[job.id] = job.id ? job.id.toString() : job.id.toString()
    })
    return t.maybe(t.enums(jobs))
  }
  getDepartments = () => {
    const departments = {}
    this.props.departments.forEach((department) => {
      departments[department.id] = department.id ? department.id.toString() : department.id.toString()
    })
    return t.maybe(t.enums(departments))
  }
  getEmployees = () => {
    const employees = {}
    this.props.employees.forEach((employee) => {
      employees[employee.id] = employee.id ? employee.id.toString() : employee.id.toString()
    })
    return t.maybe(t.enums(employees))
  }
  submitForm() {
    // call getValue() to get the values of the form
    const jobHistory = this.form.getValue()
    if (jobHistory) {
      // if validation fails, value will be null
      this.props.updateJobHistory(formValueToEntity(jobHistory))
    }
  }

  formChange(newValue) {
    this.setState({
      formValue: newValue,
    })
  }

  render() {
    if (this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView testID="jobHistoryEditScrollView">
          <Form
            ref={(c) => {
              this.form = c
            }}
            type={this.state.formModel}
            options={this.state.formOptions}
            value={this.state.formValue}
            onChange={this.formChange}
          />
        </KeyboardAwareScrollView>
        <TouchableHighlight style={styles.button} onPress={this.submitForm} underlayColor="#99d9f4" testID="submitButton">
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
// convenience methods for customizing the mapping of the entity to/from the form value
const entityToFormValue = (value) => {
  if (!value) {
    return {}
  }
  return {
    id: value.id || null,
    startDate: value.startDate || null,
    endDate: value.endDate || null,
    language: value.language || null,
    jobId: value.job && value.job.id ? value.job.id : null,
    departmentId: value.department && value.department.id ? value.department.id : null,
    employeeId: value.employee && value.employee.id ? value.employee.id : null,
  }
}
const formValueToEntity = (value) => {
  const entity = {
    id: value.id || null,
    startDate: value.startDate || null,
    endDate: value.endDate || null,
    language: value.language || null,
  }
  if (value.jobId) {
    entity.job = { id: value.jobId }
  }
  if (value.departmentId) {
    entity.department = { id: value.departmentId }
  }
  if (value.employeeId) {
    entity.employee = { id: value.employeeId }
  }
  return entity
}

const mapStateToProps = (state) => {
  return {
    jobs: state.jobs.jobs || [],
    departments: state.departments.departments || [],
    employees: state.employees.employees || [],
    jobHistory: state.jobHistories.jobHistory,
    fetching: state.jobHistories.fetchingOne,
    updating: state.jobHistories.updating,
    error: state.jobHistories.errorUpdating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllJobs: (options) => dispatch(JobActions.jobAllRequest(options)),
    getAllDepartments: (options) => dispatch(DepartmentActions.departmentAllRequest(options)),
    getAllEmployees: (options) => dispatch(EmployeeActions.employeeAllRequest(options)),
    getJobHistory: (id) => dispatch(JobHistoryActions.jobHistoryRequest(id)),
    getAllJobHistories: (options) => dispatch(JobHistoryActions.jobHistoryAllRequest(options)),
    updateJobHistory: (jobHistory) => dispatch(JobHistoryActions.jobHistoryUpdateRequest(jobHistory)),
    reset: () => dispatch(JobHistoryActions.jobHistoryReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobHistoryEntityEditScreen)
