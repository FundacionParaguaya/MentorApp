import PropTypes from 'prop-types';
import React, {useState, useRef} from 'react';
import {withNamespaces} from 'react-i18next';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';

import mapPlaceholderLarge from '../../assets/images/map_placeholder_1000.png';
import FamiliesListItem from '../components/FamiliesListItem';
import SearchBar from '../components/SearchBar';
import {url} from '../config';
import globalStyles from '../globalStyles';
import {loadFamilies} from '../redux/actions';
import {setAccessibilityTextForFamilies} from '../screens/utils/accessibilityHelpers';
import colors from '../theme.json';
import {replaceSpecialChars as sanitize} from '../utils';

function Families(props) {
  const [search, setSearch] = useState('');

  const sortByName = (families) =>
    families.sort((a, b) => a.name.localeCompare(b.name));
  const handleClickOnFamily = (family) => {
    props.navigation.replace('Family', {
      allowRetake: family.allowRetake,
      familyId: family.familyId,
      familyName: family.name,
      familyLifemap: family.snapshotList
        ? family.snapshotList[0]
        : family.draft,
      isDraft: !family.snapshotList,
      survey: props.surveys.find((survey) =>
        family.snapshotList
          ? survey.id === family.snapshotList[0].surveyId
          : survey.id === family.draft.surveyId,
      ),
    });
  };
  const fetchFamilies = () => {
    props.loadFamilies(url[props.env], props.user.token);
  };

  const {t} = props;
  // show not synced families from drafts
  const draftFamilies = props.drafts
    .filter(
      (draft) => draft.status === 'Draft' || draft.status === 'Pending sync',
    )
    .map((draft) => {
      const primaryParticipant = draft.familyData.familyMembersList[0];
      return {
        name: `${primaryParticipant.firstName} ${primaryParticipant.lastName}`,
        birthDate: primaryParticipant.birthDate,
        draft,
      };
    });

  const allFamilies = [...draftFamilies, ...sanitize(props.families)];

  const filteredFamilies = allFamilies.filter(
    (family) =>
      family.name.toLowerCase().includes(search.toLowerCase()) ||
      (family.code && family.code.includes(search)),
  );

  const screenAccessibilityContent = setAccessibilityTextForFamilies();
  return (
    <View
      style={[globalStyles.background, styles.container]}
      accessible={true}
      accessibilityLabel={screenAccessibilityContent}
      accessibilityLiveRegion="assertive">
      <View style={styles.imagePlaceholderContainer}>
        <View style={styles.searchContainer}>
          <SearchBar
            id="searchAddress"
            style={styles.search}
            placeholder={t('views.family.searchByName')}
            onChangeText={(search) => setSearch(search)}
            value={search}
          />
        </View>
        <Image
          style={styles.imagePlaceholderTop}
          source={mapPlaceholderLarge}
        />
      </View>

      <View style={styles.bar}>
        <Text style={{...globalStyles.subline, ...styles.familiesCount}}>
          {filteredFamilies.length} {t('views.families').toLowerCase()}
        </Text>
      </View>

      <FlatList
        style={{flex: 1}}
        refreshing={
          !!props.offline.online &&
          !!props.offline.outbox.find((item) => item.type === 'LOAD_FAMILIES')
        }
        onRefresh={fetchFamilies}
        data={sortByName(filteredFamilies)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <FamiliesListItem
            error={t('views.family.error')}
            lng={props.lng}
            handleClick={() => handleClickOnFamily(item)}
            family={item}
          />
        )}
        initialNumToRender={7}
      />
    </View>
  );
}

Families.propTypes = {
  families: PropTypes.array,
  surveys: PropTypes.array,
  drafts: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  loadFamilies: PropTypes.func.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  offline: PropTypes.object,
  t: PropTypes.func,
  lng: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  search: {
    width: '100%',
  },
  bar: {
    paddingLeft: 30,
    justifyContent: 'center',
    height: 48,
    backgroundColor: colors.primary,
  },
  searchContainer: {
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: '46%',
    position: 'absolute',
    zIndex: 10,
  },
  imagePlaceholderContainer: {
    position: 'relative',
    width: '100%',
    height: 139,
  },

  imagePlaceholderTop: {
    width: '100%',
    height: 139,
  },
  familiesCount: {
    fontWeight: '600',
  },
});

export const mapStateToProps = ({
  families,
  user,
  offline,
  env,
  surveys,
  drafts,
}) => ({
  families,
  user,
  offline,
  env,
  surveys,
  drafts,
});

const mapDispatchToProps = {
  loadFamilies,
};

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Families),
);
