import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import colors from '../theme.json'
import globalStyles from '../globalStyles'
import FamilyTab from '../components/FamilyTab'
import Overview from './lifemap/Overview'

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
    const { t } = this.props
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
          <Text id="details">Details here</Text>
        ) : null}
        {activeTab === 'LifeMap' ? (
          <ScrollView id="lifemap">
            <Overview
              navigation={this.props.navigation}
              familyLifemap={this.props.navigation.getParam('familyLifemap')}
            />
          </ScrollView>
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
  }
})

const mapStateToProps = () => ({})

export default withNamespaces()(connect(mapStateToProps)(Family))
