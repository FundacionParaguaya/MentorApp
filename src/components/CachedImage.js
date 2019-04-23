import React, { Component } from 'react'
import { Image, Platform } from 'react-native'
import PropTypes from 'prop-types'
import RNFetchBlob from 'rn-fetch-blob'

let dirs = RNFetchBlob.fs.dirs

export class CachedImage extends Component {
  getProperSourceForOS(source) {
    return Platform.OS === 'android' ? 'file://' + source : '' + source
  }

  render() {
    const { style, source } = this.props

    return (
      <Image
        style={style}
        source={{
          uri: this.getProperSourceForOS(
            `${dirs.DocumentDir}/${source.replace(/https?:\/\//, '')}`
          )
        }}
      />
    )
  }
}

CachedImage.propTypes = {
  source: PropTypes.string,
  style: PropTypes.object
}

export default CachedImage
