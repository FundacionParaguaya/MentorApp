import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { loadFamilies } from '../redux/actions'
import { url } from '../config'
import colors from '../theme.json'

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
      <ScrollView style={styles.container}>
        {familiesToSync ? (
          <ActivityIndicator
            size={30}
            color={colors.palered}
            style={styles.spinner}
          />
        ) : null}
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
  sync: PropTypes.object.isRequired,
  offline: PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinner: {
    marginVertical: 5
  }
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
