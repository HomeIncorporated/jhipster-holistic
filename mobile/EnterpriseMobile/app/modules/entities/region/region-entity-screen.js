import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { regionEntityDetailScreen, regionEntityEditScreen } from '../../../navigation/layouts'
import SearchBar from '../../../shared/components/search-bar/search-bar'
import RegionActions from './region.reducer'
import styles from './region-entity-screen-style'
import AlertMessage from '../../../shared/components/alert-message/alert-message'

// More info here: https://reactnative.dev/docs/flatlist.html

class RegionEntityScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)

    this.state = {
      page: 0,
      sort: 'id,asc',
      size: 20,
      searchTerm: '',
    }
  }

  navigationButtonPressed({ buttonId }) {
    regionEntityEditScreen({ entityId: null })
  }
  componentDidAppear() {
    this.setState({ page: 0 }, () => {
      this.handleLoadMore()
    })
  }

  renderRow({ item }) {
    return (
      <TouchableOpacity onPress={regionEntityDetailScreen.bind(this, { entityId: item.id })}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    )
  }

  // Render a header
  renderHeader = () => <SearchBar onSearch={this.performSearch} searchTerm={this.state.searchTerm} onCancel={this.cancelSearch} />

  // Show this when data is empty
  renderEmpty = () => <AlertMessage title="No Regions Found" show={!this.props.fetching} />

  keyExtractor = (item, index) => `${index}`

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

  cancelSearch = () => {
    this.setState({
      searchTerm: '',
    })
    this.fetchRegions()
  }

  performSearch = (query) => {
    if (query === '') {
      this.cancelSearch()
      return
    }
    this.setState({
      searchTerm: query,
    })
    this.props.performSearch(query)
  }
  fetchRegions = () => {
    this.props.getAllRegions({ page: this.state.page - 1, sort: this.state.sort, size: this.state.size })
  }

  handleLoadMore = () => {
    if (this.props.regions.length) {
      return
    }
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.fetchRegions()
      },
    )
  }

  render() {
    return (
      <View style={styles.container} testID="regionScreen">
        <FlatList
          contentContainerStyle={styles.listContent}
          data={this.props.regions}
          renderItem={this.renderRow}
          keyExtractor={this.keyExtractor}
          initialNumToRender={this.oneScreensWorth}
          onEndReached={this.handleLoadMore}
          ListHeaderComponent={this.renderHeader}
          /* ListFooterComponent={this.renderFooter} */
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
    regions: state.regions.regions,
    fetching: state.regions.fetchingAll,
    error: state.regions.errorAll,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    performSearch: (query) => dispatch(RegionActions.regionSearchRequest(query)),
    getAllRegions: (options) => dispatch(RegionActions.regionAllRequest(options)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionEntityScreen)
