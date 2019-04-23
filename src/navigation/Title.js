import React from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, Platform } from 'react-native'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import colors from '../theme.json'

export class DynamicTitle extends React.Component {
  render() {
    return (
      <Text
        accessibilityLiveRegion="assertive"
        style={[styles.headerTitleStyle, this.props.style]}
      >
        {this.props.t(this.props.title)}
      </Text>
    )
  }
}

DynamicTitle.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
  lng: PropTypes.string,
  t: PropTypes.func
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,
    marginLeft: 20,
    color: colors.black
  }
})

const mapStateToProps = ({ lng }) => ({
  lng
})

export default withNamespaces()(connect(mapStateToProps)(DynamicTitle))
