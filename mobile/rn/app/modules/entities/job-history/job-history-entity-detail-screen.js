import React from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { jobHistoryEntityEditScreen } from '../../../navigation/layouts'

import JobHistoryActions from './job-history.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './job-history-entity-detail-screen-style'

class JobHistoryEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getJobHistory(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.resetJobHistories()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete JobHistory?',
      'Are you sure you want to delete the JobHistory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteJobHistory(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.jobHistory || this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container} testID="jobHistoryDetailScrollView">
        <Text>ID: {this.props.jobHistory.id}</Text>
        <Text testID="startDate">StartDate: {String(this.props.jobHistory.startDate)}</Text>
        <Text testID="endDate">EndDate: {String(this.props.jobHistory.endDate)}</Text>
        <Text testID="language">Language: {this.props.jobHistory.language}</Text>
        <RoundedButton text="Edit" onPress={jobHistoryEntityEditScreen.bind(this, { entityId: this.props.jobHistory.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    jobHistory: state.jobHistories.jobHistory,
    fetching: state.jobHistories.fetchingOne,
    deleting: state.jobHistories.deleting,
    errorDeleting: state.jobHistories.errorDeleting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getJobHistory: (id) => dispatch(JobHistoryActions.jobHistoryRequest(id)),
    getAllJobHistories: (options) => dispatch(JobHistoryActions.jobHistoryAllRequest(options)),
    deleteJobHistory: (id) => dispatch(JobHistoryActions.jobHistoryDeleteRequest(id)),
    resetJobHistories: () => dispatch(JobHistoryActions.jobHistoryReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobHistoryEntityDetailScreen)
