import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import Image from './CachedImage'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'

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

export class Slider extends Component {
  state = {
    selectedColor: colors.green,
    isPortrait: true,
    isTablet: false
  }

  componentDidMount() {
    this.setState({
      isPortrait: isPortrait(),
      isTablet: isTablet()
    })
    Dimensions.addEventListener('change', this.dimensionChange)
  }
  componentWillUnmount() {
    // Important to stop updating state after unmount
    Dimensions.removeEventListener('change', this.dimensionChange)
  }

  dimensionChange = () => {
    this.setState({
      isPortrait: isPortrait()
    })
  }
  render() {
    console.log(this.props.dimensions)
    const { isPortrait, isTablet } = this.state
    const height = Dimensions.get('screen').height
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: isPortrait ? '200%' : '130%',
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
          ref={comp => {
            this._scrollView = comp
          }}
        >
          {this.props.slides.map((slide, i) => (
            <TouchableOpacity
              onPress={() => {
                this.props.selectAnswer(slide.value)
                this.setState({
                  selectedColor: colors[slideColors[slide.value]]
                })
              }}
              key={i}
              style={{
                ...styles.slide,
                backgroundColor: colors[slideColors[slide.value]]
              }}
            >
              <Image
                source={slide.url}
                style={{
                  ...styles.image,
                  height: isPortrait
                    ? isPortrait && isTablet
                      ? height / 3
                      : height / 4
                    : height / 2
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
          ))}
        </ScrollView>

        {this.props.value ? (
          <View style={styles.nav}>
            <View
              id="icon-view"
              style={{
                ...styles.iconBig,
                backgroundColor: colors[slideColors[this.props.value]]
              }}
            >
              <Icon name="done" size={56} color={colors.white} />
            </View>
          </View>
        ) : (
          <View />
        )}
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
    width: '32%'
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
    marginLeft: 32,
    marginRight: 32,
    borderColor: colors.white,
    borderWidth: 3
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -18
  }
})

const mapStateToProps = ({ dimensions }) => ({
  dimensions
})

export default connect()(Slider)
