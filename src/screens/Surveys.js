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
import { updateNav } from '../redux/actions'
import globalStyles from '../globalStyles'
import RoundImage from '../components/RoundImage'
import LifemapListItem from '../components/LifemapListItem'
import Decoration from '../components/decoration/Decoration'
import colors from '../theme.json'

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

  handleClickOnSurvey = survey => {
    this.props.updateNav('survey', survey)
    this.props.navigation.navigate('Terms', {
      page: 'terms'
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
  updateNav: PropTypes.func.isRequired
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
