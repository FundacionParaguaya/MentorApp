import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight } from 'react-native'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Decoration from '../../components/decoration/Decoration'
import FilterListItem from '../../components/FilterListItem'
import LifemapOverview from '../../components/LifemapOverview'
import BottomModal from '../../components/BottomModal'
import arrow from '../../../assets/images/selectArrow.png'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
export class Priorities extends Component {
  survey = this.props.navigation.getParam('survey')
  familyLifemap = this.props.navigation.getParam('familyLifemap')
  state = {
    filterModalIsOpen: false,
    selectedFilter: false,
    filterLabel: false,
    tipIsVisible: false,
    draft:
      this.props.navigation.getParam('draft') ||
      this.props.navigation.getParam('familyLifemap') ||
      {}
  }

  isDraftResuming = this.props.navigation.getParam('resumeDraft')
  componentDidMount() {
    const { draft } = this.state
    this.props.navigation.setParams({
      getCurrentDraftState: () => draft
    })

    // show priorities message if no priorities are made or they are not enough
    if (
      !draft.priorities.length ||
      this.getMandatoryPrioritiesCount(draft) > draft.priorities.length
    ) {
      this.setState({
        tipIsVisible: true
      })
    }

    if (!this.isDraftResuming && !this.familyLifemap) {
      this.setState({
        draft: {
          ...draft,
          progress: {
            ...draft.progress,
            screen: 'Overview'
          }
        }
      })

      this.props.navigation.setParams({
        onPressBack: this.onPressBack,
        withoutCloseButton: draft.draftId ? false : true
      })
    }
  }

  onPressBack = () => {
    const { draft } = this.state
    this.props.navigation.push('Overview', {
      resumeDraft: false,
      draft,
      survey: this.survey
    })
  }

  updateDraftGlobal = draft => {
    this.setState({ draft: draft })
  }

  navigateToScreen = (screen, indicator, indicatorText) =>
    this.props.navigation.push(screen, {
      familyLifemap: this.state.draft,
      survey: this.survey,
      indicator,
      indicatorText,
      draft: this.state.draft
    })

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  toggleFilterModal = () => {
    this.setState({
      filterModalIsOpen: !this.state.filterModalIsOpen
    })
  }

  selectFilter = (filter, filterLabel = false) => {
    this.setState({
      selectedFilter: filter,
      filterModalIsOpen: false,
      filterLabel: filterLabel
    })
  }

  getPotentialPrioritiesCount() {
    const { draft } = this.state
    return (
      draft &&
      draft.indicatorSurveyDataList &&
      draft.indicatorSurveyDataList.filter(
        question => question.value === 1 || question.value === 2
      ).length
    )
  }

  getMandatoryPrioritiesCount() {
    const potentialPrioritiesCount = this.getPotentialPrioritiesCount() || 0
    const mimimumPriorities =
      (this.survey && this.survey.minimumPriorities) || 0

    return potentialPrioritiesCount > mimimumPriorities
      ? mimimumPriorities
      : potentialPrioritiesCount
  }

  onTipClose = () => {
    this.setState({
      tipIsVisible: false
    })
  }

  handleContinue = (mandatoryPrioritiesCount, draft) => {
    if (mandatoryPrioritiesCount > draft.priorities.length) {
      this.setState({
        tipIsVisible: true
      })
    } else {
      this.navigateToScreen('Final')
    }
  }

  render() {
    const { t } = this.props
    const { filterModalIsOpen, selectedFilter, filterLabel, draft } = this.state
    const mandatoryPrioritiesCount = this.getMandatoryPrioritiesCount(draft)
    const getTipDescription = () => {
      //no mandatory priotities
      if (
        !mandatoryPrioritiesCount ||
        mandatoryPrioritiesCount - draft.priorities.length <= 0
      ) {
        return t('views.lifemap.noPriorities')
        //only one mandatory priority
      } else if (mandatoryPrioritiesCount - draft.priorities.length === 1) {
        return t('views.lifemap.youNeedToAddPriotity')
      }
      //more than one mandatory priority
      else {
        return `${t('general.create')} ${mandatoryPrioritiesCount -
          draft.priorities.length} ${t(
          'views.lifemap.priorities'
        ).toLowerCase()}!`
      }
    }
    return (
      <StickyFooter
        continueLabel={t('general.continue')}
        handleClick={() => this.handleContinue(mandatoryPrioritiesCount, draft)}
        style={{ marginBottom: -20 }}
      >
        <View style={[globalStyles.background, styles.contentContainer]}>
          <Text style={[globalStyles.h2Bold, styles.heading]}>
            {t('views.lifemap.nowLetsMakeSomePriorities')}
          </Text>

          <Decoration variation="priorities">
            <View style={styles.iconContainer}>
              <View
                style={{
                  ...styles.blueIcon,
                  backgroundColor: colors.blue,
                  width: 180,
                  height: 180,
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ rotate: '25deg' }]
                }}
              >
                <Icon2 name="pin" color={colors.white} size={130} />
              </View>
            </View>
          </Decoration>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 38,
              paddingRight: 38
            }}
          >
            <Text style={[styles.infoPriorities, styles.heading2]}>
              {getTipDescription()}{' '}
            </Text>

            {/* Choose 5 indicators below and explain why they are important and
              what you will do to achive them! */}
          </View>
          <View>
            <TouchableHighlight
              id="filters"
              underlayColor={'transparent'}
              activeOpacity={1}
              onPress={this.toggleFilterModal}
            >
              <View style={styles.listTitle}>
                <Text style={globalStyles.subline}>
                  {filterLabel || t('views.lifemap.allIndicators')}
                </Text>
                <Image source={arrow} style={styles.arrow} />
              </View>
            </TouchableHighlight>
            {/* If we are in the draft then make the qustions clickable ,else dont make them clickable */}
            <LifemapOverview
              surveyData={this.survey.surveyStoplightQuestions}
              draftData={draft}
              updateDraftGlobal={this.updateDraftGlobal}
              navigateToScreen={this.navigateToScreen}
              draftOverview={draft.status === 'Draft' ? true : false}
              selectedFilter={selectedFilter}
            />
          </View>

          {/* Filters modal */}
          <BottomModal
            isOpen={filterModalIsOpen}
            onRequestClose={this.toggleFilterModal}
            onEmptyClose={() => this.selectFilter(false)}
          >
            <View style={styles.dropdown}>
              <Text style={[globalStyles.p, styles.modalTitle]}>
                {t('general.chooseView')}
              </Text>

              {/* All */}
              <FilterListItem
                id="all"
                onPress={() => this.selectFilter(false)}
                color={'#EAD1AF'}
                text={t('views.lifemap.allIndicators')}
                amount={draft.indicatorSurveyDataList.length}
              />

              {/* Green */}
              <FilterListItem
                id="green"
                onPress={() => this.selectFilter(3, t('views.lifemap.green'))}
                color={colors.palegreen}
                text={t('views.lifemap.green')}
                amount={
                  draft.indicatorSurveyDataList.filter(item => item.value === 3)
                    .length
                }
              />

              {/* Yellow */}
              <FilterListItem
                id="yellow"
                onPress={() => this.selectFilter(2, t('views.lifemap.yellow'))}
                color={colors.gold}
                text={t('views.lifemap.yellow')}
                amount={
                  draft.indicatorSurveyDataList.filter(item => item.value === 2)
                    .length
                }
              />

              {/* Red */}
              <FilterListItem
                id="red"
                onPress={() => this.selectFilter(1, t('views.lifemap.red'))}
                color={colors.red}
                text={t('views.lifemap.red')}
                amount={
                  draft.indicatorSurveyDataList.filter(item => item.value === 1)
                    .length
                }
              />

              {/* Priorities/achievements */}
              <FilterListItem
                id="priorities"
                onPress={() =>
                  this.selectFilter(
                    'priorities',
                    `${t('views.lifemap.priorities')} & ${t(
                      'views.lifemap.achievements'
                    )}`
                  )
                }
                color={colors.blue}
                text={`${t('views.lifemap.priorities')} & ${t(
                  'views.lifemap.achievements'
                )}`}
                amount={draft.priorities.length + draft.achievements.length}
              />

              {/* Skipped */}
              <FilterListItem
                id="skipped"
                onPress={() =>
                  this.selectFilter(0, t('views.skippedIndicators'))
                }
                color={colors.palegrey}
                text={t('views.skippedIndicators')}
                amount={
                  draft.indicatorSurveyDataList.filter(item => item.value === 0)
                    .length
                }
              />
            </View>
          </BottomModal>
        </View>
      </StickyFooter>
    )
  }
}
const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  listTitle: {
    backgroundColor: colors.primary,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  infoPriorities: {
    fontSize: 19
  },
  arrow: {
    marginLeft: 7,
    marginTop: 3,
    width: 10,
    height: 5
  },
  blueIcon: {
    borderRadius: 100,
    borderColor: colors.white,
    borderWidth: 1,
    zIndex: 10
  },
  dropdown: {
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  heading2: {
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  heading: {
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -10
  },
  modalTitle: {
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 15,
    marginLeft: 16
  }
})

Priorities.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

export default withNamespaces()(Priorities)
