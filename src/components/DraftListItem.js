import 'moment/locale/es';
import 'moment/locale/pt';

import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import globalStyles from '../globalStyles';
import i18n from '../i18n';
import colors from '../theme.json';
import ListItem from './ListItem';

moment.locale('en');

function DraftListItem(props) {
  const getColor = (status) => {
    switch (status) {
      case 'Draft':
        return colors.palegold;
      case 'Synced':
        return colors.lightgrey;
      case 'Pending sync':
        return colors.palered;
      case 'Sync error':
        return colors.error;
      default:
        return colors.palegrey;
    }
  };
  const setStatusTitle = (status) => {
    switch (status) {
      case 'Draft':
        return i18n.t('draftStatus.draft');
      case 'Synced':
        return i18n.t('draftStatus.completed');
      case 'Pending sync':
        return i18n.t('draftStatus.syncPending');
      case 'Sync error':
        return i18n.t('draftStatus.syncError');
      default:
        return '';
    }
  };
  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    const string = s.split('.').join('');
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const handleClick = () => {
    props.handleClick(props.item);
  };
  const {item, lng} = props;
  const itemCreateDateWithLocale = moment(item.created);
  itemCreateDateWithLocale.locale(lng);

  const name =
    item &&
    item.familyData &&
    item.familyData.familyMembersList &&
    item.familyData.familyMembersList[0]
      ? `${item.familyData.familyMembersList[0].firstName} ${item.familyData.familyMembersList[0].lastName}`
      : ' - ';
  return (
    <ListItem
      style={{...styles.listItem, ...styles.borderBottom}}
      onPress={handleClick}
      disabled={props.user.role == 'ROLE_SURVEY_TAKER' ? true : false}>
      <View>
        <Text
          id="dateCreated"
          style={globalStyles.tag}
          accessibilityLabel={itemCreateDateWithLocale.format('MMMM DD, YYYY')}>
          {capitalize(itemCreateDateWithLocale.format('MMM DD, YYYY'))}
        </Text>
        <Text id="fullName" style={globalStyles.p}>
          {name}
        </Text>
        <Text
          id="status"
          style={{
            ...styles.label,
            backgroundColor: getColor(props.item.status),
            color: props.item.status === 'Synced' ? colors.grey : colors.white,
          }}>
          {setStatusTitle(props.item.status)}
        </Text>
      </View>
      {props.user.role !== 'ROLE_SURVEY_TAKER' && (
        <Icon name="navigate-next" size={23} color={colors.lightdark} />
      )}
    </ListItem>
  );
}

DraftListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  lng: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  listItem: {
    height: 95,
    padding: 25,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  borderBottom: {
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
  },
  label: {
    borderRadius: 5,
    width: 0,
    minWidth: 120,
    height: 25,
    paddingLeft: 5,
    paddingRight: 5,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default DraftListItem;
