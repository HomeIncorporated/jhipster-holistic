import React from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { jobEntityEditScreen } from '../../../navigation/layouts'

import JobActions from './job.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './job-entity-detail-screen-style'

class JobEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getJob(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.resetJobs()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Job?',
      'Are you sure you want to delete the Job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteJob(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.job || this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container} testID="jobDetailScrollView">
        <Text>ID: {this.props.job.id}</Text>
        <Text testID="jobTitle">JobTitle: {this.props.job.jobTitle}</Text>
        <Text testID="minSalary">MinSalary: {this.props.job.minSalary}</Text>
        <Text testID="maxSalary">MaxSalary: {this.props.job.maxSalary}</Text>
        <RoundedButton text="Edit" onPress={jobEntityEditScreen.bind(this, { entityId: this.props.job.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    job: state.jobs.job,
    fetching: state.jobs.fetchingOne,
    deleting: state.jobs.deleting,
    errorDeleting: state.jobs.errorDeleting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getJob: (id) => dispatch(JobActions.jobRequest(id)),
    getAllJobs: (options) => dispatch(JobActions.jobAllRequest(options)),
    deleteJob: (id) => dispatch(JobActions.jobDeleteRequest(id)),
    resetJobs: () => dispatch(JobActions.jobReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobEntityDetailScreen)
