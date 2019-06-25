import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  FlatList,
  UIManager,
  findNodeHandle
} from 'react-native'
import { connect } from 'react-redux'
import { updateNav } from '../redux/actions'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import globalStyles from '../globalStyles'
import RoundImage from '../components/RoundImage'
import LifemapListItem from '../components/LifemapListItem'
import Decoration from '../components/decoration/Decoration'
import colors from '../theme.json'
import { CONDITION_TYPES } from './utils/conditional_logic'

export class Surveys extends Component {
  acessibleComponent = React.createRef()

  componentDidMount() {
    // this.props.navigation.popToTop()
    if (UIManager.AccessibilityEventTypes) {
      setTimeout(() => {
        UIManager.sendAccessibilityEvent(
          findNodeHandle(this.acessibleComponent.current),
          UIManager.AccessibilityEventTypes.typeViewFocused
        )
      }, 1)
    }
  }

  getEconomicScreens(survey) {
    this.currentDimension = ''
    const questionsPerScreen = []
    let totalScreens = 0

    // go trough all questions and separate them by screen
    survey.surveyEconomicQuestions.forEach(question => {
      // if the dimention of the questions change, change the page
      if (question.topic !== this.currentDimension) {
        this.currentDimension = question.topic
        totalScreens += 1
      }

      // if there is object for n screen create one
      if (!questionsPerScreen[totalScreens - 1]) {
        questionsPerScreen[totalScreens - 1] = {
          forFamilyMember: [],
          forFamily: []
        }
      }

      if (question.forFamilyMember) {
        questionsPerScreen[totalScreens - 1].forFamilyMember.push(question)
      } else {
        questionsPerScreen[totalScreens - 1].forFamily.push(question)
      }
    })

    return {
      questionsPerScreen
    }
  }

  getConditionalQuestions = survey => {
    const surveyEconomicQuestions = survey.surveyEconomicQuestions || []
    const conditionalQuestions = []
    surveyEconomicQuestions.forEach(eq => {
      if (
        (eq.conditions && eq.conditions.length > 0) ||
        (eq.conditionGroups && eq.conditionGroups.length > 0)
      ) {
        conditionalQuestions.push(eq)
      } else {
        // Checking conditional options only if needed
        const options = eq.options || []
        for (const option of options) {
          if (option.conditions && option.conditions.length > 0) {
            conditionalQuestions.push(eq)
            return
          }
        }
      }
    })
    return conditionalQuestions
  }

  getElementsWithConditionsOnThem = conditionalQuestions => {
    const questionsWithConditionsOnThem = []
    const memberKeysWithConditionsOnThem = []

    const addTargetIfApplies = condition => {
      // Addind this so it works after changing the key to scope
      const scope = condition.scope || condition.type
      if (
        scope !== CONDITION_TYPES.FAMILY &&
        !questionsWithConditionsOnThem.includes(condition.codeName)
      ) {
        questionsWithConditionsOnThem.push(condition.codeName)
      }
      if (
        scope === CONDITION_TYPES.FAMILY &&
        !memberKeysWithConditionsOnThem.includes(condition.codeName)
      ) {
        memberKeysWithConditionsOnThem.push(condition.codeName)
      }
    }

    conditionalQuestions.forEach(conditionalQuestion => {
      let conditions = []
      const { conditionGroups } = conditionalQuestion
      if (conditionGroups && conditionGroups.length > 0) {
        conditionGroups.forEach(conditionGroup => {
          conditions = [...conditions, ...conditionGroup.conditions]
        })
      } else {
        ;({ conditions = [] } = conditionalQuestion)
      }

      conditions.forEach(addTargetIfApplies)

      // Checking conditional options only if needed
      const options = conditionalQuestion.options || []
      options.forEach(option => {
        const { conditions: optionConditions = [] } = option
        optionConditions.forEach(addTargetIfApplies)
      })
    })
    return { questionsWithConditionsOnThem, memberKeysWithConditionsOnThem }
  }

  handleClickOnSurvey = survey => {
    // const economicScreens = this.getEconomicScreens(survey)
    const conditionalQuestions = this.getConditionalQuestions(survey)
    const elementsWithConditionsOnThem = this.getElementsWithConditionsOnThem(
      conditionalQuestions
    )

    this.props.updateNav({
      conditionalQuestions,
      elementsWithConditionsOnThem
    })

    this.props.navigation.navigate('Terms', {
      page: 'terms',
      survey
    })
  }

  render() {
    return (
      <ScrollView
        ref={this.acessibleComponent}
        accessible={true}
        style={{ ...globalStyles.container, padding: 0 }}
      >
        <Decoration variation="lifemap">
          <RoundImage source="surveys" />
        </Decoration>
        <FlatList
          style={styles.list}
          data={this.props.surveys}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <LifemapListItem
              name={item.title}
              handleClick={() => this.handleClickOnSurvey(item)}
            />
          )}
          initialNumToRender={5}
        />
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  list: {
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1,
    paddingBottom: 60
  }
})

Surveys.propTypes = {
  surveys: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  lng: PropTypes.string,
  t: PropTypes.func,
  updateNav: PropTypes.func
}

const mapStateToProps = ({ surveys }) => ({
  surveys
})

const mapDispatchToProps = {
  updateNav
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Surveys)
)
