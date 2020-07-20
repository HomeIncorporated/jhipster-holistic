import React from 'react'
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import CountryActions from './country.reducer'
import RegionActions from '../region/region.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { countryEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './country-entity-edit-screen-style'

let Form = t.form.Form

class CountryEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        countryName: t.maybe(t.String),
        regionId: this.getRegions(),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          regionId: {
            testID: 'regionIdInput',
            label: 'Region',
          },
          countryName: {
            testID: 'countryNameInput',
          },
        },
      },
      country: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getCountry(props.data.entityId)
    }
    this.props.getAllRegions()

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.country !== prevState.country && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.country), country: nextProps.country }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        const entityId = this.props.country.id
        this.props.reset()
        this.props.getCountry(entityId)
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: countryEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  getRegions = () => {
    const regions = {}
    this.props.regions.forEach((region) => {
      regions[region.id] = region.id ? region.id.toString() : region.id.toString()
    })
    return t.maybe(t.enums(regions))
  }
  submitForm() {
    // call getValue() to get the values of the form
    const country = this.form.getValue()
    if (country) {
      // if validation fails, value will be null
      this.props.updateCountry(formValueToEntity(country))
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
        <KeyboardAwareScrollView testID="countryEditScrollView">
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
    countryName: value.countryName || null,
    regionId: value.region && value.region.id ? value.region.id : null,
  }
}
const formValueToEntity = (value) => {
  const entity = {
    id: value.id || null,
    countryName: value.countryName || null,
  }
  if (value.regionId) {
    entity.region = { id: value.regionId }
  }
  return entity
}

const mapStateToProps = (state) => {
  return {
    regions: state.regions.regions || [],
    country: state.countries.country,
    fetching: state.countries.fetchingOne,
    updating: state.countries.updating,
    error: state.countries.errorUpdating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllRegions: (options) => dispatch(RegionActions.regionAllRequest(options)),
    getCountry: (id) => dispatch(CountryActions.countryRequest(id)),
    getAllCountries: (options) => dispatch(CountryActions.countryAllRequest(options)),
    updateCountry: (country) => dispatch(CountryActions.countryUpdateRequest(country)),
    reset: () => dispatch(CountryActions.countryReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryEntityEditScreen)
