import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { Component } from 'react'

import BottomModal from '../../components/BottomModal'
import Button from '../../components/Button'
import FilterListItem from '../../components/FilterListItem'
import LifemapOverview from '../../components/LifemapOverview'
import LifemapVisual from '../../components/LifemapVisual'
import PropTypes from 'prop-types'
import StickyFooter from '../../components/StickyFooter'
import arrow from '../../../assets/images/selectArrow.png'
import colors from '../../theme.json'
import { connect } from 'react-redux'
import globalStyles from '../../globalStyles'
import { updateDraft } from '../../redux/actions'
import { withNamespaces } from 'react-i18next'

export class Overview extends Component {
  step = this.props.navigation.getParam('step')
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')
  familyLifemap = this.props.navigation.getParam('familyLifemap')
  isResumingDraft = this.props.navigation.getParam('resumeDraft')
  readOnly = this.props.navigation.getParam('readOnly') || false
  state = {
    filterModalIsOpen: false,
    selectedFilter: false,
    filterLabel: false,
    tipIsVisible: false
  }

  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  onPressBack = () => {
    const draft = !this.props.readOnly
      ? this.getDraft()
      : this.props.familyLifemap
    const survey = this.survey

    //If we do not arrive to this screen from the families screen
    if (!this.familyLifemap) {
      const skippedQuestions = draft.indicatorSurveyDataList.filter(
        question => question.value === 0
      )

      if (this.isResumingDraft) {
        this.props.navigation.navigate('Dashboard')
      } else if (skippedQuestions.length > 0) {
        this.props.navigation.navigate('Skipped', {
          draftId: draft.draftId,
          survey
        })
      } else
        this.props.navigation.navigate('Question', {
          step: this.survey.surveyStoplightQuestions.length - 1,
          draftId: this.draftId,
          survey
        })
    }
    // If we arrive to this screen from the families screen
    else
      this.props.navigation.navigate('Families', {
        draftId: this.draftId,
        survey
      })
  }

  navigateToScreen = (screen, indicator, indicatorText) =>
    this.props.navigation.navigate(screen, {
      survey: this.survey,
      indicator,
      indicatorText,
      draftId: this.draftId
    })

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

  onContinue = () => {
    this.navigateToScreen('Priorities')
  }

  resumeDraft = () => {
    const draft = !this.props.readOnly
      ? this.getDraft()
      : this.props.familyLifemap

    this.props.navigation.replace(draft.progress.screen, {
      draftId: this.draftId,
      survey: this.survey,
      step: draft.progress.step
    })
  }

  componentDidMount() {
    const draft = !this.props.readOnly
      ? this.getDraft()
      : this.props.familyLifemap

    this.props.navigation.setParams({
      onPressBack: this.onPressBack,
      withoutCloseButton: draft.draftId ? false : true
    })

    if (!this.isResumingDraft && !this.familyLifemap) {
      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'Overview'
        }
      })
    }
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  render() {
    const { t } = this.props
    const { filterModalIsOpen, selectedFilter, filterLabel } = this.state
    const draft = !this.props.readOnly
      ? this.getDraft()
      : this.props.familyLifemap
    return (
      <StickyFooter
        continueLabel={t('general.continue')}
        onContinue={() => this.onContinue()}
        visible={!this.isResumingDraft && !this.familyLifemap}
        progress={
          !this.isResumingDraft && !this.familyLifemap
            ? (draft.progress.total - 1) / draft.progress.total
            : 0
        }
      >
        {!this.props.readOnly ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={[globalStyles.h2Bold, styles.heading]}>
              {t('views.lifemap.congratulations')}
            </Text>
            <Text style={[globalStyles.h2Bold, styles.heading]}>
              {t('views.lifemap.youCreatedALifeMap')}
            </Text>
          </View>
        ) : null}
        <View style={[globalStyles.background, styles.contentContainer]}>
          <View style={styles.indicatorsContainer}>
            <LifemapVisual
              large={this.props.readOnly}
              extraLarge={!this.props.readOnly}
              questions={draft.indicatorSurveyDataList}
              priorities={draft.priorities}
              achievements={draft.achievements}
              questionsLength={this.survey.surveyStoplightQuestions.length}
            />
            {this.isResumingDraft ? (
              <Button
                id="resume-draft"
                style={{
                  marginTop: 20
                }}
                colored
                text={t('general.resumeDraft')}
                handleClick={this.resumeDraft}
              />
            ) : null}
          </View>
          {/*If we are in family/draft then show the questions.Else dont show them . This is requered for the families tab*/}
          {this.props.readOnly ? (
            <View>
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
                <LifemapOverview
                  id="lifeMapOverview"
                  surveyData={this.survey.surveyStoplightQuestions}
                  draftData={draft}
                  navigateToScreen={this.navigateToScreen}
                  draftOverview={!this.isResumingDraft && !this.familyLifemap}
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
                    onPress={() =>
                      this.selectFilter(3, t('views.lifemap.green'))
                    }
                    color={colors.palegreen}
                    text={t('views.lifemap.green')}
                    amount={
                      draft.indicatorSurveyDataList.filter(
                        item => item.value === 3
                      ).length
                    }
                  />

                  {/* Yellow */}
                  <FilterListItem
                    id="yellow"
                    onPress={() =>
                      this.selectFilter(2, t('views.lifemap.yellow'))
                    }
                    color={colors.gold}
                    text={t('views.lifemap.yellow')}
                    amount={
                      draft.indicatorSurveyDataList.filter(
                        item => item.value === 2
                      ).length
                    }
                  />

                  {/* Red */}
                  <FilterListItem
                    id="red"
                    onPress={() => this.selectFilter(1, t('views.lifemap.red'))}
                    color={colors.red}
                    text={t('views.lifemap.red')}
                    amount={
                      draft.indicatorSurveyDataList.filter(
                        item => item.value === 1
                      ).length
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
                      draft.indicatorSurveyDataList.filter(
                        item => item.value === 0
                      ).length
                    }
                  />
                </View>
              </BottomModal>
            </View>
          ) : null}
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
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white
  },
  modalTitle: {
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 15,
    marginLeft: 16
  }
})

Overview.propTypes = {
  drafts: PropTypes.array.isRequired,
  updateDraft: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  familyLifemap: PropTypes.object
}

const mapDispatchToProps = {
  updateDraft
}

const mapStateToProps = ({ drafts }) => ({ drafts })

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Overview)
)
