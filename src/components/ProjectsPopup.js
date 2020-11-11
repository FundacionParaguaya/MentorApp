import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, useWindowDimensions } from 'react-native';
import Popup from './Popup';
import colors from '../theme.json';
import Icon from 'react-native-vector-icons/MaterialIcons'
import globalStyles from '../globalStyles';
import { withNamespaces } from 'react-i18next';
import { isLandscape } from '../responsivenessHelpers'
import IconButton from './IconButton';
import {
    responsiveScreenHeight,
    responsiveScreenWidth,
  } from "react-native-responsive-dimensions";
import { isTablet } from 'react-native-device-info';

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

    const width = useWindowDimensions().width;
    const height = useWindowDimensions().height;
    //const { width, height } = Dimensions.get('window')
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
                    contentContainerStyle= {isLandscape({ width, height })
                    ? styles.projectsScrollContainerHorizontal: styles.projectsScrollContainerVertical }
                >
                    {projects.slice(0,4).map(project => {
                        return ( 
                            <TouchableOpacity
                                onPress={() => onClose(true, project.id)}
                            >  
                                <View style=
                                {isLandscape({ width, height })
                                ?[
                                    styles.itemCardHorizontal,
                                     { backgroundColor: project.color
                                      ? project.color : '#fff' }]:[
                                        styles.itemCardVertical,
                                         { backgroundColor: project.color
                                          ? project.color : '#fff' }]}                                                     
                                    >                                  
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
        height:'100%',
        alignItems: 'center',
        justifyContent:'center'
        
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

    projectsScrollContainerVertical: {   
        minWidth:'100%',
        minHeight: '100%',
        alignItems:'center',
        marginBottom:15
    },
    projectsScrollContainerHorizontal: {
        minWidth:'100%',
        maxHeight:'100%',
        alignItems:'center',
        marginBottom:15,
        paddingHorizontal:20
    },
    itemCardHorizontal: {
        maxWidth:300,
        width: 200,
        minWidth: 150,
        maxHeight:150,
        minHeight:'100%',
        borderRadius: 2,
        paddingHorizontal: 15,
        paddingVertical:35,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginRight:15
    },
    itemCardVertical: {
        maxWidth:300,
        width:180 ,
        minWidth: '80%',
        maxHeight:200,
        height: 180,
        minHeight:150,
        borderRadius: 2,
        paddingHorizontal: 15,
        paddingVertical:30,
        marginHorizontal:15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginBottom: 15,
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
        marginTop:5,
        marginLeft: 'auto',
    }
})

export default withNamespaces()(ProjectsPopup);