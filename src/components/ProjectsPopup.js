import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Popup from './Popup';
import colors from '../theme.json';
import Icon from 'react-native-vector-icons/MaterialIcons'
import globalStyles from '../globalStyles';
import { withNamespaces } from 'react-i18next';
import { isLandscape } from '../responsivenessHelpers'
import IconButton from './IconButton';

const ProjectsPopup = ({
    isOpen,
    toggleModal,
    t,
    projects,
    selectedSurvey,
    afterSelect
}) => {
    const onClose = (selected, project) => {
        selected && afterSelect(selectedSurvey, project);
        toggleModal();
    };
    const { width, height } = Dimensions.get('window')
    return (<Popup isOpen={isOpen} onClose={() => onClose(false)} modifiedPopUp projectsModal>
        <View style={styles.container} >
            <>
                <Icon
                    style={styles.closeIconStyle}
                    size={20}
                    name="close"
                    onPress={() => onClose(false)}
                />
                <Text
                    style={styles.title}
                >
                    {t('views.modals.chooseProjectTitle')}

                </Text>
                <Text
                    style={styles.subtitle}
                >
                    {t('views.modals.chooseProjectSubtitle')}
                </Text>

                <ScrollView
                    horizontal={isLandscape({ width, height }) ? true : false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    snapToAlignment="center"
                >
                    {projects.map(project => {
                        return ( 
                            <TouchableOpacity
                                onPress={() => onClose(true, project.id)}
                            >  
                                <View style={[styles.itemCard, { backgroundColor: project.color ? project.color : '#fff' }]}>
                                    
                                    <Text style={styles.itemTitle} >{project.title}</Text>
                                    <Text style={styles.itemDescription}>{project.description}</Text>
                                   
                                </View>
                               
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <View style={styles.linkContainer}>
                    <IconButton
                        text={t('views.modals.skipProject')}
                        textStyle={styles.link}
                        onPress={() => onClose(true)}

                    // onPress={() => this.selectAnswer(0)}
                    />
                </View>
            </>
        </View>
    </Popup>)
}

ProjectsPopup.propTypes = {
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    ProjectsPopup: PropTypes.bool,
    projects: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    afterSelect: PropTypes.func,
    selectedSurvey: PropTypes.object
  }

const styles = StyleSheet.create({
    closeIconStyle: {
        color: colors.palegreen,
        marginLeft: 'auto',
        fontSize: 24,
    },
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    title: {
        ...globalStyles.h2Bold,
        color: colors.lightdark,

        textAlign: 'center'
    },
    subtitle: {
        ...globalStyles.h4,
        color: colors.lightdark,
        textAlign: 'center',
        marginBottom: 25,
    },
    itemCard: {
        width: 200,
        height: 150,
        minHeight:150,
        borderRadius: 2,
        padding: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        marginBottom: 10,
        marginHorizontal: 10

    },
    itemTitle: {
        ...globalStyles.h3Bold,
        color: colors.lightdark,
        textAlign: 'center',
        paddingBottom: 15
    },
    itemDescription: {
        fontSize: 11,
        textAlign: 'center',
        color: colors.lightdark,
        fontFamily: 'Poppins',
        fontWeight: '400',
    },
    link: {
        ...globalStyles.h3Bold,
        color: colors.palegreen,
    },
    linkContainer: {
        // marginVertical:20,
        paddingTop: 10,
        marginLeft: 'auto',
    }
})

export default withNamespaces()(ProjectsPopup);