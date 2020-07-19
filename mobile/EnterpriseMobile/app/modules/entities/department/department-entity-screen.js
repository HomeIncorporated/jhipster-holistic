import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { departmentEntityDetailScreen, departmentEntityEditScreen } from '../../../navigation/layouts'
import SearchBar from '../../../shared/components/search-bar/search-bar'
import DepartmentActions from './department.reducer'
import styles from './department-entity-screen-style'
import AlertMessage from '../../../shared/components/alert-message/alert-message'

// More info here: https://reactnative.dev/docs/flatlist.html

class DepartmentEntityScreen extends React.PureComponent {
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
    departmentEntityEditScreen({ entityId: null })
  }
  componentDidAppear() {
    this.setState({ page: 0 }, () => {
      this.handleLoadMore()
    })
  }

  renderRow({ item }) {
    return (
      <TouchableOpacity onPress={departmentEntityDetailScreen.bind(this, { entityId: item.id })}>
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
  renderEmpty = () => <AlertMessage title="No Departments Found" show={!this.props.fetching} />

  keyExtractor = (item, index) => `${index}`

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

  cancelSearch = () => {
    this.setState({
      searchTerm: '',
    })
    this.fetchDepartments()
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
  fetchDepartments = () => {
    this.props.getAllDepartments({ page: this.state.page - 1, sort: this.state.sort, size: this.state.size })
  }

  handleLoadMore = () => {
    if (this.props.departments.length) {
      return
    }
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.fetchDepartments()
      },
    )
  }

  render() {
    return (
      <View style={styles.container} testID="departmentScreen">
        <FlatList
          contentContainerStyle={styles.listContent}
          data={this.props.departments}
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
    departments: state.departments.departments,
    fetching: state.departments.fetchingAll,
    error: state.departments.errorAll,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    performSearch: (query) => dispatch(DepartmentActions.departmentSearchRequest(query)),
    getAllDepartments: (options) => dispatch(DepartmentActions.departmentAllRequest(options)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentEntityScreen)
