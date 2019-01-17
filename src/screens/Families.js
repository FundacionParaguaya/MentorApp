import React, { Component } from 'react'
import { View, StyleSheet, Button, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

export class Families extends Component {
  render() {
    console.log(this.props.families)
    return (
      <ScrollView style={styles.container}>
        {this.props.families.map(family => (
          <View key={family.familyId}>
            <Button
              title={family.name}
              onPress={() =>
                this.props.navigation.navigate('Family', {
                  family: family.familyId
                })
              }
            />
          </View>
        ))}
      </ScrollView>
    )
  }
}

Families.propTypes = {
  families: PropTypes.array,
  navigation: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

const mapStateToProps = ({ families }) => ({
  families
})

export default connect(mapStateToProps)(Families)
