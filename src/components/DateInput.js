import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { View, StyleSheet, Text } from 'react-native'
import { withNamespaces } from 'react-i18next'
import colors from '../theme.json'
import TextInput from './TextInput'
import Select from './Select'

export class DateInput extends React.Component {
  state = {
    day: '',
    month: '',
    year: '',
    error: false
  }

  setDay = day => {
    this.setState({ day })
  }

  setMonth = month => {
    this.setState({ month })
  }

  setYear = year => {
    this.setState({ year })
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
    const { day, month, year } = this.state

    const error = !moment(
      `${year} ${month} ${day}`,
      'YYYY MMMM D',
      true
    ).isValid()

    if (error) {
      this.props.detectError(true, this.props.field)
    } else {
      const unix = moment.utc(`${year} ${month} ${day}`, 'YYYY MMMM D').unix()
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
        day: moment.unix(this.props.value).format('D'),
        month: moment.unix(this.props.value).format('MMMM'),
        year: moment.unix(this.props.value).format('YYYY')
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { day, month, year } = this.state

    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      if (day && month && year) {
        this.validateDate()
      }
      if (prevState.day && prevState.month && prevState.year) {
        this.validateDate()
      }
    }
    if (prevProps.showErrors !== this.props.showErrors) {
      this.validateDate()
    }
  }

  render() {
    const { t, value } = this.props
    const { day, month, year } = this.state
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
        <Text style={styles.text}>{this.props.label}</Text>
        <View style={styles.container}>
          <View style={styles.month}>
            <Select
              onChange={month => this.setMonth(month)}
              label={t('general.month')}
              placeholder={t('views.family.selectMonth')}
              field=""
              value={month}
              options={months}
            />
          </View>
          <View style={styles.day}>
            <Select
              onChange={day => this.setDay(day)}
              placeholder={t('general.day')}
              placeholder={t('general.day')}
              field=""
              value={Number(day)}
              options={this.days}
            />
          </View>
          <View style={styles.year}>
            <Select
              onChange={year => this.setYear(year)}
              placeholder={t('general.year')}
              placeholder={t('general.year')}
              field=""
              value={Number(year)}
              options={this.years}
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
  day: {
    width: '25%',
    marginLeft: '-3%'
  },
  year: { width: '36%', marginLeft: '-3%' },
  month: { width: '45%' },
  text: { marginLeft: 30, marginBottom: 15 }
})

DateInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  t: PropTypes.func.isRequired,
  field: PropTypes.string,
  required: PropTypes.bool,
  showErrors: PropTypes.bool,
  detectError: PropTypes.func,
  onValidDate: PropTypes.func
}

export default withNamespaces()(DateInput)
