import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { loadFamilies } from '../redux/actions'
import { url } from '../config'
import colors from '../theme.json'
import globalStyles from '../globalStyles'

import SearchBar from '../components/SearchBar'
import FamiliesListItem from '../components/FamiliesListItem'

export class Families extends Component {
  componentDidMount() {
    if (this.props.offline.online) {
      this.props.loadFamilies(url[this.props.env], this.props.user.token)
    }
  }
  render() {
    const familiesToSync =
      this.props.offline.online &&
      this.props.offline.outbox.find(item => item.type === 'LOAD_FAMILIES')

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.container}
      >
        {familiesToSync ? (
          <ActivityIndicator
            size={30}
            color={colors.palered}
            style={styles.spinner}
          />
        ) : null}
        <SearchBar
          id="searchAddress"
          style={styles.search}
          placeholder={'Search by name or ID number'}
          onChangeText={() => {}}
          onSubmit={() => {}}
          value={''}
        />
        <FlatList
          data={this.props.families}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <FamiliesListItem handleClick={() => {}} family={item} />
          )}
        />
      </ScrollView>
    )
  }
}

Families.propTypes = {
  families: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  loadFamilies: PropTypes.func.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  offline: PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinner: {
    marginVertical: 5
  },
  search: { margin: 10 }
})

const mapStateToProps = ({ families, user, offline, env }) => ({
  families,
  user,
  offline,
  env
})

const mapDispatchToProps = {
  loadFamilies
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Families)
