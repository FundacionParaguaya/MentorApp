import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import Button from './Button'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import i18n from '../i18n'

class Tip extends Component {
  render() {
    return (
      <View style={styles.tipview}>
        {this.props.tipHeading ? (
          <Text style={[globalStyles.h2, styles.heading]}>
            {this.props.title}
          </Text>
        ) : (
          <React.Fragment>
            <Text style={[globalStyles.h3, styles.text]}>
              {this.props.title}
            </Text>
            <Text style={[globalStyles.p, styles.text]}>
              {this.props.description}
            </Text>
          </React.Fragment>
        )}
        <View
          style={{
            height: 48
          }}
        >
          <Button
            text={i18n.t('general.gotIt')}
            icon="done"
            handleClick={() => this.props.onTipClose()}
          />
        </View>
      </View>
    )
  }
}

Tip.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onTipClose: PropTypes.func,
  tipHeading: PropTypes.bool
}

const styles = StyleSheet.create({
  tipview: {
    width: '100%',
    backgroundColor: colors.palegreen,
    padding: 25
  },
  text: {
    marginBottom: 16,
    color: colors.white,
    alignSelf: 'center'
  },
  heading: {
    marginBottom: 16,
    color: colors.white,
    alignSelf: 'center',
    textAlign: 'center'
  }
})

export default Tip
