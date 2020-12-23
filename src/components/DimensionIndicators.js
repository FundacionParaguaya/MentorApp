import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DimensionIndicator from './DimensionIndicator';
import globalStyles from '../globalStyles';
import AddPriorityAndAchievementModal from '../screens/modals/AddPriorityAndAchievementModal';

const DimensionIndicators = ({
    survey,
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
    let priorities = draftData.priorities.map(priority => priority.indicator);
    let filterIndicatorDraftData = {
        ...draftData,
        indicatorSurveyDataList:  draftData.indicatorSurveyDataList.filter(
            e => e.value === 1 || e.value === 2
        ) 
    }

    const getColor = (codeName) => {
        let indicator;

        filterIndicatorDraftData && filterIndicatorDraftData.indicatorSurveyDataList
            ? indicator =filterIndicatorDraftData.indicatorSurveyDataList.
            find(
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
        filterIndicatorDraftData && filterIndicatorDraftData.indicatorSurveyDataList ? indicator = filterIndicatorDraftData.indicatorSurveyDataList.find(
            item => item.key === codename,
        ) : indicator = null;
        if (indicator && indicator.snapshotStoplightId ) {
            return indicator.snapshotStoplightId
        } else {
            return;
        }

    }

    const checkSyncPriorityStatus = (codeName, prioritiesForSync, status) => {
        let indicator;
        let syncStatus = false;
        if (filterIndicatorDraftData && filterIndicatorDraftData.indicatorSurveyDataList && prioritiesForSync) {
            indicator = filterIndicatorDraftData.indicatorSurveyDataList.find(item =>
                item.key == codeName && item.snapshotStoplightId
            );
            if( indicator && indicator.snapshotStoplightId) {
                syncStatus = prioritiesForSync.
                filter(priority => priority.status == status).
                find(priority =>
                    priority.snapshotStoplightId == indicator.snapshotStoplightId
                );
            }
            return syncStatus;
        }
        return syncStatus;
    }



    const filterByDimension = (item) => {
        let data = surveyData.filter((indicator) => {
            const colorCode = getColor(indicator.codeName);
            return (indicator.dimension == item
                && typeof colorCode == 'number');
        })
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

    useEffect(() => {
        priorities = filterIndicatorDraftData.priorities.map(priority => priority.indicator);
    },[draftData])
    return (
        <View style={styles.container}>
            {addPriority
                ? (
                    <AddPriorityAndAchievementModal
                        survey={survey}
                        onClose={onClose}
                        color={color}
                        draft={draftData}
                        indicator={indicator}
                        indicatorText={indicatorText}
                        snapshotStoplightId={snapshotStoplightId}
                        isFamily={(draftData.status == 'Synced' || !draftData.draftId)}
                    />
                ) : null}
            {[...new Set(dimensions)].map((dimension) => (
                <View >
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