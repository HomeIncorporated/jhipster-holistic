import React from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { employeeEntityEditScreen } from '../../../navigation/layouts'

import EmployeeActions from './employee.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './employee-entity-detail-screen-style'

class EmployeeEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getEmployee(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.resetEmployees()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Employee?',
      'Are you sure you want to delete the Employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteEmployee(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.employee || this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container} testID="employeeDetailScrollView">
        <Text>ID: {this.props.employee.id}</Text>
        <Text testID="firstName">FirstName: {this.props.employee.firstName}</Text>
        <Text testID="lastName">LastName: {this.props.employee.lastName}</Text>
        <Text testID="email">Email: {this.props.employee.email}</Text>
        <Text testID="phoneNumber">PhoneNumber: {this.props.employee.phoneNumber}</Text>
        <Text testID="hireDate">HireDate: {String(this.props.employee.hireDate)}</Text>
        <Text testID="salary">Salary: {this.props.employee.salary}</Text>
        <Text testID="commissionPct">CommissionPct: {this.props.employee.commissionPct}</Text>
        <RoundedButton text="Edit" onPress={employeeEntityEditScreen.bind(this, { entityId: this.props.employee.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    employee: state.employees.employee,
    fetching: state.employees.fetchingOne,
    deleting: state.employees.deleting,
    errorDeleting: state.employees.errorDeleting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getEmployee: (id) => dispatch(EmployeeActions.employeeRequest(id)),
    getAllEmployees: (options) => dispatch(EmployeeActions.employeeAllRequest(options)),
    deleteEmployee: (id) => dispatch(EmployeeActions.employeeDeleteRequest(id)),
    resetEmployees: () => dispatch(EmployeeActions.employeeReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeEntityDetailScreen)
