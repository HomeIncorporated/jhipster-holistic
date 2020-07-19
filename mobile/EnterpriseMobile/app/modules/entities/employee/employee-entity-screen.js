import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { employeeEntityDetailScreen, employeeEntityEditScreen } from '../../../navigation/layouts'
import SearchBar from '../../../shared/components/search-bar/search-bar'
import EmployeeActions from './employee.reducer'
import styles from './employee-entity-screen-style'
import AlertMessage from '../../../shared/components/alert-message/alert-message'

// More info here: https://reactnative.dev/docs/flatlist.html

class EmployeeEntityScreen extends React.PureComponent {
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
    employeeEntityEditScreen({ entityId: null })
  }
  componentDidAppear() {
    this.setState({ page: 0 }, () => {
      this.handleLoadMore()
    })
  }

  renderRow({ item }) {
    return (
      <TouchableOpacity onPress={employeeEntityDetailScreen.bind(this, { entityId: item.id })}>
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
  renderEmpty = () => <AlertMessage title="No Employees Found" show={!this.props.fetching} />

  keyExtractor = (item, index) => `${index}`

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

  cancelSearch = () => {
    this.setState({
      searchTerm: '',
    })
    this.fetchEmployees()
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
  fetchEmployees = () => {
    this.props.getAllEmployees({ page: this.state.page - 1, sort: this.state.sort, size: this.state.size })
  }

  handleLoadMore = () => {
    if (this.state.page < this.props.links.next || this.props.links.next === undefined || this.props.fetching) {
      return
    }
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.fetchEmployees()
      },
    )
  }

  render() {
    return (
      <View style={styles.container} testID="employeeScreen">
        <FlatList
          contentContainerStyle={styles.listContent}
          data={this.props.employees}
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
    employees: state.employees.employees,
    fetching: state.employees.fetchingAll,
    error: state.employees.errorAll,
    links: state.employees.links,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    performSearch: (query) => dispatch(EmployeeActions.employeeSearchRequest(query)),
    getAllEmployees: (options) => dispatch(EmployeeActions.employeeAllRequest(options)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeEntityScreen)
