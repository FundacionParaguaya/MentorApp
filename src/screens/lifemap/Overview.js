import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableHighlight } from 'react-native'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import LifemapVisual from '../../components/LifemapVisual'
import Button from '../../components/Button'
import FilterListItem from '../../components/FilterListItem'
import LifemapOverview from '../../components/LifemapOverview'
import BottomModal from '../../components/BottomModal'
import arrow from '../../../assets/images/selectArrow.png'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
export class Overview extends Component {
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
    const survey = this.survey

    //If we do not arrive to this screen from the families screen
    if (!this.familyLifemap) {
      const skippedQuestions = this.state.draft.indicatorSurveyDataList.filter(
        question => question.value === 0
      )

      // If there are no skipped questions
      if (skippedQuestions.length > 0) {
        this.props.navigation.push('Skipped', { draft, survey })
      } else
        this.props.navigation.push('Question', {
          step: this.survey.surveyStoplightQuestions.length - 1,
          draft,
          survey
        })
    }
    // If we arrive to this screen from the families screen
    else this.props.navigation.navigate('Families', { draft, survey })
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

  handleContinue = () => {
    this.navigateToScreen('Priorities')
  }

  resumeDraft = () => {
    const { draft } = this.state

    this.props.navigation.replace(draft.progress.screen, {
      draft,
      survey: this.survey,
      step: draft.progress.step
    })
  }

  render() {
    const { t } = this.props
    const { filterModalIsOpen, selectedFilter, filterLabel, draft } = this.state

    return (
      <StickyFooter
        continueLabel={t('general.continue')}
        handleClick={() => this.handleContinue()}
        visible={!this.isDraftResuming && !this.familyLifemap}
        progress={
          !this.isDraftResuming && !this.familyLifemap
            ? (draft.progress.total - 1) / draft.progress.total
            : 0
        }
      >
        {this.state.draft.status === 'Draft' ? (
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
              large={this.state.draft.status !== 'Draft'}
              extraLarge={this.state.draft.status === 'Draft'}
              questions={draft.indicatorSurveyDataList}
              priorities={draft.priorities}
              achievements={draft.achievements}
              questionsLength={this.survey.surveyStoplightQuestions.length}
            />
            {this.isDraftResuming ? (
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
          {this.state.draft.status !== 'Draft' ? (
            <React.Fragment>
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
                  surveyData={this.survey.surveyStoplightQuestions}
                  draftData={draft}
                  navigateToScreen={this.navigateToScreen}
                  draftOverview={!this.isDraftResuming && !this.familyLifemap}
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
            </React.Fragment>
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
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

export default withNamespaces()(Overview)
