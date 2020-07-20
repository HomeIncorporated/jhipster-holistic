import React from 'react'
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import LocationActions from './location.reducer'
import CountryActions from '../country/country.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { locationEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './location-entity-edit-screen-style'

let Form = t.form.Form

class LocationEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        streetAddress: t.maybe(t.String),
        postalCode: t.maybe(t.String),
        city: t.maybe(t.String),
        stateProvince: t.maybe(t.String),
        countryId: this.getCountries(),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          countryId: {
            testID: 'countryIdInput',
            label: 'Country',
          },
          streetAddress: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('postalCode').refs.input.focus(),
            testID: 'streetAddressInput',
          },
          postalCode: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('city').refs.input.focus(),
            testID: 'postalCodeInput',
          },
          city: {
            returnKeyType: 'next',
            onSubmitEditing: () => this.form.getComponent('stateProvince').refs.input.focus(),
            testID: 'cityInput',
          },
          stateProvince: {
            testID: 'stateProvinceInput',
          },
        },
      },
      location: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getLocation(props.data.entityId)
    }
    this.props.getAllCountries()

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location !== prevState.location && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.location), location: nextProps.location }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        const entityId = this.props.location.id
        this.props.reset()
        this.props.getLocation(entityId)
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: locationEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  getCountries = () => {
    const countries = {}
    this.props.countries.forEach((country) => {
      countries[country.id] = country.id ? country.id.toString() : country.id.toString()
    })
    return t.maybe(t.enums(countries))
  }
  submitForm() {
    // call getValue() to get the values of the form
    const location = this.form.getValue()
    if (location) {
      // if validation fails, value will be null
      this.props.updateLocation(formValueToEntity(location))
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
        <KeyboardAwareScrollView testID="locationEditScrollView">
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
    streetAddress: value.streetAddress || null,
    postalCode: value.postalCode || null,
    city: value.city || null,
    stateProvince: value.stateProvince || null,
    countryId: value.country && value.country.id ? value.country.id : null,
  }
}
const formValueToEntity = (value) => {
  const entity = {
    id: value.id || null,
    streetAddress: value.streetAddress || null,
    postalCode: value.postalCode || null,
    city: value.city || null,
    stateProvince: value.stateProvince || null,
  }
  if (value.countryId) {
    entity.country = { id: value.countryId }
  }
  return entity
}

const mapStateToProps = (state) => {
  return {
    countries: state.countries.countries || [],
    location: state.locations.location,
    fetching: state.locations.fetchingOne,
    updating: state.locations.updating,
    error: state.locations.errorUpdating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCountries: (options) => dispatch(CountryActions.countryAllRequest(options)),
    getLocation: (id) => dispatch(LocationActions.locationRequest(id)),
    getAllLocations: (options) => dispatch(LocationActions.locationAllRequest(options)),
    updateLocation: (location) => dispatch(LocationActions.locationUpdateRequest(location)),
    reset: () => dispatch(LocationActions.locationReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationEntityEditScreen)
