import React from 'react'
import { StyleSheet, View, Text} from 'react-native';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import globalStyles from '../../globalStyles';
import DimensionIndicators from '../../components/DimensionIndicators';
import StickyFooter from '../../components/StickyFooter';
import { submitPriority } from '../../redux/actions';


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        paddingTop: 10,
        flexDirection: 'column',
    },
    title: {
        textAlign: 'center',
    }

})

const SelectIndicatorPriority = ({ t, route, drafts, priorities, env, user, submitPriority, navigation }) => {
    const survey = route.params.survey;
    let draftData = route.params.draft;


    const getDraft = () =>
        drafts.find((draft) => draft.draftId === draftData.draftId);

    const navigateTo = () => {
        navigation.goBack();
    }

    draftData.status == 'Pending sync' ? draftData = getDraft(): null;

    draftData.indicatorSurveyDataList = draftData.indicatorSurveyDataList.filter(
        e => e.value === 1 || e.value === 2
    )
    return (
        <StickyFooter
            continueLabel={t('general.finish')}
            onContinue={navigateTo}
            style={{ marginBottom: -20 }}
            type={'button'}
            tipTitle={t('views.lifemap.toComplete')}
        >

            <View style={[styles.container]}>
                <View>
                    <Text style={[globalStyles.h2Bold, styles.title]}>{t('views.family.selectIndicator')}</Text>
                </View>
                <DimensionIndicators
                    surveyData={survey.surveyStoplightQuestions}
                    draftData={draftData}
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