import React from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { locationEntityEditScreen } from '../../../navigation/layouts'

import LocationActions from './location.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './location-entity-detail-screen-style'

class LocationEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getLocation(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.resetLocations()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Location?',
      'Are you sure you want to delete the Location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteLocation(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.location || this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container} testID="locationDetailScrollView">
        <Text>ID: {this.props.location.id}</Text>
        <Text testID="streetAddress">StreetAddress: {this.props.location.streetAddress}</Text>
        <Text testID="postalCode">PostalCode: {this.props.location.postalCode}</Text>
        <Text testID="city">City: {this.props.location.city}</Text>
        <Text testID="stateProvince">StateProvince: {this.props.location.stateProvince}</Text>
        <RoundedButton text="Edit" onPress={locationEntityEditScreen.bind(this, { entityId: this.props.location.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    location: state.locations.location,
    fetching: state.locations.fetchingOne,
    deleting: state.locations.deleting,
    errorDeleting: state.locations.errorDeleting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getLocation: (id) => dispatch(LocationActions.locationRequest(id)),
    getAllLocations: (options) => dispatch(LocationActions.locationAllRequest(options)),
    deleteLocation: (id) => dispatch(LocationActions.locationDeleteRequest(id)),
    resetLocations: () => dispatch(LocationActions.locationReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationEntityDetailScreen)
