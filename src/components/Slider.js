import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View } from 'react-native'
import SliderItem from './SliderItem'
import colors from '../theme.json'
import { connect } from 'react-redux'
import { isPortrait } from '../responsivenessHelpers'
const slideColors = {
  1: 'red',
  2: 'gold',
  3: 'green'
}

export class Slider extends Component {
  state = {
    selectedColor: colors.green
  }
  timer
  componentDidMount() {
    const { width } = this.props.dimensions

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
    if (value(this.props.value)) {
      this.timer = setTimeout(() => {
        if (this.scrollView) {
          this.scrollView.scrollTo({
            x: (width - (1 / 10) * width) * value(this.props.value),
            animated: true
          })
        }
      }, 1)
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const { dimensions } = this.props
    const { width } = this.props.dimensions
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
              <SliderItem
                slide={slide}
                onPress={() => {
                  this.props.selectAnswer(slide.value)
                  this.setState({
                    selectedColor: colors[slideColors[slide.value]]
                  })
                }}
                value={this.props.value}
              />
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
  selectAnswer: PropTypes.func.isRequired,
  dimensions: PropTypes.object
}

const mapStateToProps = ({ dimensions }) => ({
  dimensions
})

export default connect(mapStateToProps)(Slider)
