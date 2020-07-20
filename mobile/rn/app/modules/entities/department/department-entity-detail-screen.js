import React from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { departmentEntityEditScreen } from '../../../navigation/layouts'

import DepartmentActions from './department.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './department-entity-detail-screen-style'

class DepartmentEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getDepartment(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.resetDepartments()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Department?',
      'Are you sure you want to delete the Department?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteDepartment(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.department || this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container} testID="departmentDetailScrollView">
        <Text>ID: {this.props.department.id}</Text>
        <Text testID="departmentName">DepartmentName: {this.props.department.departmentName}</Text>
        <RoundedButton text="Edit" onPress={departmentEntityEditScreen.bind(this, { entityId: this.props.department.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    department: state.departments.department,
    fetching: state.departments.fetchingOne,
    deleting: state.departments.deleting,
    errorDeleting: state.departments.errorDeleting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDepartment: (id) => dispatch(DepartmentActions.departmentRequest(id)),
    getAllDepartments: (options) => dispatch(DepartmentActions.departmentAllRequest(options)),
    deleteDepartment: (id) => dispatch(DepartmentActions.departmentDeleteRequest(id)),
    resetDepartments: () => dispatch(DepartmentActions.departmentReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentEntityDetailScreen)
