import React from 'react'
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import JobActions from './job.reducer'
import TaskActions from '../task/task.reducer'
import EmployeeActions from '../employee/employee.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { jobEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './job-entity-edit-screen-style'

let Form = t.form.Form

class JobEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        jobTitle: t.maybe(t.String),
        minSalary: t.maybe(t.Number),
        maxSalary: t.maybe(t.Number),
        tasks: t.list(this.getTasks()),
        employeeId: this.getEmployees(),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          taskId: {
            testID: 'taskIdInput',
            label: 'Task',
          },
          employeeId: {
            testID: 'employeeIdInput',
            label: 'Employee',
          },
          jobTitle: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('minSalary').refs.input.focus(),
            testID: 'jobTitleInput',
          },
          minSalary: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('maxSalary').refs.input.focus(),
            testID: 'minSalaryInput',
          },
          maxSalary: {
            testID: 'maxSalaryInput',
          },
        },
      },
      job: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getJob(props.data.entityId)
    }
    this.props.getAllTasks()
    this.props.getAllEmployees()

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.job !== prevState.job && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.job), job: nextProps.job }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        const entityId = this.props.job.id
        this.props.reset()
        this.props.getJob(entityId)
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: jobEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  getTasks = () => {
    const tasks = {}
    this.props.tasks.forEach((task) => {
      tasks[task.id] = task.title ? task.title.toString() : task.id.toString()
    })
    return t.maybe(t.enums(tasks))
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
    const job = this.form.getValue()
    if (job) {
      // if validation fails, value will be null
      this.props.updateJob(formValueToEntity(job))
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
        <KeyboardAwareScrollView testID="jobEditScrollView">
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
    jobTitle: value.jobTitle || null,
    minSalary: value.minSalary || null,
    maxSalary: value.maxSalary || null,
    tasks: [].concat(
      value.tasks.map((task) => {
        return task.id
      }),
    ),
    employeeId: value.employee && value.employee.id ? value.employee.id : null,
  }
}
const formValueToEntity = (value) => {
  const entity = {
    id: value.id || null,
    jobTitle: value.jobTitle || null,
    minSalary: value.minSalary || null,
    maxSalary: value.maxSalary || null,
  }
  entity.tasks = [].concat(
    value.tasks.map((task) => {
      return { id: task }
    }),
  )
  if (value.employeeId) {
    entity.employee = { id: value.employeeId }
  }
  return entity
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks.tasks || [],
    employees: state.employees.employees || [],
    job: state.jobs.job,
    fetching: state.jobs.fetchingOne,
    updating: state.jobs.updating,
    error: state.jobs.errorUpdating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllTasks: (options) => dispatch(TaskActions.taskAllRequest(options)),
    getAllEmployees: (options) => dispatch(EmployeeActions.employeeAllRequest(options)),
    getJob: (id) => dispatch(JobActions.jobRequest(id)),
    getAllJobs: (options) => dispatch(JobActions.jobAllRequest(options)),
    updateJob: (job) => dispatch(JobActions.jobUpdateRequest(job)),
    reset: () => dispatch(JobActions.jobReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobEntityEditScreen)
