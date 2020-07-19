import React from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { taskEntityEditScreen } from '../../../navigation/layouts'

import TaskActions from './task.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './task-entity-detail-screen-style'

class TaskEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getTask(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.resetTasks()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Task?',
      'Are you sure you want to delete the Task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteTask(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.task || this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container} testID="taskDetailScrollView">
        <Text>ID: {this.props.task.id}</Text>
        <Text testID="title">Title: {this.props.task.title}</Text>
        <Text testID="description">Description: {this.props.task.description}</Text>
        <RoundedButton text="Edit" onPress={taskEntityEditScreen.bind(this, { entityId: this.props.task.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    task: state.tasks.task,
    fetching: state.tasks.fetchingOne,
    deleting: state.tasks.deleting,
    errorDeleting: state.tasks.errorDeleting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTask: (id) => dispatch(TaskActions.taskRequest(id)),
    getAllTasks: (options) => dispatch(TaskActions.taskAllRequest(options)),
    deleteTask: (id) => dispatch(TaskActions.taskDeleteRequest(id)),
    resetTasks: () => dispatch(TaskActions.taskReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskEntityDetailScreen)
