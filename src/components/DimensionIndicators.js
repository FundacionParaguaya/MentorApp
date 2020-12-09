import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DimensionIndicator from './DimensionIndicator';
import globalStyles from '../globalStyles';
import AddPriorityAndAchievementModal from '../screens/modals/AddPriorityAndAchievementModal';
import { Priorities } from '../screens/lifemap/Priorities';

const DimensionIndicators = ({
    surveyData,
    draftData,
    syncPriorities

}) => {
    const [addPriority, setAddPriority] = useState(false);
    const [indicator, setIndicator] = useState({});
    const [color, setColor] = useState(null);
    const [indicatorText, setIndicatorText] = useState('');
    const [snapshotStoplightId, setSnapshotStoplightId] = useState(null)


    let dimensions = surveyData.map((item) => item.dimension);

    console.log('dimensions', dimensions)

    const priorities = draftData.priorities.map(priority => priority.indicator);

    const getColor = (codeName) => {
        let indicator;

        draftData && draftData.indicatorSurveyDataList
            ? indicator = draftData.indicatorSurveyDataList.find(
                item => item.key === codeName,
            ) : indicator = null;
        if (indicator) {
            return indicator.value
        } else {
            return;
        }

    }

    const getSnapshotStoplightId = (codename) => {
        let indicator;
        draftData && draftData.indicatorSurveyDataList ? indicator = draftData.indicatorSurveyDataList.find(
            item => item.key === codename,
        ) : indicator = null;
        if (indicator) {
            return indicator.snapshotStoplightId
        } else {
            return;
        }

    }

    const checkSyncPriorityStatus = (codeName, prioritiesForSync, status) => {
        console.log('datos', prioritiesForSync)
        let indicator;
        let syncStatus = false;
        if (draftData && draftData.indicatorSurveyDataList && prioritiesForSync) {
            indicator = draftData.indicatorSurveyDataList.find(item =>
                item.key == codeName && item.snapshotStoplightId
            );
            syncStatus = prioritiesForSync.
                filter(priority => priority.status == status).
                find(priority =>
                    priority.snapshotStoplightId == indicator.snapshotStoplightId
                );
            console.log('statusCheck', syncStatus)
            return syncStatus;
        }
        return syncStatus;
    }



    const filterByDimension = (item) => {
        console.log('filterByDimension', item)
        let data = surveyData.filter((indicator) => {
            const colorCode = getColor(indicator.codeName);
            console.log('colorCode', colorCode)
            return (indicator.dimension == item
                && typeof colorCode == 'number');
        })
        console.log('the data', data);
        return data

    }



    const handleClick = (color, indicator, indicatorText, snapshotStoplightId) => {
        setAddPriority(true);
        setIndicator(indicator);
        setColor(color);
        setIndicatorText(indicatorText);
        setSnapshotStoplightId(snapshotStoplightId)
    }

    const onClose = () => {
        setAddPriority(false);
    }

    console.log('priorities', priorities)

    return (
        <View style={styles.container}>
            {addPriority
                ? (
                    <AddPriorityAndAchievementModal
                        onClose={onClose}
                        color={color}
                        draft={draftData}
                        indicator={indicator}
                        indicatorText={indicatorText}
                        snapshotStoplightId={snapshotStoplightId}
                        isFamily={true}
                    />
                ) : null}
            {[...new Set(dimensions)].map((dimension) => (
                <View >
                    {console.log('info', filterByDimension(dimension))}
                    {filterByDimension(dimension).length ? (
                        <Text style={styles.dimension}>{dimension.toUpperCase()}</Text>
                    ) : null}
                    <View>
                        {filterByDimension(dimension).map((indicator) => (
                            <DimensionIndicator
                                key={indicator.questionText}
                                name={indicator.questionText}
                                color={getColor(indicator.codeName)}
                                errorPrioritySync={checkSyncPriorityStatus(indicator.codeName, syncPriorities, 'Sync Error')}
                                pendingPrioritySync={checkSyncPriorityStatus(indicator.codeName, syncPriorities, 'Pending Status')}
                                priority={priorities.includes(indicator.codeName) || checkSyncPriorityStatus(indicator.codeName, syncPriorities, 'Synced')}
                                handleClick={() => {
                                    handleClick(getColor(indicator.codeName),
                                        indicator.codeName,
                                        indicator.questionText,
                                        getSnapshotStoplightId(indicator.codeName))
                                }}
                            />
                        ))}
                    </View>
                </View>

            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    dimension: {
        ...globalStyles.h3,
        marginHorizontal: 20,
        marginVertical: 10
    }
})


export default DimensionIndicators;