import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  InteractionManager
} from 'react-native'
import Image from './CachedImage'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import Icon from 'react-native-vector-icons/MaterialIcons'

const slideColors = {
  1: 'red',
  2: 'gold',
  3: 'green'
}

const isPortrait = () => {
  const dim = Dimensions.get('screen')
  return dim.height >= dim.width
}

const isTablet = () => {
  const msp = (dim, limit) => {
    return dim.scale * dim.width >= limit || dim.scale * dim.height >= limit
  }
  const dim = Dimensions.get('screen')
  return (dim.scale < 2 && msp(dim, 1000)) || (dim.scale >= 2 && msp(dim, 1900))
}

class Slider extends Component {
  state = {
    selectedColor: colors.green,
    isPortrait: true,
    isTablet: false
  }

  componentDidMount() {
    const width = Dimensions.get('screen').width
    const height = Dimensions.get('screen').height
    this.setState({
      isPortrait: isPortrait(),
      isTablet: isTablet(),
      width,
      height
    })
    Dimensions.addEventListener('change', this.dimensionChange)

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
    InteractionManager.runAfterInteractions(() => {
      this.scrollView.scrollTo({
        x: (width - (1 / 10) * width) * value(this.props.value),
        animated: true
      })
    })
  }

  componentWillUnmount() {
    // Important to stop updating state after unmount
    Dimensions.removeEventListener('change', this.dimensionChange)
  }

  dimensionChange = () => {
    this.setState({
      isPortrait: isPortrait(),
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height
    })
  }
  render() {
    const { isPortrait, isTablet, width, height } = this.state
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: isPortrait ? '280%' : '90%',
            flexGrow: 1,
            flexDirection: 'row',
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
            <View key={i} style={{ width: '33%' }}>
              <TouchableOpacity
                style={{
                  ...styles.slide,
                  backgroundColor: colors[slideColors[slide.value]],
                  height: isPortrait ? height / 1.8 : height / 1.35
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
                    height: isPortrait ? height / 3 : height / 4
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
    width: '100%',
    marginBottom: -40
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    padding: 15,
    paddingBottom: 25
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

export default Slider
