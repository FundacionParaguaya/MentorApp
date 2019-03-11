import React, { Component } from 'react'
import { StyleSheet, ScrollView, FlatList } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import globalStyles from '../globalStyles'
import RoundImage from '../components/RoundImage'
import LifemapListItem from '../components/LifemapListItem'
import Decoration from '../components/decoration/Decoration'
import colors from '../theme.json'

export class Surveys extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Create a life map')
    }
  }

  updateTitle = () =>
    this.props.navigation.setParams({
      title: this.props.t('views.createLifemap')
    })

  componentDidMount() {
    this.updateTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lng !== this.props.lng) {
      this.updateTitle()
    }
  }
  render() {
    return (
      <ScrollView style={{ ...globalStyles.container, padding: 0 }}>
        <Decoration variation="lifemap">
          <RoundImage source="surveys" />
        </Decoration>
        <FlatList
          style={styles.list}
          data={this.props.surveys}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <LifemapListItem
              name={item.title}
              handleClick={() =>
                this.props.navigation.navigate('Terms', {
                  survey: item.id,
                  page: 'terms'
                })
              }
            />
          )}
        />
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  list: {
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1,
    paddingBottom: 60
  }
})

Surveys.propTypes = {
  surveys: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  lng: PropTypes.string,
  t: PropTypes.func
}

const mapStateToProps = ({ surveys }) => ({
  surveys
})

export default withNamespaces()(connect(mapStateToProps)(Surveys))
