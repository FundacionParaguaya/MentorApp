import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, ScrollView } from 'react-native'
import SliderItem from './SliderItem'
import colors from '../theme.json'
import { connect } from 'react-redux'

const slideColors = {
  1: 'red',
  2: 'gold',
  3: 'palegreen'
}

export class Slider extends Component {
  _isMounted = false
  _timer

  state = {
    selectedColor: colors.palegreen
  }
  componentDidMount() {
    this._isMounted = true
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

    if (value(this.props.value)) {
      this._timer = setTimeout(() => {
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
    clearTimeout(this._timer)
    this._isMounted = false
  }

  render() {
    const { width } = this.props.dimensions
    return (
      <View style={!this.props.portrait ? { paddingHorizontal: 15 } : {}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: this.props.portrait ? '280%' : '90%',
            flexGrow: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly'
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
                width: '31%',
                backgroundColor: colors[slideColors[slide.value]],
                borderRadius: 3
              }}
            >
              <SliderItem
                slide={slide}
                onPress={() => {
                  this.props.selectAnswer(slide.value)
                  if (this._isMounted) {
                    this.setState({
                      selectedColor: colors[slideColors[slide.value]]
                    })
                  }
                }}
                value={this.props.value}
                bodyHeight={this.props.bodyHeight}
                dimensions={this.props.dimensions}
                portrait={this.props.portrait}
                tablet={this.props.tablet}
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
  dimensions: PropTypes.object,
  bodyHeight: PropTypes.number.isRequired,
  tablet: PropTypes.bool,
  portrait: PropTypes.bool
}

const mapStateToProps = ({ dimensions }) => ({
  dimensions
})

export default connect(mapStateToProps)(Slider)
