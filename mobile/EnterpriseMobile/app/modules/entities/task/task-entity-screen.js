import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from 'react-native-navigation'
import { taskEntityDetailScreen, taskEntityEditScreen } from '../../../navigation/layouts'
import SearchBar from '../../../shared/components/search-bar/search-bar'
import TaskActions from './task.reducer'
import styles from './task-entity-screen-style'
import AlertMessage from '../../../shared/components/alert-message/alert-message'

// More info here: https://reactnative.dev/docs/flatlist.html

class TaskEntityScreen extends React.PureComponent {
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
    taskEntityEditScreen({ entityId: null })
  }
  componentDidAppear() {
    this.setState({ page: 0 }, () => {
      this.handleLoadMore()
    })
  }

  renderRow({ item }) {
    return (
      <TouchableOpacity onPress={taskEntityDetailScreen.bind(this, { entityId: item.id })}>
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
  renderEmpty = () => <AlertMessage title="No Tasks Found" show={!this.props.fetching} />

  keyExtractor = (item, index) => `${index}`

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

  cancelSearch = () => {
    this.setState({
      searchTerm: '',
    })
    this.fetchTasks()
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
  fetchTasks = () => {
    this.props.getAllTasks({ page: this.state.page - 1, sort: this.state.sort, size: this.state.size })
  }

  handleLoadMore = () => {
    if (this.props.tasks.length) {
      return
    }
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.fetchTasks()
      },
    )
  }

  render() {
    return (
      <View style={styles.container} testID="taskScreen">
        <FlatList
          contentContainerStyle={styles.listContent}
          data={this.props.tasks}
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
    tasks: state.tasks.tasks,
    fetching: state.tasks.fetchingAll,
    error: state.tasks.errorAll,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    performSearch: (query) => dispatch(TaskActions.taskSearchRequest(query)),
    getAllTasks: (options) => dispatch(TaskActions.taskAllRequest(options)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskEntityScreen)
