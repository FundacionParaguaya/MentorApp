import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  ScrollView
} from 'react-native'
import countries from 'localized-countries'
import arrow from '../../assets/images/selectArrow.png'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import i18n from '../i18n'

const countryList = countries(require('localized-countries/data/en')).array()

class Select extends Component {
  state = {
    isOpen: false,
    errorMsg: ''
  }

  toggleDropdown = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
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

  render() {
    const { errorMsg, isOpen } = this.state
    const { value, placeholder, required, options, countrySelect } = this.props
    const defaultCountry = this.props.country
      ? countryList.filter(item => item.code === this.props.country)[0]
      : ''

    let countries = countryList.filter(
      country => country.code !== defaultCountry.code
    )
    // Add default country to the beginning of the list
    countries.unshift(defaultCountry)
    // Add prefer not to say answer at the end of the list
    countries.push({ code: 'NONE', label: 'I prefer not to say' })

    let text
    if (countrySelect && countries.filter(item => item.code === value)[0]) {
      text = countries.filter(item => item.code === value)[0].label
    } else if (
      !countrySelect &&
      options.filter(item => item.value === value)[0]
    ) {
      text = options.filter(item => item.value === value)[0].text
    } else {
      text = ''
    }

    return (
      <TouchableOpacity onPress={this.toggleDropdown}>
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
              >{`${placeholder}${required ? ' *' : ''}`}</Text>
            )}
            <Text
              style={[
                styles.placeholder,
                errorMsg ? { color: colors.red } : {}
              ]}
            >
              {value ? text : `${placeholder}${required ? ' *' : ''}`}
            </Text>
            <Image source={arrow} style={styles.arrow} />

            <Modal
              transparent={true}
              visible={isOpen}
              onRequestClose={this.toggleDropdown}
            >
              <TouchableOpacity
                style={[
                  styles.overlay,
                  {
                    backgroundColor: 'rgba(47,38,28, 0.2)'
                  }
                ]}
                onPress={this.toggleDropdown}
              />
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isOpen}
              onRequestClose={this.toggleDropdown}
            >
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => {
                  this.validateInput('')
                  this.toggleDropdown()
                }}
              />
              <View style={styles.dropdown}>
                {countrySelect ? (
                  <ScrollView>
                    {countries.map((item, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => this.validateInput(item.code)}
                      >
                        <Text
                          style={[
                            styles.option,
                            value === item.code && styles.selected
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <ScrollView>
                    {options.map(item => (
                      <TouchableOpacity
                        key={item.value}
                        onPress={() => this.validateInput(item.value)}
                      >
                        <Text
                          style={[
                            styles.option,
                            value === item.value && styles.selected
                          ]}
                        >
                          {item.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </Modal>
          </View>
          {/* Error message */}
          {!!errorMsg && (
            <Text style={{ paddingHorizontal: 15, color: colors.red }}>
              {errorMsg}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  placeholder: PropTypes.string.isRequired,
  field: PropTypes.string,
  country: PropTypes.string,
  countrySelect: PropTypes.bool,
  showErrors: PropTypes.bool,
  required: PropTypes.bool,
  detectError: PropTypes.func
}

export default Select

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15
  },
  container: {
    borderBottomWidth: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
    minHeight: 60,
    paddingBottom: 6,
    borderBottomColor: colors.grey
  },
  placeholder: {
    paddingHorizontal: 15,
    ...globalStyles.subline
  },
  withoutValue: {
    backgroundColor: colors.beige
  },
  dropdown: {
    paddingVertical: 25,
    maxHeight: 360,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.palebeige
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
    borderBottomColor: colors.green
  },
  error: {
    backgroundColor: colors.white,
    borderBottomColor: colors.red
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selected: {
    backgroundColor: colors.lightgrey
  },
  title: {
    paddingHorizontal: 15,
    fontSize: 14,
    color: colors.palegrey,
    marginBottom: 10,
    zIndex: 100
  }
})
