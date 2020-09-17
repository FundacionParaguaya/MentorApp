import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';

const images = {
  family: require('../../assets/images/family.png'),
  surveys: require('../../assets/images/surveys.png'),
  stoplight: require('../../assets/images/stoplight.png'),
  partner: require('../../assets/images/partner.png'),
  check: require('../../assets/images/check.png'),
  lifemap: require('../../assets/images/lifemap.png'),
  picture: require('../../assets/images/takePicture.png'),
};

function RoundImage(props) {
  return <Image style={styles.image} source={images[props.source]} />;
}

RoundImage.propTypes = {
  source: PropTypes.oneOf([
    'family',
    'surveys',
    'stoplight',
    'partner',
    'check',
    'lifemap',
    'picture',
  ]),
};

const styles = StyleSheet.create({
  image: {
    width: 166,
    height: 166,
    alignSelf: 'center',
    marginBottom: 43,
  },
});

export default RoundImage;
