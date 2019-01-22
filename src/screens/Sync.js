import React, { Component } from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import globalStyles from '../globalStyles'

export class Sync extends Component {
  render() {
    const { drafts, offline } = this.props
    console.log(this.props.drafts)
    console.log(this.props.offline)
    return (
      <ScrollView style={globalStyles.background}>
        <Text>Sync view</Text>
      </ScrollView>
    )
  }
}

const mapStateToProps = ({ drafts, offline }) => ({
  drafts,
  offline
})

export default withNamespaces()(connect(mapStateToProps)(Sync))
