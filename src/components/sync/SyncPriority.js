import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ListItem from '../ListItem';
import colors from '../../theme.json';
import Icon from 'react-native-vector-icons/MaterialIcons'
import globalStyles from '../../globalStyles';
import { withNamespaces } from 'react-i18next'


const styles = StyleSheet.create({
    view: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 20
    },
    listItem: {
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'
    },
    borderBottom: {
        borderBottomColor: colors.lightgrey,
        borderBottomWidth: 1,
       
    },
    error: {
        backgroundColor: colors.palered,
        color: colors.white
    },
    label: {
        color: colors.lightdark,
        borderRadius: 5,
        minWidth: 100,
        paddingLeft: 5,
        paddingRight: 5,
        height: 25,
        lineHeight: 25,
        textAlign: 'center',
        marginTop: 5

    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: { transform: [{ rotate: '90deg' }], marginRight: 10 },

})

const SyncPriority = ({
    indicatorName,
    familyName,
    t
}) => {
    console.log('indicatorName',indicatorName);
    console.log('familyName', familyName)
    return(
        <ListItem
            style={{...styles.listItem, ...styles.borderBottom}}
            disabled={true}
        >
            <View style={styles.view}>
                <View style={styles.container}>
                <Icon
                    name='swap-calls'
                    style={styles.icon}
                    size={30}
                    color={colors.lightdark}
                />
                </View>
                <View>
                    <Text style={globalStyles.p}>{indicatorName}</Text>
                    <Text style={globalStyles.p}>{familyName}</Text>
                    <Text style={[styles.label, styles.error]}>{t('views.family.priorityError')}</Text>
                </View>
                

            </View>

        </ListItem>
    )
}

export default withNamespaces()(SyncPriority);