import React from 'react'
import { ActivityIndicator, Alert, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import RegionActions from './region.reducer'
import { Navigation } from 'react-native-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { regionEntityDetailScreen } from '../../../navigation/layouts'

import t from 'tcomb-form-native'

import styles from './region-entity-edit-screen-style'

let Form = t.form.Form

class RegionEntityEditScreen extends React.Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = {
      formModel: t.struct({
        id: t.maybe(t.Number),
        regionName: t.maybe(t.String),
      }),
      formValue: { id: null },
      formOptions: {
        fields: {
          id: {
            hidden: true,
          },
          regionName: {
            returnKeyType: 'done',
            onSubmitEditing: () => this.submitForm(),
            testID: 'regionNameInput',
          },
        },
      },
      region: {},
      isNewEntity: true,
    }
    if (props.data && props.data.entityId) {
      this.state.isNewEntity = false
      this.props.getRegion(props.data.entityId)
    }

    this.submitForm = this.submitForm.bind(this)
    this.formChange = this.formChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.region !== prevState.region && !prevState.isNewEntity) {
      return { formValue: entityToFormValue(nextProps.region), region: nextProps.region }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.updating && !this.props.updating) {
      if (this.props.error) {
        Alert.alert('Error', 'Something went wrong updating the entity', [{ text: 'OK' }])
      } else {
        const entityId = this.props.region.id
        this.props.reset()
        this.props.getRegion(entityId)
        const alertOptions = [{ text: 'OK' }]
        if (!this.state.formValue.id) {
          alertOptions.push({
            text: 'View',
            onPress: regionEntityDetailScreen.bind(this, { entityId }),
          })
        }
        Navigation.pop(this.props.componentId)
        Alert.alert('Success', 'Entity saved successfully', alertOptions)
      }
    }
  }

  submitForm() {
    // call getValue() to get the values of the form
    const region = this.form.getValue()
    if (region) {
      // if validation fails, value will be null
      this.props.updateRegion(formValueToEntity(region))
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
        <KeyboardAwareScrollView testID="regionEditScrollView">
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
    regionName: value.regionName || null,
  }
}
const formValueToEntity = (value) => {
  const entity = {
    id: value.id || null,
    regionName: value.regionName || null,
  }
  return entity
}

const mapStateToProps = (state) => {
  return {
    region: state.regions.region,
    fetching: state.regions.fetchingOne,
    updating: state.regions.updating,
    error: state.regions.errorUpdating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRegion: (id) => dispatch(RegionActions.regionRequest(id)),
    getAllRegions: (options) => dispatch(RegionActions.regionAllRequest(options)),
    updateRegion: (region) => dispatch(RegionActions.regionUpdateRequest(region)),
    reset: () => dispatch(RegionActions.regionReset()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionEntityEditScreen)
