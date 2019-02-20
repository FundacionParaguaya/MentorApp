import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

export class Family extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Families</Text>
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
    flex: 1,
    backgroundColor: '#fff'
  }
})

const mapStateToProps = ({ snapshots }) => ({
  snapshots
})

export default connect(mapStateToProps)(Family)
