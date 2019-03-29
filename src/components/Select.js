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

  componentDidMount() {
    // on mount validate empty required fields without showing an errors message
    if (this.props.required && !this.props.value) {
      this.props.detectError(true, this.props.field)
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
    const { errorMsg, isOpen } = this.state
    const {
      value,
      placeholder,
      required,
      options,
      countrySelect,
      readonly
    } = this.props
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
                accessibilityLabel={`${placeholder} ${ required && !readonly ? ' This is a mandatory field.' : ''}`}
              >{`${placeholder}${required && !readonly ? ' *' : ''}`}</Text>
            )}
            <Text
              style={[
                styles.placeholder,
                errorMsg ? { color: colors.red } : {}
              ]}
              accessibilityLabel={value ? text : `${placeholder}${required ? ' This is a mandatory field.' : ''}`}
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
  readonly: PropTypes.bool,
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
    borderBottomColor: colors.grey,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  placeholder: {
    paddingHorizontal: 15,
    ...globalStyles.subline
  },
  withoutValue: {
    backgroundColor: colors.primary
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
    borderBottomColor: colors.green
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
    marginBottom: 10,
    zIndex: 100
  }
})
