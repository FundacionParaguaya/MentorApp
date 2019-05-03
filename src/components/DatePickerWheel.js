import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  TouchableHighlight,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import { WheelPicker } from '@delightfulstudio/react-native-wheel-picker-android'
import BottomModal from './BottomModal'
import arrow from '../../assets/images/selectArrow.png'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import i18n from '../i18n'

class DatePickerWheel extends Component {
  state = {
    isOpen: false,
    errorMsg: '',
    day: '',
    month: '',
    year: ''
  }

  componentDidMount() {
    // on mount validate empty required fields without showing an errors message
    if (this.props.required && !this.props.value) {
      this.props.detectError(true, this.props.field)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showErrors !== this.props.showErrors) {
      this.validateInput(this.props.value || '')
    }
  }

  toggleDropdown = () => {
    if (!this.props.readonly) {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
  }

  handleError(errorMsg) {
    this.props.detectError(true, this.props.field)
    this.props.onChange('', this.props.field)
    this.setState({
      errorMsg
    })
  }

  validateInput = value => {
    this.setState({
      isOpen: false
    })
    if (this.props.required && !value) {
      this.handleError(i18n.t('validation.fieldIsRequired'))
      this.setState({
        errorMsg: i18n.t('validation.fieldIsRequired')
      })
    } else {
      this.props.onChange(value, this.props.field)
      this.setState({
        errorMsg: null
      })
      this.props.field ? this.props.detectError(false, this.props.field) : ''
    }
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

  setDateText = date => {
    const dateFromValue = new Date(date)
    const year = dateFromValue.getFullYear()
    const month = this.props.months[dateFromValue.getMonth()].text
    const day = dateFromValue.getDate()
    return `${day} ${month} ${year}`
  }

  getSelectedDate = (days, years) => {
    const day = Object.keys(this.state.day).length
      ? this.state.day.data
      : days[0]
    const month = Object.keys(this.state.month).length
      ? this.props.months.find(m => m.text === this.state.month.data).value
      : this.props.months[0].value
    const year = Object.keys(this.state.year).length
      ? this.state.year.data
      : years[0]
    return `${day} ${month} ${year}`
  }

  render() {
    const { errorMsg, isOpen } = this.state
    const {
      days,
      months,
      years,
      value,
      placeholder,
      required,
      readonly
    } = this.props
    const wheelDays = days.map(day => day.value)
    const wheelMonths = months.map(month => month.text)
    const wheelYears = years.map(year => year.value)
    const text = value ? this.setDateText(value) : ''
    const daysWheelPosition =
      !!this.state.day && !!text ? this.state.day.position : 0
    const monthsWheelPosition =
      !!this.state.month && !!text ? this.state.month.position : 0
    const yearsWheelPosition =
      !!this.state.year && !!text ? this.state.year.position : 0

    return (
      <TouchableHighlight
        underlayColor={'transparent'}
        activeOpacity={1}
        onPress={this.toggleDropdown}
      >
        <View style={styles.wrapper}>
          <View
            style={[
              styles.container,
              !value && styles.withoutValue,
              errorMsg && styles.error,
              isOpen && styles.active
            ]}
          >
            {!!value && (
              <Text
                style={[
                  styles.title,
                  isOpen &&
                    !errorMsg && {
                      color: colors.green
                    }
                ]}
                accessibilityLabel={`${placeholder} ${
                  required && !readonly ? ' This is a mandatory field.' : ''
                }`}
              >{`${placeholder}${required && !readonly ? ' *' : ''}`}</Text>
            )}
            <Text
              style={[
                styles.placeholder,
                errorMsg ? { color: colors.red } : {}
              ]}
              accessibilityLabel={`${placeholder}${
                required ? ' This is a mandatory field.' : ''
              }`}
            >
              {value ? text : `${placeholder}${required ? ' *' : ''}`}
            </Text>
            {!readonly ? <Image source={arrow} style={styles.arrow} /> : null}

            <BottomModal
              isOpen={isOpen}
              onRequestClose={this.toggleDropdown}
              onEmptyClose={() => {
                this.validateInput('')
                this.toggleDropdown()
              }}
            >
              <View style={styles.dropdown}>
                <View style={{ marginTop: -25 }}>
                  <View style={styles.wheelPickerHeader}>
                    <TouchableOpacity
                      onPress={() => {
                        const date = this.getSelectedDate(wheelDays, wheelYears)
                        this.validateInput(date)
                      }}
                    >
                      <Text style={styles.confirm}>
                        {i18n.t('general.confirm')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.wheelsContainer}>
                    <WheelPicker
                      onItemSelected={this.setDay}
                      isCurved={true}
                      data={wheelDays}
                      visibleItemCount={6}
                      style={styles.wheelPicker}
                      selectedItemTextColor={colors.black}
                      isCyclic={true}
                      renderIndicator={true}
                      indicatorColor={colors.lightgrey}
                      indicatorSize={3}
                      selectedItemPosition={daysWheelPosition}
                    />
                    <WheelPicker
                      onItemSelected={this.setMonth}
                      isCurved={true}
                      data={wheelMonths}
                      visibleItemCount={6}
                      style={styles.wheelPicker}
                      selectedItemTextColor={colors.black}
                      isCyclic={true}
                      renderIndicator={true}
                      indicatorColor={colors.lightgrey}
                      indicatorSize={3}
                      selectedItemPosition={monthsWheelPosition}
                    />
                    <WheelPicker
                      onItemSelected={this.setYear}
                      isCurved={true}
                      data={wheelYears}
                      visibleItemCount={6}
                      style={styles.wheelPicker}
                      selectedItemTextColor={colors.black}
                      isCyclic={true}
                      renderIndicator={true}
                      indicatorColor={colors.lightgrey}
                      indicatorSize={3}
                      selectedItemPosition={yearsWheelPosition}
                    />
                  </View>
                </View>
              </View>
            </BottomModal>
          </View>
          {/* Error message */}
          {!!errorMsg && (
            <View style={{ marginLeft: 30 }}>
              <Text style={{ color: colors.red }}>{errorMsg}</Text>
            </View>
          )}
        </View>
      </TouchableHighlight>
    )
  }
}

DatePickerWheel.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  placeholder: PropTypes.string.isRequired,
  field: PropTypes.string,
  readonly: PropTypes.bool,
  showErrors: PropTypes.bool,
  required: PropTypes.bool,
  detectError: PropTypes.func,
  days: PropTypes.array.isRequired,
  months: PropTypes.array.isRequired,
  years: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15
  },
  container: {
    borderBottomWidth: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
    height: 65,
    paddingBottom: 6,
    borderBottomColor: colors.grey,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  placeholder: {
    paddingHorizontal: 15,
    ...globalStyles.subline,
    lineHeight: 50,
    height: 50,
  },
  withoutValue: {
    backgroundColor: colors.primary,
    height: 65
  },
  dropdown: {
    paddingVertical: 25,
    maxHeight: 360,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white
  },
  option: {
    paddingHorizontal: 25,
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 50,
    color: '#4a4a4a'
  },
  arrow: {
    width: 10,
    height: 5,
    position: 'absolute',
    right: 13,
    top: '50%'
  },
  active: {
    backgroundColor: colors.white,
    borderBottomColor: colors.green,
  },
  error: {
    backgroundColor: colors.white,
    borderBottomColor: colors.red
  },
  selected: {
    backgroundColor: colors.lightgrey
  },
  title: {
    paddingHorizontal: 15,
    fontSize: 14,
    color: colors.palegrey,
    // marginBottom: 10,
    zIndex: 100

  },
  wheelPicker: {
    width: '33%',
    height: 220
  },
  wheelPickerContainer: {
    width: 200,
    height: 220
  },
  wheelsContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  wheelPickerHeader: {
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 35
  },
  confirm: {
    color: colors.palegreen,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 17
  }
})

export default DatePickerWheel
