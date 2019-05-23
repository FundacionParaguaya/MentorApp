import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  TouchableHighlight,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView
} from 'react-native'
import BottomModal from './BottomModal'
import ListItem from './ListItem'
import TextInput from './TextInput'
import countries from 'localized-countries'
import arrow from '../../assets/images/selectArrow.png'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import i18n from '../i18n'
import { connect } from 'react-redux'
const countryList = countries(require('localized-countries/data/en')).array()

class Select extends Component {
  state = {
    isOpen: false,
    errorMsg: '',
    showOther: false
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

  validateInput = (value, otherOption) => {
    this.setState({
      isOpen: false,
      showOther: otherOption
    })
    if (this.props.required && !value) {
      this.handleError(i18n.t('validation.fieldIsRequired'))
      this.setState({
        errorMsg: i18n.t('validation.fieldIsRequired')
      })
    } else {
      this.props.onChange(value, this.props.field, otherOption)
      this.setState({
        errorMsg: null
      })
      this.props.field ? this.props.detectError(false, this.props.field) : ''
    }
  }

  onChangeOther = value => {
    this.props.onChange(value, this.props.otherField)
  }

  componentDidMount() {
    // on mount validate empty required fields without showing an errors message
    if (this.props.required && !this.props.value) {
      this.props.detectError(true, this.props.field)
    }

    if (this.props.otherValue) {
      this.setState({
        showOther: true
      })
    }

    // save country to draft on mount
    setTimeout(() => {
      if (this.props.countrySelect) {
        this.props.onChange(this.props.value, this.props.field)
      }
    }, 1000)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showErrors !== this.props.showErrors) {
      this.validateInput(this.props.value || '')
    }
  }

  render() {
    const { errorMsg, isOpen, showOther } = this.state
    const {
      value,
      placeholder,
      required,
      options,
      countrySelect,
      readonly,
      otherValue,
      otherPlaceholder,
      countryOfBirth
    } = this.props
    const defaultCountry = this.props.country
      ? countryList.filter(item => item.code === this.props.country)[0]
      : ''

    let countries = countryList.filter(
      country => country.code !== defaultCountry.code
    )

    // Add default country to the beginning of the list
    let countriesArr = []

    countriesArr.push(defaultCountry)

    if (countryOfBirth) {
      countryOfBirth.forEach(e => {
        let addCountry = true
        let fixedObj = {
          code: '',
          lavel: ''
        }
        fixedObj.label = e.text
        fixedObj.code = e.value
        e.value
        countriesArr.forEach(elem => {
          if (elem.code === fixedObj.code) {
            addCountry = false
          }
        })
        if (addCountry) {
          countriesArr.unshift(fixedObj)
        }
      })
    }

    countriesArr.forEach(element => {
      countries = countries.filter(country => country.code !== element.code)
      countries.unshift(element)
    })
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

    console.log(countries)

    return (
      <View>
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
                        color: colors.palegreen
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
                  {countrySelect ? (
                    <ScrollView>
                      {countries.map(item => (
                        <ListItem
                          key={item.code}
                          onPress={() => this.validateInput(item.code)}
                        >
                          <Text
                            style={[
                              styles.option,
                              value === item.code && styles.selected
                            ]}
                            accessibilityLabel={`${item.label}`}
                          >
                            {item.label}
                          </Text>
                        </ListItem>
                      ))}
                    </ScrollView>
                  ) : (
                    <ScrollView>
                      {options.map(item => (
                        <ListItem
                          underlayColor={'transparent'}
                          activeOpacity={1}
                          key={item.value}
                          onPress={() =>
                            this.validateInput(item.value, item.otherOption)
                          }
                        >
                          <Text
                            style={[
                              styles.option,
                              value === item.value && styles.selected
                            ]}
                            accessibilityLabel={`${item.text}`}
                          >
                            {item.text}
                          </Text>
                        </ListItem>
                      ))}
                    </ScrollView>
                  )}
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
        {/* Other field */}
        {showOther && (
          <TextInput
            field="otherField"
            onChangeText={this.onChangeOther}
            readonly={readonly}
            placeholder={otherPlaceholder}
            value={otherValue}
          />
        )}
      </View>
    )
  }
}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  otherValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string.isRequired,
  otherPlaceholder: PropTypes.string,
  field: PropTypes.string,
  otherField: PropTypes.string,
  country: PropTypes.string,
  countrySelect: PropTypes.bool,
  readonly: PropTypes.bool,
  showErrors: PropTypes.bool,
  countryOfBirth: PropTypes.array,
  required: PropTypes.bool,
  nav: PropTypes.object.isRequired,
  detectError: PropTypes.func
}

const mapStateToProps = ({ nav }) => ({
  nav
})

export default connect(mapStateToProps)(Select)

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
    borderTopRightRadius: 8
  },
  placeholder: {
    paddingHorizontal: 15,
    ...globalStyles.subline,
    lineHeight: 50,
    height: 50
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
    borderBottomColor: colors.palegreen
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
  }
})
