import React from 'react'
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import DepartmentActions from './department.reducer'
import LocationActions from '../location/location.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { departmentEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './department-entity-edit-screen-style'

let Form = t.form.Form

class DepartmentEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        departmentName: t.String,
        locationId: this.getLocations(),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          locationId: {
            testID: 'locationIdInput',
            label: 'Location',
          },
          departmentName: {
            testID: 'departmentNameInput',
          },
        },
      },
      department: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getDepartment(props.data.entityId)
    }
    this.props.getAllLocations()

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.department !== prevState.department && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.department), department: nextProps.department }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        const entityId = this.props.department.id
        this.props.reset()
        this.props.getDepartment(entityId)
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: departmentEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  getLocations = () => {
    const locations = {}
    this.props.locations.forEach((location) => {
      locations[location.id] = location.id ? location.id.toString() : location.id.toString()
    })
    return t.maybe(t.enums(locations))
  }
  submitForm() {
    // call getValue() to get the values of the form
    const department = this.form.getValue()
    if (department) {
      // if validation fails, value will be null
      this.props.updateDepartment(formValueToEntity(department))
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
        <KeyboardAwareScrollView testID="departmentEditScrollView">
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
    departmentName: value.departmentName || null,
    locationId: value.location && value.location.id ? value.location.id : null,
  }
}
const formValueToEntity = (value) => {
  const entity = {
    id: value.id || null,
    departmentName: value.departmentName || null,
  }
  if (value.locationId) {
    entity.location = { id: value.locationId }
  }
  return entity
}

const mapStateToProps = (state) => {
  return {
    locations: state.locations.locations || [],
    department: state.departments.department,
    fetching: state.departments.fetchingOne,
    updating: state.departments.updating,
    error: state.departments.errorUpdating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllLocations: (options) => dispatch(LocationActions.locationAllRequest(options)),
    getDepartment: (id) => dispatch(DepartmentActions.departmentRequest(id)),
    getAllDepartments: (options) => dispatch(DepartmentActions.departmentAllRequest(options)),
    updateDepartment: (department) => dispatch(DepartmentActions.departmentUpdateRequest(department)),
    reset: () => dispatch(DepartmentActions.departmentReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentEntityEditScreen)
