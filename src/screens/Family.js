import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import colors from '../theme.json'
import globalStyles from '../globalStyles'
import FamilyTab from '../components/FamilyTab'

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
        {activeTab === 'Details' ? <Text>Details here</Text> : null}
        {activeTab === 'LifeMap' ? <Text>LifeMap here</Text> : null}
      </ScrollView>
    )
  }
}

Family.propTypes = {
  navigation: PropTypes.object.isRequired,
  snapshots: PropTypes.array
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

const mapStateToProps = ({ snapshots }) => ({
  snapshots
})

export default withNamespaces()(connect(mapStateToProps)(Family))
