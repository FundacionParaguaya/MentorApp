import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  InteractionManager
} from 'react-native'
import Image from './CachedImage'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'
import { isTablet, isPortrait } from '../responsivenessHelpers'
const slideColors = {
  1: 'red',
  2: 'gold',
  3: 'green'
}

export class Slider extends Component {
  state = {
    selectedColor: colors.green
  }

  componentDidMount() {
    const { width, height } = this.props.dimensions

    const value = value => {
      switch (value) {
        case 1:
          return 2
        case 2:
          return 1
        case 3:
          return 0
        default:
          return 0
      }
    }
    // Slider scrolls to the appropriate slide
    if (value !== 0) {
      InteractionManager.runAfterInteractions(() => {
        this.scrollView.scrollTo({
          x: (width - (1 / 10) * width) * value(this.props.value),
          animated: true
        })
      })
    }
  }

  render() {
    const { dimensions } = this.props
    const { width, height } = this.props.dimensions
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: isPortrait(dimensions) ? '280%' : '90%',
            flexGrow: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: '0.66%'
          }}
          ref={ref => {
            this.scrollView = ref
          }}
          snapToAlignment="center"
          snapToInterval={width - (1 / 10) * width}
        >
          {this.props.slides.map((slide, i) => (
            <View
              key={i}
              style={{
                width: '33%',
                backgroundColor: colors[slideColors[slide.value]]
              }}
            >
              <TouchableOpacity
                style={{
                  ...styles.slide
                }}
                onPress={() => {
                  this.props.selectAnswer(slide.value)
                  this.setState({
                    selectedColor: colors[slideColors[slide.value]]
                  })
                }}
              >
                <Image
                  source={slide.url}
                  style={{
                    ...styles.image,
                    height: isPortrait(dimensions)
                      ? isTablet(dimensions)
                        ? height / 2
                        : height / 3
                      : height / 4
                  }}
                />
                <Text
                  style={{
                    ...globalStyles.p,
                    ...styles.text,
                    color: slide.value === 'YELLOW' ? '#000' : colors.white
                  }}
                >
                  {slide.description}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          {this.props.slides.map((slide, i) => (
            <View style={{ width: '33%', marginTop: -40 }} key={i}>
              {this.props.value === slide.value ? (
                <View
                  id="icon-view"
                  style={{
                    ...styles.iconBig,
                    backgroundColor: colors[slideColors[this.props.value]]
                  }}
                >
                  <Icon name="done" size={56} color={colors.white} />
                </View>
              ) : (
                <View />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}

Slider.propTypes = {
  slides: PropTypes.array.isRequired,
  value: PropTypes.number,
  selectAnswer: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  slide: {
    width: '100%'
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    padding: 15,
    paddingBottom: 45
  },
  image: {
    width: '100%',
    marginTop: 15
  },
  iconBig: {
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.white,
    borderWidth: 3
  }
})

const mapStateToProps = ({ dimensions }) => ({
  dimensions
})

export default connect(mapStateToProps)(Slider)
