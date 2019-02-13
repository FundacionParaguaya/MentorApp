import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { addDraftProgress } from '../../redux/actions'
import StickyFooter from '../../components/StickyFooter'
import LifemapVisual from '../../components/LifemapVisual'
import Button from '../../components/Button'
import LifemapOverview from '../../components/LifemapOverview'
import BottomModal from '../../components/BottomModal'
import arrow from '../../../assets/images/selectArrow.png'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'

export class Overview extends Component {
  state = {
    filterModalIsOpen: false,
    selectedFilter: false,
    filterLabel: false,
    tipIsVisible: true
  }
  draftId = this.props.navigation.getParam('draftId')
  survey = this.props.navigation.getParam('survey')

  componentDidMount() {
    if (!this.props.navigation.getParam('resumeDraft')) {
      this.props.addDraftProgress(this.draftId, {
        screen: 'Overview'
      })
      this.props.navigation.setParams({
        onPressBack: this.onPressBack
      })
    }
  }

  onPressBack = () => {
    const draft = this.props.drafts.find(item => item.draftId === this.draftId)
    const skippedQuestions = draft.indicatorSurveyDataList.filter(
      question => question.value === 0
    )
    if (skippedQuestions.length > 0) {
      this.props.navigation.navigate('Skipped', {
        draftId: this.draftId,
        survey: this.survey
      })
    } else
      this.props.navigation.navigate('Question', {
        draftId: this.draftId,
        survey: this.survey,
        step: this.survey.surveyStoplightQuestions.length - 1
      })
  }

  navigateToScreen = (screen, indicator, indicatorText) =>
    this.props.navigation.navigate(screen, {
      draftId: this.draftId,
      survey: this.survey,
      indicator,
      indicatorText
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

  getPotentialPrioritiesCount(draft) {
    return draft.indicatorSurveyDataList.filter(
      question => question.value === 1 || question.value === 2
    ).length
  }

  getMandatoryPrioritiesCount(draft) {
    const potentialPrioritiesCount = this.getPotentialPrioritiesCount(draft)

    return potentialPrioritiesCount > this.survey.minimumPriorities
      ? this.survey.minimumPriorities
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
    const { filterModalIsOpen, selectedFilter, filterLabel } = this.state

    const draft = this.props.drafts.find(item => item.draftId === this.draftId)
    const mandatoryPrioritiesCount = this.getMandatoryPrioritiesCount(draft)
    const resumeDraft = this.props.navigation.getParam('resumeDraft')
    const tipIsVisible = !resumeDraft && this.state.tipIsVisible

    const getTipDescription = () => {
      //no mandatory priotities
      if (
        !mandatoryPrioritiesCount ||
        mandatoryPrioritiesCount - draft.priorities.length <= 0
      ) {
        return `${t('general.create')} ${t(
          'views.lifemap.priorities'
        ).toLowerCase()}!`
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
        visible={!resumeDraft}
        type={tipIsVisible ? 'tip' : 'button'}
        tipTitle={t('views.lifemap.toComplete')}
        onTipClose={this.onTipClose}
        tipDescription={getTipDescription()}
      >
        <View style={[globalStyles.background, styles.contentContainer]}>
          <View style={styles.indicatorsContainer}>
            <LifemapVisual
              large
              questions={draft.indicatorSurveyDataList}
              priorities={draft.priorities}
              achievements={draft.achievements}
              questionsLength={this.survey.surveyStoplightQuestions.length}
            />
            {resumeDraft ? (
              <Button
                id="resume-draft"
                style={{
                  marginTop: 20
                }}
                colored
                text={t('general.resumeDraft')}
                handleClick={() => {
                  this.props.navigation.replace(draft.progress.screen, {
                    draftId: this.draftId,
                    survey: this.survey,
                    step: draft.progress.step,
                    socioEconomics: draft.progress.socioEconomics
                  })
                }}
              />
            ) : null}
          </View>
          <View>
            <TouchableOpacity id="filters" onPress={this.toggleFilterModal}>
              <View style={styles.listTitle}>
                <Text style={globalStyles.subline}>
                  {filterLabel || t('views.lifemap.allIndicators')}
                </Text>
                <Image source={arrow} style={styles.arrow} />
              </View>
            </TouchableOpacity>
            <LifemapOverview
              surveyData={this.survey.surveyStoplightQuestions}
              draftData={draft}
              navigateToScreen={this.navigateToScreen}
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
              <TouchableOpacity
                id="all"
                style={styles.row}
                onPress={() => this.selectFilter(false)}
              >
                <View style={[styles.circle, { backgroundColor: '#EAD1AF' }]} />
                <Text>
                  {t('views.lifemap.allIndicators')} (
                  {draft.indicatorSurveyDataList.length})
                </Text>
              </TouchableOpacity>

              {/* Green */}
              <TouchableOpacity
                id="green"
                style={styles.row}
                onPress={() => this.selectFilter(3, t('views.lifemap.green'))}
              >
                <View
                  style={[styles.circle, { backgroundColor: colors.green }]}
                />
                <Text>
                  {t('views.lifemap.green')} (
                  {
                    draft.indicatorSurveyDataList.filter(
                      item => item.value === 3
                    ).length
                  }
                  )
                </Text>
              </TouchableOpacity>

              {/* Yellow */}
              <TouchableOpacity
                id="yellow"
                style={styles.row}
                onPress={() => this.selectFilter(2, t('views.lifemap.yellow'))}
              >
                <View
                  style={[styles.circle, { backgroundColor: colors.gold }]}
                />
                <Text>
                  {t('views.lifemap.yellow')} (
                  {
                    draft.indicatorSurveyDataList.filter(
                      item => item.value === 2
                    ).length
                  }
                  )
                </Text>
              </TouchableOpacity>

              {/* Red */}
              <TouchableOpacity
                id="red"
                style={styles.row}
                onPress={() => this.selectFilter(1, t('views.lifemap.red'))}
              >
                <View
                  style={[styles.circle, { backgroundColor: colors.red }]}
                />
                <Text>
                  {t('views.lifemap.red')} (
                  {
                    draft.indicatorSurveyDataList.filter(
                      item => item.value === 1
                    ).length
                  }
                  )
                </Text>
              </TouchableOpacity>

              {/* Priorities/achievements */}
              <TouchableOpacity
                id="priorities"
                style={styles.row}
                onPress={() =>
                  this.selectFilter(
                    'priorities',
                    `${t('views.lifemap.priorities')} & ${t(
                      'views.lifemap.achievements'
                    )}`
                  )
                }
              >
                <View
                  style={[styles.circle, { backgroundColor: colors.blue }]}
                />
                <Text>
                  {t('views.lifemap.priorities')} &{' '}
                  {t('views.lifemap.achievements')} (
                  {draft.priorities.length + draft.achievements.length})
                </Text>
              </TouchableOpacity>

              {/* Skipped */}
              <TouchableOpacity
                id="skipped"
                style={styles.row}
                onPress={() =>
                  this.selectFilter(0, t('views.skippedIndicators'))
                }
              >
                <View
                  style={[styles.circle, { backgroundColor: colors.palegrey }]}
                />
                <Text>
                  {t('views.skippedIndicators')} (
                  {
                    draft.indicatorSurveyDataList.filter(
                      item => item.value === 0
                    ).length
                  }
                  )
                </Text>
              </TouchableOpacity>
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
  indicatorsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 25
  },
  arrow: {
    marginLeft: 7,
    marginTop: 3,
    width: 10,
    height: 5
  },
  dropdown: {
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white
  },
  modalTitle: { color: colors.grey, fontWeight: '300', marginBottom: 25 },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginRight: 30
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23
  }
})

const mapDispatchToProps = {
  addDraftProgress
}

Overview.propTypes = {
  t: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Overview)
)
