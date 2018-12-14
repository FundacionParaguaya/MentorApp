import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, FlatList } from 'react-native'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import Button from '../components/Button'
import RoundImage from '../components/RoundImage'
import DraftListItem from '../components/DraftListItem'
import globalStyles from '../globalStyles'
import { connect } from 'react-redux'
import colors from '../theme.json'

export class Dashboard extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Dashboard'),
      drawerLabel: navigation.getParam('title', 'Dashboard')
    }
  }
  slowLoadingTimer
  clearTimers = () => {
    clearTimeout(this.slowLoadingTimer)
  }
  updateTitle = () =>
    this.props.navigation.setParams({
      title: this.props.t('views.dashboard')
    })
  componentDidMount() {
    this.updateTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lng !== this.props.lng) {
      this.updateTitle()
    }
  }

  componentWillUnmount() {
    this.clearTimers()
  }

  render() {
    const { t, navigation, drafts } = this.props
    return (
      <ScrollView style={globalStyles.background}>
        {this.props.offline.outbox.length &&
        navigation.getParam('firstTimeVisitor') ? null : (
          <View>
            <View style={globalStyles.container}>
              <View>
                <Text
                  style={{
                    ...globalStyles.h3,
                    marginBottom: 33,
                    alignSelf: 'center'
                  }}
                >
                  {t('general.welcome')}!
                </Text>
              </View>
              <RoundImage source="family" />
              <Button
                text={t('views.createLifemap')}
                colored
                handleClick={() => this.props.navigation.navigate('Surveys')}
              />
            </View>
            <View style={styles.borderBottom}>
              <Text style={{ ...globalStyles.subline, ...styles.listTitle }}>
                {t('views.latestDrafts')}
              </Text>
            </View>
            <FlatList
              style={{ ...styles.background, paddingLeft: 25 }}
              data={drafts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <DraftListItem
                  item={item}
                  handleClick={() =>
                    navigation.navigate('FamilyParticipant', {
                      draft: item.draftId
                    })
                  }
                />
              )}
            />
            {!drafts.length ? (
              <Text
                id="no-drafts-message"
                style={{
                  ...globalStyles.subline,
                  textAlign: 'center',
                  marginTop: 10
                }}
              >
                {t('views.noDrafts')}
              </Text>
            ) : (
              <View />
            )}
          </View>
        )}
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  listTitle: {
    backgroundColor: colors.beige,
    height: 41,
    lineHeight: 41,
    flex: 1,
    textAlign: 'center'
  },
  borderBottom: {
    marginTop: 20,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  }
})

Dashboard.propTypes = {
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  offline: PropTypes.object,
  lng: PropTypes.string
}

const mapStateToProps = ({ env, user, drafts, offline, string }) => ({
  env,
  user,
  drafts,
  offline,
  string
})

const mapDispatchToProps = {}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
)
