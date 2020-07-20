import React from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { regionEntityEditScreen } from '../../../navigation/layouts'

import RegionActions from './region.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './region-entity-detail-screen-style'

class RegionEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getRegion(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.resetRegions()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Region?',
      'Are you sure you want to delete the Region?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteRegion(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.region || this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container} testID="regionDetailScrollView">
        <Text>ID: {this.props.region.id}</Text>
        <Text testID="regionName">RegionName: {this.props.region.regionName}</Text>
        <RoundedButton text="Edit" onPress={regionEntityEditScreen.bind(this, { entityId: this.props.region.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    region: state.regions.region,
    fetching: state.regions.fetchingOne,
    deleting: state.regions.deleting,
    errorDeleting: state.regions.errorDeleting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRegion: (id) => dispatch(RegionActions.regionRequest(id)),
    getAllRegions: (options) => dispatch(RegionActions.regionAllRequest(options)),
    deleteRegion: (id) => dispatch(RegionActions.regionDeleteRequest(id)),
    resetRegions: () => dispatch(RegionActions.regionReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionEntityDetailScreen)
