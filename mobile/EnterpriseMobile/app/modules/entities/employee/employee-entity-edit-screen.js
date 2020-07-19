import React from 'react'
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import EmployeeActions from './employee.reducer'
import DepartmentActions from '../department/department.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { employeeEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './employee-entity-edit-screen-style'

let Form = t.form.Form

class EmployeeEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        firstName: t.maybe(t.String),
        lastName: t.maybe(t.String),
        email: t.maybe(t.String),
        phoneNumber: t.maybe(t.String),
        hireDate: t.maybe(t.Date),
        salary: t.maybe(t.Number),
        commissionPct: t.maybe(t.Number),
        employeeId: this.getEmployees(),
        departmentId: this.getDepartments(),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          employeeId: {
            testID: 'employeeIdInput',
            label: 'Manager',
          },
          departmentId: {
            testID: 'departmentIdInput',
            label: 'Department',
          },
          firstName: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('lastName').refs.input.focus(),
            testID: 'firstNameInput',
          },
          lastName: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('email').refs.input.focus(),
            testID: 'lastNameInput',
          },
          email: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('phoneNumber').refs.input.focus(),
            testID: 'emailInput',
          },
          phoneNumber: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('hireDate').refs.input.focus(),
            testID: 'phoneNumberInput',
          },
          hireDate: {
            mode: 'date',
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('salary').refs.input.focus(),
            testID: 'hireDateInput',
          },
          salary: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('commissionPct').refs.input.focus(),
            testID: 'salaryInput',
          },
          commissionPct: {
            testID: 'commissionPctInput',
          },
        },
      },
      employee: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getEmployee(props.data.entityId)
    }
    this.props.getAllEmployees()
    this.props.getAllDepartments()

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.employee !== prevState.employee && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.employee), employee: nextProps.employee }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        const entityId = this.props.employee.id
        this.props.reset()
        this.props.getEmployee(entityId)
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: employeeEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  getEmployees = () => {
    const employees = {}
    this.props.employees.forEach((employee) => {
      employees[employee.id] = employee.id ? employee.id.toString() : employee.id.toString()
    })
    return t.maybe(t.enums(employees))
  }
  getDepartments = () => {
    const departments = {}
    this.props.departments.forEach((department) => {
      departments[department.id] = department.id ? department.id.toString() : department.id.toString()
    })
    return t.maybe(t.enums(departments))
  }
  submitForm() {
    // call getValue() to get the values of the form
    const employee = this.form.getValue()
    if (employee) {
      // if validation fails, value will be null
      this.props.updateEmployee(formValueToEntity(employee))
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
        <KeyboardAwareScrollView testID="employeeEditScrollView">
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
    firstName: value.firstName || null,
    lastName: value.lastName || null,
    email: value.email || null,
    phoneNumber: value.phoneNumber || null,
    hireDate: value.hireDate || null,
    salary: value.salary || null,
    commissionPct: value.commissionPct || null,
    employeeId: value.employee && value.employee.id ? value.employee.id : null,
    departmentId: value.department && value.department.id ? value.department.id : null,
  }
}
const formValueToEntity = (value) => {
  const entity = {
    id: value.id || null,
    firstName: value.firstName || null,
    lastName: value.lastName || null,
    email: value.email || null,
    phoneNumber: value.phoneNumber || null,
    hireDate: value.hireDate || null,
    salary: value.salary || null,
    commissionPct: value.commissionPct || null,
  }
  if (value.employeeId) {
    entity.employee = { id: value.employeeId }
  }
  if (value.departmentId) {
    entity.department = { id: value.departmentId }
  }
  return entity
}

const mapStateToProps = (state) => {
  return {
    employees: state.employees.employees || [],
    departments: state.departments.departments || [],
    employee: state.employees.employee,
    fetching: state.employees.fetchingOne,
    updating: state.employees.updating,
    error: state.employees.errorUpdating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDepartments: (options) => dispatch(DepartmentActions.departmentAllRequest(options)),
    getEmployee: (id) => dispatch(EmployeeActions.employeeRequest(id)),
    getAllEmployees: (options) => dispatch(EmployeeActions.employeeAllRequest(options)),
    updateEmployee: (employee) => dispatch(EmployeeActions.employeeUpdateRequest(employee)),
    reset: () => dispatch(EmployeeActions.employeeReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeEntityEditScreen)
