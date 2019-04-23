import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import SliderItem from './SliderItem'
import colors from '../theme.json'
import { connect } from 'react-redux'
import { isPortrait } from '../responsivenessHelpers'
import Carousel from 'react-native-snap-carousel'
const slideColors = {
  1: 'red',
  2: 'gold',
  3: 'green'
}

export class Slider extends Component {
  state = {
    selectedColor: colors.green,
    currentSlideIndex: false
  }

  getSelectedAnswer = value => {
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

  // isSlideActive = (slideIndex) => {
  //   const previouslySelectedSlide = this.props.value
  //     ? this.getSelectedAnswer(this.props.value)
  //     : 0
  //     return this.state.currentSlideIndex === this.getSelectedAnswer(slideIndex)
    // return !!this.state.currentSlideIndex 
    //   ? this.state.currentSlideIndex === this.getSelectedAnswer(slideIndex)
    //   : previouslySelectedSlide === this.getSelectedAnswer(slideIndex)
  // }

  renderSlide = ({ item, index }) => {
    console.log(index)
    return (
      <View
        key={index}
        style={[
          styles.slideWrapper,
          { ...styles.slideWrapperActive },
          { backgroundColor: colors[slideColors[item.value]] }
        ]}
      >
        <SliderItem
          slide={item}
          onPress={() => {
            this.props.selectAnswer(item.value)
            this.setState({
              selectedColor: colors[slideColors[item.value]]
            })
          }}
          value={this.props.value}
          bodyHeight={this.props.bodyHeight}
          dimensions={this.props.dimensions}
        />
      </View>
    )
  }
  render() {
    const { width } = this.props.dimensions
    const activeSlide = this.props.value
      ? this.getSelectedAnswer(this.props.value)
      : 0
    // console.log(this.state.currentSlideIndex)
    return (
      <View>
        <Carousel
          ref={c => {
            this._carousel = c
          }}
          data={this.props.slides}
          renderItem={this.renderSlide}
          sliderWidth={width}
          containerCustomStyle={{ overflow: 'visible' }}
          itemWidth={width - 60}
          loop={true}
          inactiveSlideOpacity={1}
          // inactiveSlideScale={.95}
          activeSlideAlignment={'center'}
          loopClonesPerSide={10}
          lockScrollWhileSnapping={true}
          enableSnap={true}
          firstItem={activeSlide}
          activeSlideOffset={100}
          // swipeThreshold={50}
          onSnapToItem={index => this.setState({ currentSlideIndex: index })}
        />
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

const styles = StyleSheet.create({
  slideWrapper: {
    borderRadius: 3,
    paddingTop: 10
  },
  slideWrapperActive: {
    paddingRight: 10,
    paddingLeft: 10
  }
})

const mapStateToProps = ({ dimensions }) => ({
  dimensions
})

export default connect(mapStateToProps)(Slider)
