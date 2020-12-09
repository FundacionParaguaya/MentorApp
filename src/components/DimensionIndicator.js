import React from 'react';
import ListItem from './ListItem';
import { View, Text, StyleSheet } from 'react-native';
import globalStyles from '../globalStyles';
import colors from '../theme.json'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNamespaces } from 'react-i18next'

const DimensionIndicator = ({
    name,
    color,
    priority,
    handleClick,
    t,
    errorPrioritySync,
    pendingPrioritySync
}) => {

    const defineColor = value => {
        switch (value) {
            case 1:
                return colors.red
            case 2:
                return colors.gold
            case 3:
                return colors.palegreen
            case 0:
                return colors.palegrey
            default:
                return colors.palegrey
        }
    }

    const defineAccessibilityTextForColor = value => {
        switch (value) {
            case 1:
                return 'red'
            case 2:
                return 'yellow'
            case 3:
                return 'green'
            case 0:
                return 'grey'
            default:
                return 'grey'
        }
    }

    const disabledButton = !color || priority || pendingPrioritySync || errorPrioritySync;

    console.log('DImension Indicator')

    return (
        <ListItem
            disabled={disabledButton}
            onPress={handleClick}
            style={styles.container}>
            <View>
                {priority ? (
                    <View style={{
                        ...styles.blueIcon,
                        backgroundColor: colors.blue,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 15
                    }}>
                        <Icon2 name="pin" color={colors.white} size={12} />
                    </View>
                ) : (<View />)}
                {pendingPrioritySync || errorPrioritySync ? (
                    <View
                        style={{
                            ...styles.blueIcon,
                            backgroundColor: colors.grey,
                            width: 20,
                            height: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 15
                        }}
                    >
                        <Icon2 name="pin" color={colors.white} size={12} />
                    </View>
                ) : (
                        <View />
                    )}
                <Icon
                    name="brightness-1"
                    color={defineColor(color)}
                    size={40}
                    style={{ marginRight: 15, zIndex: 10 }}
                />
            </View>
            <View style={[styles.listItem, styles.borderBottom]}>
                <View>
                    <Text
                        style={{
                            ...globalStyles.p
                        }}
                        accessibilityLabel={name}
                        accessibilityHint={defineAccessibilityTextForColor(
                            color
                        )}
                    >
                        {name}
                    </Text>
                    {errorPrioritySync &&
                        <Text style={styles.errorLabel}>{t('views.family.priorityError')}</Text>
                    }
                    {pendingPrioritySync &&
                        <Text style={styles.pendingLabel}>{t('views.family.priorityPending')}</Text>
                    }
                </View>
            </View>
        </ListItem >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    listItem: {
        height: 95,
        paddingTop: 25,
        paddingBottom: 25,
        paddingRight: 25,
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'

    },
    blueIcon: {
        position: 'absolute',
        right: 15,
        borderRadius: 11,
        backgroundColor: colors.white,
        borderColor: colors.white,
        borderWidth: 2,
        zIndex: 10
    },
    pendingLabel: {
        marginTop: 5,
        backgroundColor: colors.grey,
        paddingHorizontal: 10,
        marginHorizontal: 2,
        borderRadius: 10,
        color: 'white',
        alignSelf: 'flex-start'
    },
    errorLabel: {
        marginTop: 5,
        backgroundColor: colors.red,
        paddingHorizontal: 10,
        marginHorizontal: 2,
        borderRadius: 10,
        color: 'white',
        alignSelf: 'flex-start'
    }

})

export default withNamespaces()(DimensionIndicator);