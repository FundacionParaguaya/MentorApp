import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import {generateNavStyles, addMenuIcon} from './helpers';

import DrawerContentComponent from './DrawerContent';
import DashboardView from '../screens/Dashboard';

import SyncView from '../screens/Sync';

import LifemapStack, {FamiliesStack} from './LifemapStack';
import Title from './Title';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = ({navigation, route}) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#009387',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <Stack.Screen
      name="Dashboard"
      component={DashboardView}
      options={{
        headerShown: true,
        headerTitle: (props) => <Title title="views.dashboard" />,
        ...generateNavStyles({navigation, route}),
        headerLeft: () => addMenuIcon(navigation),
      }}
    />
  </Stack.Navigator>
);

const SyncStack = ({navigation, route}) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#009387',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <Stack.Screen
      name="Sync"
      component={SyncView}
      options={{
        headerShown: true,
        headerTitle: (props) => <Title title="views.synced" />,
        ...generateNavStyles({navigation, route}),
        headerLeft: () => addMenuIcon(navigation),
      }}
    />
  </Stack.Navigator>
);

export default function MyDrawer({navigation, route}) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentComponent {...props} route={route} />
      )}>
      <Drawer.Screen name="Dashboard" component={HomeStackScreen} />
      <Drawer.Screen
        name="Surveys"
        component={LifemapStack}
        options={{swipeEnabled: false}}
      />
      <Drawer.Screen name="Sync" component={SyncStack} />
      <Drawer.Screen name="Families" component={FamiliesStack} />
    </Drawer.Navigator>
  );
}
