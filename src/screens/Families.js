import React, { Component } from 'react'
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  UIManager,
  findNodeHandle
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { loadFamilies } from '../redux/actions'
import { url } from '../config'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import SearchBar from '../components/SearchBar'
import mapPlaceholderLarge from '../../assets/images/map_placeholder_1000.png'
import FamiliesListItem from '../components/FamiliesListItem'
import { replaceSpecialChars as sanitize } from '../utils'

export class Families extends Component {
  state = { search: '' }
  acessibleComponent = React.createRef()

  sortByName = families => families.sort((a, b) => a.name.localeCompare(b.name))

  handleClickOnFamily = family => {
    this.props.navigation.navigate('Family', {
      familyName: family.name,
      familyLifemap: family.snapshotList
        ? family.snapshotList[0]
        : family.draft,
      isDraft: !family.snapshotList,
      survey: this.props.surveys.find(survey =>
        family.snapshotList
          ? survey.id === family.snapshotList[0].surveyId
          : survey.id === family.draft.surveyId
      )
    })
  }

  fetchFamilies = () => {
    this.props.loadFamilies(url[this.props.env], this.props.user.token)
  }

  componentDidMount() {
    if (UIManager.AccessibilityEventTypes) {
      setTimeout(() => {
        UIManager.sendAccessibilityEvent(
          findNodeHandle(this.acessibleComponent.current),
          UIManager.AccessibilityEventTypes.typeViewFocused
        )
      }, 1)
    }
  }

  render() {
    const { t } = this.props
    // show not synced families from drafts
    const draftFamilies = this.props.drafts
      .filter(
        draft => draft.status === 'Draft' || draft.status === 'Pending sync'
      )
      .map(draft => {
        const primaryParticipant = draft.familyData.familyMembersList[0]
        return {
          name: `${primaryParticipant.firstName} ${primaryParticipant.lastName}`,
          birthDate: primaryParticipant.birthDate,
          draft
        }
      })

    const allFamilies = [...draftFamilies, ...sanitize(this.props.families)]

    const filteredFamilies = allFamilies.filter(
      family =>
        family.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
        (family.code && family.code.includes(this.state.search))
    )

    return (
      <View style={[globalStyles.background, styles.container]}>
        <View style={styles.imagePlaceholderContainer}>
          <View style={styles.searchContainer}>
            <SearchBar
              id="searchAddress"
              style={styles.search}
              placeholder={'Search by name'}
              onChangeText={search => this.setState({ search })}
              value={this.state.search}
            />
          </View>
          <Image
            style={styles.imagePlaceholderTop}
            source={mapPlaceholderLarge}
          />
        </View>

        <View style={styles.bar}>
          <Text style={{ ...globalStyles.subline, ...styles.familiesCount }}>
            {filteredFamilies.length} {t('views.families').toLowerCase()}
          </Text>
        </View>
        <View ref={this.acessibleComponent} accessible={true}>
          <FlatList
            refreshing={
              !!this.props.offline.online &&
              !!this.props.offline.outbox.find(
                item => item.type === 'LOAD_FAMILIES'
              )
            }
            onRefresh={this.fetchFamilies}
            data={this.sortByName(filteredFamilies)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <FamiliesListItem
                error={t('views.family.error')}
                lng={this.props.lng}
                handleClick={() => this.handleClickOnFamily(item)}
                family={item}
              />
            )}
            initialNumToRender={7}
          />
        </View>
      </View>
    )
  }
}

Families.propTypes = {
  families: PropTypes.array,
  surveys: PropTypes.array,
  drafts: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  loadFamilies: PropTypes.func.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  offline: PropTypes.object,
  t: PropTypes.func,
  lng: PropTypes.string
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  search: {
    width: '100%'
  },
  bar: {
    paddingLeft: 30,
    justifyContent: 'center',
    height: 48,
    backgroundColor: colors.primary
  },
  searchContainer: {
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: '46%',
    position: 'absolute',
    zIndex: 10
  },
  imagePlaceholderContainer: {
    position: 'relative',
    width: '100%',
    height: 139
  },

  imagePlaceholderTop: {
    width: '100%',
    height: 139
  },
  familiesCount: {
    fontWeight: '600'
  }
})

export const mapStateToProps = ({
  families,
  user,
  offline,
  env,
  surveys,
  drafts
}) => ({
  families,
  user,
  offline,
  env,
  surveys,
  drafts
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
