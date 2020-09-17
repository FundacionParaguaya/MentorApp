import React, {Component} from 'react';
import {Platform} from 'react-native';
import FullWidthImage from 'react-native-fullwidth-image';
import PropTypes from 'prop-types';
import RNFetchBlob from 'rn-fetch-blob';

let dirs = RNFetchBlob.fs.dirs;

function CachedImage(props) {
  const getProperSourceForOS = (source) => {
    return Platform.OS === 'android' ? 'file://' + source : '' + source;
  };
  const {style, source} = props;
  return (
    <FullWidthImage
      style={style}
      resizeMode="cover"
      ratio={1}
      source={{
        uri: getProperSourceForOS(
          `${dirs.DocumentDir}/${source.replace(/https?:\/\//, '')}`,
        ),
      }}
    />
  );
}

CachedImage.propTypes = {
  source: PropTypes.string,
  style: PropTypes.object,
};

export default CachedImage;
