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
  state = { search: '' }
  componentDidMount() {
    if (this.props.offline.online) {
      this.props.loadFamilies(url[this.props.env], this.props.user.token)
    }
  }
  render() {
    const familiesToSync =
      this.props.offline.online &&
      this.props.offline.outbox.find(item => item.type === 'LOAD_FAMILIES')

    const families = this.props.families.filter(
      family =>
        family.name.includes(this.state.search) ||
        family.code.includes(this.state.search)
    )

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
          onChangeText={search => this.setState({ search })}
          value={this.state.search}
        />
        <FlatList
          data={families}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <FamiliesListItem
              handleClick={() =>
                this.props.navigation.navigate('Overview', {
                  familyLifemap: item.snapshotList[0],
                  survey: this.props.surveys.find(
                    survey => survey.id === item.snapshotList[0].surveyId
                  )
                })
              }
              family={item}
            />
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

const mapStateToProps = ({ families, user, offline, env, surveys }) => ({
  families,
  user,
  offline,
  env,
  surveys
})

const mapDispatchToProps = {
  loadFamilies
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Families)
