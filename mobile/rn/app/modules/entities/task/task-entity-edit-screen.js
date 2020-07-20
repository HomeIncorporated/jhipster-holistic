import React from 'react'
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import TaskActions from './task.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { taskEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './task-entity-edit-screen-style'

let Form = t.form.Form

class TaskEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        title: t.maybe(t.String),
        description: t.maybe(t.String),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          title: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('description').refs.input.focus(),
            testID: 'titleInput',
          },
          description: {
            returnKeyType: 'done',
            onSubmitEditing: () => this.submitForm(),
            testID: 'descriptionInput',
          },
        },
      },
      task: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getTask(props.data.entityId)
    }

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.task !== prevState.task && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.task), task: nextProps.task }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        const entityId = this.props.task.id
        this.props.reset()
        this.props.getTask(entityId)
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: taskEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  submitForm() {
    // call getValue() to get the values of the form
    const task = this.form.getValue()
    if (task) {
      // if validation fails, value will be null
      this.props.updateTask(formValueToEntity(task))
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
        <KeyboardAwareScrollView testID="taskEditScrollView">
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
    title: value.title || null,
    description: value.description || null,
  }
}
const formValueToEntity = (value) => {
  const entity = {
    id: value.id || null,
    title: value.title || null,
    description: value.description || null,
  }
  return entity
}

const mapStateToProps = (state) => {
  return {
    task: state.tasks.task,
    fetching: state.tasks.fetchingOne,
    updating: state.tasks.updating,
    error: state.tasks.errorUpdating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTask: (id) => dispatch(TaskActions.taskRequest(id)),
    getAllTasks: (options) => dispatch(TaskActions.taskAllRequest(options)),
    updateTask: (task) => dispatch(TaskActions.taskUpdateRequest(task)),
    reset: () => dispatch(TaskActions.taskReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskEntityEditScreen)
