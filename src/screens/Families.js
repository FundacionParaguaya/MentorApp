import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  View,
  Text,
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
import FamiliesListItem from '../components/FamiliesListItem'

export class Families extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Families')
    }
  }

  state = { search: '' }
  acessibleComponent = React.createRef()

  updateTitle = () =>
    this.props.navigation.setParams({
      title: this.props.t('views.families')
    })

  componentDidMount() {
    if (UIManager.AccessibilityEventTypes) {
      setTimeout(() => {
        UIManager.sendAccessibilityEvent(
          findNodeHandle(this.acessibleComponent.current),
          UIManager.AccessibilityEventTypes.typeViewFocused
        )
      }, 1)
    }

    this.updateTitle()
    if (
      this.props.offline.online &&
      !this.props.offline.outbox.filter(item => item.type === 'LOAD_FAMILIES')
        .length
    ) {
      this.props.loadFamilies(url[this.props.env], this.props.user.token)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lng !== this.props.lng) {
      this.updateTitle()
    }
  }

  sortByName = families => families.sort((a, b) => a.name.localeCompare(b.name))

  render() {
    const { t } = this.props

    const familiesToSync =
      this.props.offline.online &&
      this.props.offline.outbox.find(item => item.type === 'LOAD_FAMILIES')

    // show not synced families from drafts
    const draftFamilies = this.props.drafts
      .filter(
        draft => draft.status === 'Draft' || draft.status === 'Pending sync'
      )
      .map(draft => {
        const primaryParticipant = draft.familyData.familyMembersList[0]
        return {
          name: `${primaryParticipant.firstName} ${
            primaryParticipant.lastName
          }`,
          birthDate: primaryParticipant.birthDate,
          draft
        }
      })

    const allFamilies = [...draftFamilies, ...this.props.families]

    const filteredFamilies = allFamilies.filter(
      family =>
        family.name.toLowerCase().includes(this.state.search.toLowerCase()) ||
        (family.code && family.code.includes(this.state.search))
    )

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.container}
      >
        <View ref={this.acessibleComponent} accessible={true}>
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
            placeholder={'Search by name'}
            onChangeText={search => this.setState({ search })}
            value={this.state.search}
          />
          <View style={styles.bar}>
            <Text style={{ ...globalStyles.subline, ...styles.familiesCount }}>
              {filteredFamilies.length} {t('views.families').toLowerCase()}
            </Text>
          </View>
          <FlatList
            data={this.sortByName(filteredFamilies)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <FamiliesListItem
                error={t('views.family.error')}
                lng={this.props.lng}
                handleClick={() =>
                  this.props.navigation.navigate('Family', {
                    familyName: item.name,
                    familyLifemap: item.snapshotList
                      ? item.snapshotList[0]
                      : item.draft,
                    isDraft: !item.snapshotList,
                    survey: this.props.surveys.find(survey =>
                      item.snapshotList
                        ? survey.id === item.snapshotList[0].surveyId
                        : survey.id === item.draft.surveyId
                    )
                  })
                }
                family={item}
              />
            )}
          />
        </View>
      </ScrollView>
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
  spinner: {
    marginVertical: 5
  },
  search: { margin: 10 },
  bar: {
    paddingLeft: 30,
    justifyContent: 'center',
    height: 48,
    backgroundColor: colors.primary
  },
  familiesCount: {
    fontWeight: '600'
  }
})

const mapStateToProps = ({
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
