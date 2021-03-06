import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../theme.json';
import { withNamespaces } from 'react-i18next';
import globalStyles from '../globalStyles';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth:420,
        marginLeft:'auto',
        marginRight:'auto',
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleNumberContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    colorNumberText: {
        fontFamily: 'Poppins SemiBold',
        fontSize: 16,
        marginLeft:10
    },
    circleGreen: {
        backgroundColor: colors.palegreen,
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    circleYellow: {
        backgroundColor: colors.gold,
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    circleRed: {
        backgroundColor: colors.palered,
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    cirleGrey: {
        backgroundColor: colors.lightgrey,
        width: 30,
        height: 30,
        borderRadius: 15,
    },  
    colorIndicator: {
        ...globalStyles.h5,
        marginTop: 10,
        marginBottom: 10,
        maxWidth: 60
    }
})

const IndicatorsSummary = ({
    t,
    indicators,
    containerStyle
}) => {
    const getCount = (value) => {
        return indicators.filter(indicator => indicator.value == value).length || 0
    }
    let greenCounter = getCount(3);
    let yellowCounter = getCount(2);
    let redCounter = getCount(1);
    let skipCounter = getCount(0);
    return (
        <View style={[styles.container, containerStyle ]}>
            <View style={styles.itemContainer} >
                <View style={styles.circleNumberContainer}>
                    <View style={styles.circleGreen} />
                    <Text style={styles.colorNumberText}>{greenCounter}</Text>
                </View>
                <Text style={styles.colorIndicator}>
                    {t('views.DashGreen')}
                </Text>
            </View>
            <View style={styles.itemContainer} >
                <View style={styles.circleNumberContainer}>
                    <View style={styles.circleYellow} />
                    <Text style={styles.colorNumberText}>{yellowCounter}</Text>
                </View>
                <Text style={styles.colorIndicator}>
                    {t('views.DashYellow')}
                </Text>
            </View>
            <View style={styles.itemContainer} >
                <View style={styles.circleNumberContainer}>
                    <View style={styles.circleRed} />
                    <Text style={styles.colorNumberText}>{redCounter}</Text>
                </View>
                <Text style={styles.colorIndicator}>
                    {t('views.DashRed')}
                </Text>
            </View>
            <View style={styles.itemContainer} >
                <View style={styles.circleNumberContainer}>
                    <View style={styles.cirleGrey} />
                    <Text style={styles.colorNumberText}>{skipCounter}</Text>
                </View>
                <Text numberOfLines={2} style={styles.colorIndicator}>
                    {t('views.DashSkipped')}
                </Text>
            </View>
        </View>
    )
}

IndicatorsSummary.propTypes = {
    indicators: PropTypes.array.isRequired
}

export default withNamespaces()(IndicatorsSummary);