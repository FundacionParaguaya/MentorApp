import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { loadFamilies } from '../redux/actions'
import { url } from '../config'
import colors from '../theme.json'
import globalStyles from '../globalStyles'

import SearchBar from '../components/SearchBar'
import FamiliesListItem from '../components/FamiliesListItem'

export class Families extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Families')
    }
  }

  state = { search: '' }

  updateTitle = () =>
    this.props.navigation.setParams({
      title: this.props.t('views.families')
    })

  componentDidMount() {
    this.updateTitle()
    if (this.props.offline.online) {
      this.props.loadFamilies(url[this.props.env], this.props.user.token)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lng !== this.props.lng) {
      this.updateTitle()
    }
  }

  render() {
    const familiesToSync =
      this.props.offline.online &&
      this.props.offline.outbox.find(item => item.type === 'LOAD_FAMILIES')

    const filteredFamilies = this.props.families.filter(
      family =>
        family.name.includes(this.state.search) ||
        family.code.includes(this.state.search)
    )
    const { t } = this.props
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
          data={filteredFamilies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <FamiliesListItem
              error={t('views.family.error')}
              handleClick={() =>
                this.props.navigation.navigate('Family', {
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
  surveys: PropTypes.array,
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

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Families)
)
