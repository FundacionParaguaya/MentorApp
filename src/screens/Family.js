import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import colors from '../theme.json'
import globalStyles from '../globalStyles'

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
  render() {
    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.container}
      >
        <View style={styles.tabs}>
          <TouchableHighlight style={styles.tab}>
            <Text style={globalStyles.h3}>Details</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{ ...styles.tab, ...styles.activeTab }}>
            <Text style={globalStyles.h3}>Life map</Text>
          </TouchableHighlight>
        </View>
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
  },
  tab: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeTab: { borderBottomColor: colors.grey, borderBottomWidth: 3 }
})

const mapStateToProps = ({ snapshots }) => ({
  snapshots
})

export default connect(mapStateToProps)(Family)
