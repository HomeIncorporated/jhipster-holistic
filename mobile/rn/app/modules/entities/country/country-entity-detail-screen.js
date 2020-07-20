import React from 'react'
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { countryEntityEditScreen } from '../../../navigation/layouts'

import CountryActions from './country.reducer'
import RoundedButton from '../../../shared/components/rounded-button/rounded-button'
import styles from './country-entity-detail-screen-style'

class CountryEntityDetailScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.props.getCountry(this.props.data.entityId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deleting && !this.props.deleting) {
      if (this.props.errorDeleting) {
        Alert.alert('Error', 'Something went wrong deleting the entity', [{ text: 'OK' }])
      } else {
        this.props.resetCountries()
        Navigation.pop(this.props.componentId)
      }
    }
  }

  confirmDelete = () => {
    Alert.alert(
      'Delete Country?',
      'Are you sure you want to delete the Country?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.deleteCountry(this.props.data.entityId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  render() {
    if (!this.props.country || this.props.fetching) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView style={styles.container} testID="countryDetailScrollView">
        <Text>ID: {this.props.country.id}</Text>
        <Text testID="countryName">CountryName: {this.props.country.countryName}</Text>
        <RoundedButton text="Edit" onPress={countryEntityEditScreen.bind(this, { entityId: this.props.country.id })} />
        <RoundedButton text="Delete" onPress={this.confirmDelete} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    country: state.countries.country,
    fetching: state.countries.fetchingOne,
    deleting: state.countries.deleting,
    errorDeleting: state.countries.errorDeleting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCountry: (id) => dispatch(CountryActions.countryRequest(id)),
    getAllCountries: (options) => dispatch(CountryActions.countryAllRequest(options)),
    deleteCountry: (id) => dispatch(CountryActions.countryDeleteRequest(id)),
    resetCountries: () => dispatch(CountryActions.countryReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryEntityDetailScreen)
