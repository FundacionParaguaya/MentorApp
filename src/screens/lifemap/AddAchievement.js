import React, { Component } from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Divider } from 'react-native-elements'

import { addSurveyPriorityAcheivementData } from '../../redux/actions'

import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'

export class AddAchievement extends Component {
  state = {
    action: '',
    roadmap: '',
    indicator: this.props.navigation.getParam('indicator')
  }
  componentDidMount() {
    const draft = this.getDraft()
    const achievement = this.getAchievementValue(draft)

    this.setState(achievement)
  }

  getDraft = () =>
    this.props.drafts.filter(
      draft => draft.draftId === this.props.navigation.getParam('draftId')
    )[0]

  addAchievement = () =>
    this.props.addSurveyPriorityAcheivementData({
      id: this.props.navigation.getParam('draftId'),
      category: 'achievements',
      payload: this.state
    })

  getAchievementValue = draft => {
    const achievement = draft.achievements.filter(
      achievement =>
        achievement.indicator === this.props.navigation.getParam('indicator')
    )
    return achievement[0] ? achievement[0] : {}
  }

  render() {
    const draft = this.getDraft()
    const achievement = this.getAchievementValue(draft)

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={globalStyles.container}>
          <Text style={globalStyles.h2}>
            {this.props.navigation.getParam('indicatorText')}
          </Text>
          <Divider
            style={{ backgroundColor: colors.palegrey, marginVertical: 10 }}
          />
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <Icon
              name="stars"
              color={colors.blue}
              size={17}
              style={{ marginRight: 10, marginLeft: -10 }}
            />
            <Text style={globalStyles.h3}>Achievement</Text>
          </View>
          <TextInput
            field=""
            onChangeText={text => this.setState({ action: text })}
            placeholder={this.state.action ? '' : 'Write your answer here...'}
            label="How did you get it?"
            value={achievement ? achievement.action : ''}
            multiline
          />
          <TextInput
            label="What did it take to achieve this?"
            onChangeText={text => this.setState({ roadmap: text })}
            placeholder={this.state.roadmap ? '' : 'Write your answer here...'}
            value={achievement ? achievement.roadmap : ''}
            multiline
          />
        </View>
        <View style={{ height: 50 }}>
          <Button
            colored
            text="Save"
            handleClick={() => this.addAchievement()}
          />
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})

AddAchievement.propTypes = {
  navigation: PropTypes.object.isRequired,
  addSurveyPriorityAcheivementData: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired
}

const mapDispatchToProps = {
  addSurveyPriorityAcheivementData
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAchievement)
