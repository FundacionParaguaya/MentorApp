import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button'
import React, { Component } from 'react'

import BottomModal from '../BottomModal'
import ListItem from '../ListItem'
import PropTypes from 'prop-types'
import TextInput from './TextInput'
import arrow from '../../../assets/images/selectArrow.png'
import colors from '../../theme.json'
import countries from 'localized-countries'
import globalStyles from '../../globalStyles'
import i18n from '../../i18n'

const countryList = countries(require('localized-countries/data/en')).array()

class Select extends Component {
  state = {
    value: this.props.initialValue,
    radioOptions: [],
    isOpen: false,
    errorMsg: '',
    radioChecked: null,
    showOther: false,
    countries: []
  }

  toggleDropdown = () => {
    if (!this.props.readonly) {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
  }

  validateInput = (value, isOtherOption) => {
    this.setState({
      value: value,
      isOpen: false,
      showOther: isOtherOption
    })
    if (this.props.required && !value) {
      this.handleError(i18n.t('validation.fieldIsRequired'))
      this.setState({
        errorMsg: i18n.t('validation.fieldIsRequired')
      })
    } else {
      this.props.onChange(value, this.props.id, isOtherOption)
      this.setState({
        errorMsg: null
      })

      if (typeof this.props.setError === 'function' && this.props.id) {
        this.props.setError(false, this.props.id, this.props.memberIndex)
      }
    }
  }

  onChangeOther = otherValue => {
    this.setState({
      otherValue
    })
    this.props.onChange(otherValue, this.props.otherField)
  }

  validateInputRadio = value => {
    this.setState({
      isOpen: false,
      radioChecked: value
    })
    if (this.props.required && !value) {
      this.handleError(i18n.t('validation.fieldIsRequired'))
      this.setState({
        errorMsg: i18n.t('validation.fieldIsRequired')
      })
    } else {
      this.props.onChange(value, this.props.id)
      this.setState({
        errorMsg: null
      })

      if (typeof this.props.setError === 'function' && this.props.id) {
        this.props.setError(false, this.props.id, this.props.memberIndex)
      }
    }
  }

  handleError(errorMsg) {
    if (typeof this.props.setError === 'function') {
      this.props.setError(true, this.props.id, this.props.memberIndex)
    }
    this.props.onChange('', this.props.id)
    this.setState({
      errorMsg
    })
  }

  generateRadioOptions() {
    let radio_props = []

    this.props.options.forEach(e => {
      radio_props.push({ label: e.text, value: e.value })
    })

    this.setState({
      radioOptions: this.props.options.map(item => ({
        label: item.text,
        value: item.value
      }))
    })
  }

  generateCountriesList() {
    const { countriesOnTop, defaultCountry } = this.props

    let countriesArr = countryList.slice()

    const firstCountry = defaultCountry
      ? countryList.find(item => item.code === defaultCountry)
      : null

    // Add default country to the beginning of the list
    countriesArr.unshift(firstCountry)

    if (countriesOnTop) {
      countriesOnTop.forEach(e => {
        countriesArr.unshift({
          code: e.text,
          label: e.value
        })
      })
    }

    // Add prefer not to say answer at the end of the list
    countriesArr.push({ code: 'NONE', label: 'I prefer not to say' })

    this.setState({
      countries: [...new Set(countriesArr)]
    })
  }

  componentDidMount() {
    // generate countries list if this is a county select
    if (this.props.countrySelect) {
      this.generateCountriesList()
    }

    if (this.props.radio) {
      this.generateRadioOptions()
      this.setState({
        radioChecked: this.props.initialValue
      })
    }

    // on mount of new Select and if the passed showErrors value is true validate
    if (this.props.showErrors) {
      this.validateInput(this.props.initialValue || '')
    }
    // on mount validate empty required fields with out showing an errors message
    if (
      typeof this.props.setError === 'function' &&
      this.props.required &&
      !this.props.initialValue
    ) {
      this.props.setError(true, this.props.id, this.props.memberIndex)
    }

    if (this.props.initialOtherValue) {
      this.setState({
        showOther: true
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showErrors !== this.props.showErrors) {
      this.validateInput(this.props.initialValue || '')
    }
  }

  componentWillUnmount() {
    if (this.props.cleanErrorsOnUnmount) {
      this.props.cleanErrorsOnUnmount(this.props.id, this.props.memberIndex)
    }
  }

  render() {
    const {
      errorMsg,
      isOpen,
      showOther,
      radioOptions,
      value,
      countries
    } = this.state
    const {
      placeholder,
      required,
      options,
      countrySelect,
      readonly,
      initialOtherValue,
      otherPlaceholder
    } = this.props

    let text = ''
    if (countrySelect && countries.find(item => item.code === value)) {
      text = countries.find(item => item.code === value).label
    } else if (!countrySelect && options.find(item => item.value === value)) {
      text = options.find(item => item.value === value).text
    }

    return readonly && !this.props.initialValue ? null : (
      <View>
        <TouchableHighlight
          underlayColor={'transparent'}
          activeOpacity={1}
          onPress={this.toggleDropdown}
        >
          <View style={styles.wrapper}>
            {this.props.radio ? (
              <RadioForm formHorizontal={true} animation={false}>
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap'
                  }}
                >
                  {radioOptions.map((obj, i) => {
                    if (readonly) {
                      if (this.state.radioChecked === obj.value) {
                        return (
                          <View key={i} style={{ marginRight: 'auto' }}>
                            <View style={{ marginLeft: 12 }}>
                              <RadioButton labelHorizontal={true}>
                                <RadioButtonInput
                                  disabled={true}
                                  obj={obj}
                                  index={i}
                                  isSelected={
                                    this.state.radioChecked === obj.value
                                  }
                                  borderWidth={2}
                                  buttonInnerColor={colors.palegreen}
                                  buttonOuterColor={colors.palegrey}
                                  buttonSize={12}
                                  buttonOuterSize={20}
                                  buttonStyle={{}}
                                  onPress={() => {}}
                                />
                                <RadioButtonLabel
                                  onPress={() => {}}
                                  obj={obj}
                                  index={i}
                                  labelHorizontal={true}
                                  labelStyle={{
                                    fontSize: 17,
                                    color: '#4a4a4a'
                                  }}
                                  labelWrapStyle={{}}
                                />
                              </RadioButton>
                            </View>
                          </View>
                        )
                      }
                    } else {
                      return (
                        <RadioButton labelHorizontal={true} key={i}>
                          <RadioButtonInput
                            obj={obj}
                            index={i}
                            isSelected={this.state.radioChecked === obj.value}
                            onPress={this.validateInputRadio}
                            borderWidth={2}
                            buttonInnerColor={colors.palegreen}
                            buttonOuterColor={colors.palegrey}
                            buttonSize={12}
                            buttonOuterSize={20}
                            buttonStyle={{}}
                          />
                          <RadioButtonLabel
                            obj={obj}
                            index={i}
                            labelHorizontal={true}
                            onPress={this.validateInputRadio}
                            labelStyle={{ fontSize: 17, color: '#4a4a4a' }}
                            labelWrapStyle={{}}
                          />
                        </RadioButton>
                      )
                    }
                  })}
                </View>
              </RadioForm>
            ) : (
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
                {!readonly ? (
                  <Image source={arrow} style={styles.arrow} />
                ) : null}

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
                        <FlatList
                          style={styles.list}
                          data={countries}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
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
                          )}
                          initialNumToRender={6}
                        />
                      </ScrollView>
                    ) : (
                      <ScrollView>
                        <FlatList
                          style={styles.list}
                          data={options}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
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
                          )}
                          initialNumToRender={6}
                        />
                      </ScrollView>
                    )}
                  </View>
                </BottomModal>
              </View>
            )}

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
            id={this.props.otherField || 'otherField'}
            onChangeText={this.onChangeOther}
            readonly={readonly}
            placeholder={otherPlaceholder}
            initialValue={initialOtherValue}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20
  },
  container: {
    borderBottomWidth: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
    minHeight: 65,
    paddingBottom: 6,
    borderBottomColor: colors.grey,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.white
  },
  placeholder: {
    paddingLeft: 15,
    paddingRight: 25,
    ...globalStyles.subline,
    // lineHeight: 50,
    paddingTop: 20,
    minHeight: 50
  },
  withoutValue: {
    backgroundColor: colors.primary,
    minHeight: 65
  },
  dropdown: {
    paddingVertical: 15,
    maxHeight: 360,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white
  },
  option: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 25,
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

Select.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialOtherValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string.isRequired,
  otherPlaceholder: PropTypes.string,
  radio: PropTypes.bool,
  otherField: PropTypes.string,
  defaultCountry: PropTypes.string,
  countrySelect: PropTypes.bool,
  readonly: PropTypes.bool,
  showErrors: PropTypes.bool,
  countriesOnTop: PropTypes.array,
  required: PropTypes.bool,
  setError: PropTypes.func,
  memberIndex: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  cleanErrorsOnUnmount: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
}

export default Select
