import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  FlatList,
  UIManager,
  findNodeHandle
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import globalStyles from '../globalStyles'
import RoundImage from '../components/RoundImage'
import LifemapListItem from '../components/LifemapListItem'
import Decoration from '../components/decoration/Decoration'
import colors from '../theme.json'

export class Surveys extends Component {
  acessibleComponent = React.createRef()

  componentDidMount() {
    // focuses component on render for device to begin talking
    if (UIManager.AccessibilityEventTypes) {
      setTimeout(() => {
        UIManager.sendAccessibilityEvent(
          findNodeHandle(this.acessibleComponent.current),
          UIManager.AccessibilityEventTypes.typeViewFocused
        )
      }, 1)
    }
  }

  handleClickOnSurvey = survey => {
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
  t: PropTypes.func
}

const mapStateToProps = ({ surveys }) => ({
  surveys
})

const mapDispatchToProps = {}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Surveys)
)
