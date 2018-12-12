import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { setDimensions } from './redux/actions'
import App from './App'

export class ResponsiveApp extends Component {
  componentDidMount() {
    this.dimensionChange()
    Dimensions.addEventListener('change', this.dimensionChange)
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.dimensionChange)
  }
  dimensionChange = () => {
    this.props.setDimensions({
      height: Dimensions.get('screen').height,
      width: Dimensions.get('screen').width
    })
  }

  render() {
    return <App />
  }
}

const mapDispatchToProps = { setDimensions }

export default connect(
  null,
  mapDispatchToProps
)(ResponsiveApp)
