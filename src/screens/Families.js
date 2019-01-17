import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { loadFamilies } from '../redux/actions'
import { url } from '../config'
import colors from '../theme.json'
import globalStyles from '../globalStyles'

import SearchBar from '../components/SearchBar'

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
        {this.props.families.map(family => (
          <View key={family.familyId}>
            <Button
              title={family.name}
              onPress={() =>
                this.props.navigation.navigate('Family', {
                  family: family.familyId
                })
              }
            />
          </View>
        ))}
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
