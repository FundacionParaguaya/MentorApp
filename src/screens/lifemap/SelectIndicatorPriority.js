import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import globalStyles from '../../globalStyles';
import DimensionIndicators from '../../components/DimensionIndicators';
import StickyFooter from '../../components/StickyFooter';
import NetInfo from '@react-native-community/netinfo';
import { submitPriority } from '../../redux/actions';
import {url} from '../../config.json';


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {

        paddingTop: 10,
        //flex: 1,
        flexDirection: 'column',
        //justifyContent: 'center',
        //alignItems: 'stretch',
        //justifyContent: 'center',
        //alignItems: 'center',

    },
    title: {
        textAlign: 'center',
    }

})

const SelectIndicatorPriority = ({ t, route, drafts, priorities, env, user, submitPriority, navigation }) => {
    const survey = route.params.survey;
    const draft = route.params.draft;

    /* let questions = draft.indicatorSurveyDataList.filter(e => e.value === 1 || e.value === 2);
    draft.indicatorSurveyDataList = questions  */

    draft.indicatorSurveyDataList = draft.indicatorSurveyDataList.filter(
        e => e.value === 1 || e.value === 2
    )

    const navigateTo = () => {
        navigation.goBack();
    }

    return (
        //<View>
        <StickyFooter
            continueLabel={t('general.finish')}
            onContinue={navigateTo}
            style={{ marginBottom: -20 }}
            type={'button'}
            tipTitle={t('views.lifemap.toComplete')}
        //onTipClose={false}
        //tipDescription={this.getTipDescription(mandatoryPrioritiesCount, true)}
        >

            <View style={[styles.container]}>
                <View>
                    <Text style={[globalStyles.h2Bold, styles.title]}>{t('views.family.selectIndicator')}</Text>
                </View>

                <DimensionIndicators
                    surveyData={survey.surveyStoplightQuestions}
                    draftData={draft}
                    syncPriorities={priorities}
                />
            </View>
        </StickyFooter >
    )
}


const mapStateToProps = ({ drafts, env, priorities, user }) => ({ drafts, env, priorities, user });

const mapDispatchToProps = {
    submitPriority
}

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(SelectIndicatorPriority));