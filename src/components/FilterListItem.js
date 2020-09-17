import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import {View, Text, StyleSheet} from 'react-native';

export default function FilterListItem(props) {
  const {dashboard} = props;
  return (
    <ListItem style={styles.row} onPress={props.onPress}>
      {dashboard ? null : (
        <View style={[styles.circle, {backgroundColor: props.color}]} />
      )}
      {/* the code below removes the "()" , the Text component can't have another Text component as a child*/}
      {dashboard ? (
        <Text>{props.text}</Text>
      ) : (
        <Text>
          {props.text} ({props.amount})
        </Text>
      )}
    </ListItem>
  );
}

FilterListItem.propTypes = {
  onPress: PropTypes.func,
  amount: PropTypes.number,
  text: PropTypes.string,
  color: PropTypes.string,
  dashboard: PropTypes.bool,
};

const styles = StyleSheet.create({
  circle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginRight: 30,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
