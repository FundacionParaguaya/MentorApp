import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { View, StyleSheet, Text } from 'react-native'
import { withNamespaces } from 'react-i18next'
import colors from '../theme.json'
import DatePickerWheel from './DatePickerWheel'

export class DateInputComponent extends React.Component {
  state = {
    date: '',
    error: false
  }

  setDate = date => {
    this.setState({ date })
  }

  //Make array of the days
  days = Array.from({ length: 31 }, (v, i) => ({
    text: i + 1,
    value: i + 1
  }))

  //Make array of the years
  years = Array.from({ length: 101 }, (v, i) => {
    let d = new Date()
    let value = d.getFullYear() - 101 + i + 1
    return { text: value, value }
  }).reverse()

  validateDate() {
    const { date } = this.state

    const error = !moment(`${date}`, 'D MMMM YYYY', true).isValid()

    if (error) {
      this.props.detectError(true, this.props.field)
    } else {
      const unix = moment.utc(`${date}`, 'D MMMM YYYY').unix()
      this.props.detectError(false, this.props.field)
      this.props.onValidDate(unix, this.props.field)
    }
    this.setState({
      error
    })
  }

  componentDidMount() {
    // on mount validate empty required fields without showing an errors message
    if (this.props.required && !this.props.value) {
      this.props.detectError(true, this.props.field)
    }

    if (this.props.value) {
      this.setState({
        date: moment.unix(this.props.value).format('D MMMM YYYY')
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { date } = this.state

    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      if (date) {
        this.validateDate()
      }
      if (prevState.date) {
        this.validateDate()
      }
    }
    if (prevProps.showErrors !== this.props.showErrors) {
      this.validateDate()
    }
  }

  render() {
    const { t, readonly, required } = this.props
    const { date } = this.state
    const months = [
      { text: t('months.january'), value: 'January' },
      { text: t('months.february'), value: 'February' },
      { text: t('months.march'), value: 'March' },
      { text: t('months.april'), value: 'April' },
      { text: t('months.may'), value: 'May' },
      { text: t('months.june'), value: 'June' },
      { text: t('months.july'), value: 'July' },
      { text: t('months.august'), value: 'August' },
      { text: t('months.september'), value: 'September' },
      { text: t('months.october'), value: 'October' },
      { text: t('months.november'), value: 'November' },
      { text: t('months.december'), value: 'December' }
    ]

    return (
      <View>
        {readonly && (
          <Text
            style={[styles.text, { marginBottom: readonly ? -15 : 15 }]}
            accessibilityLabel={`${this.props.label} ${
              required && !readonly ? ' This is a mandatory field.' : ''
            }`}
          >
            {this.props.label} {required && !readonly ? '*' : ''}
          </Text>
        )}
        <View style={styles.container}>
          <View style={styles.date}>
            <DatePickerWheel
              onChange={date => this.setDate(date)}
              label={this.props.label}
              placeholder={
                readonly
                  ? ''
                  : `${this.props.label} ${required && !readonly ? '*' : ''}`
              }
              field=""
              readonly={readonly}
              value={date}
              days={this.days}
              months={months}
              years={this.years}
            />
          </View>
        </View>
        {this.state.error ? (
          <Text style={{ ...styles.text, color: colors.red }}>
            {t('views.family.selectValidDate')}
          </Text>
        ) : (
          <View />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  date: { width: '100%' },
  text: { marginLeft: 30 }
})

DateInputComponent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  t: PropTypes.func.isRequired,
  field: PropTypes.string,
  required: PropTypes.bool,
  showErrors: PropTypes.bool,
  readonly: PropTypes.bool,
  detectError: PropTypes.func,
  onValidDate: PropTypes.func
}

export default withNamespaces()(DateInputComponent)
