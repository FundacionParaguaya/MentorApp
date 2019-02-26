import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import FamilyTab from '../components/FamilyTab'
import FamilyListItem from '../components/FamilyListItem'

export class Family extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.getParam('familyName', 'Families')}  ${
        navigation.getParam('familyLifemap', 'Families').familyData
          .countFamilyMembers > 1
          ? `+ ${navigation.getParam('familyLifemap', 'Families').familyData
              .countFamilyMembers - 1}`
          : ''
      }`
    }
  }
  state = { activeTab: 'Details' }

  componentDidMount() {
    this.props.navigation.setParams({
      withoutCloseButton: true
    })
  }
  render() {
    const { activeTab } = this.state
    const { t, navigation } = this.props
    const familyLifemap = navigation.getParam('familyLifemap')
    const { familyData } = familyLifemap

    console.log(familyLifemap)

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.container}
      >
        <View style={styles.tabs}>
          <FamilyTab
            title={t('views.family.details')}
            onPress={() => this.setState({ activeTab: 'Details' })}
            active={activeTab === 'Details'}
          />
          <FamilyTab
            title={t('views.family.lifemap')}
            onPress={() => this.setState({ activeTab: 'LifeMap' })}
            active={activeTab === 'LifeMap'}
          />
        </View>
        {activeTab === 'Details' ? (
          <View>
            <View style={styles.icon}>
              {familyData.countFamilyMembers > 1 && (
                <View style={styles.countCircleWrapper}>
                  <View style={styles.countCircle}>
                    <Text
                      style={[globalStyles.h4, { color: colors.lightdark }]}
                    >
                      + {familyData.countFamilyMembers - 1}
                    </Text>
                  </View>
                </View>
              )}

              <Icon
                name="face"
                style={styles.faceIcon}
                color={colors.grey}
                size={55}
              />
            </View>
            <View style={styles.section}>
              <Text style={globalStyles.h2}>
                {navigation.getParam('familyName')}
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.content}>
                <Text style={[globalStyles.h4, { color: colors.lightdark }]}>
                  {t('views.familyMembers').toUpperCase()}
                </Text>
                <FlatList
                  data={familyData.familyMembersList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <FamilyListItem
                      icon
                      text={`${item.firstName} ${item.lastName}`}
                      handleClick={() => console.log('clicked')}
                    />
                  )}
                />
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.content}>
                <Text style={[globalStyles.h4, { color: colors.lightdark }]}>
                  {t('views.family.household').toUpperCase()}
                </Text>
                <FamilyListItem
                  text={t('general.family')}
                  handleClick={() => console.log('clicked')}
                />
                <FamilyListItem
                  text={t('views.location')}
                  handleClick={() => console.log('clicked')}
                />
              </View>
            </View>
          </View>
        ) : null}
        {activeTab === 'LifeMap' ? (
          <Text id="lifemap">LifeMap here</Text>
        ) : null}
      </ScrollView>
    )
  }
}

Family.propTypes = {
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    height: 55,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  },
  faceIcon: {
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 15
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  countCircleWrapper: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  countCircle: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: 13 }, { translateY: -13 }]
  },
  content: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 30
  }
})

const mapStateToProps = () => ({})

export default withNamespaces()(connect(mapStateToProps)(Family))
