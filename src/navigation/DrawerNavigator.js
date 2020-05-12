import { createDrawerNavigator } from 'react-navigation'
import { Platform } from 'react-native'
import DrawerContentComponent from './DrawerContent'
import SyncStack from './SyncStack'
import FamiliesStack from './FamiliesStack'
import LifemapStack from './LifemapStack'
import DashboardStack from './DashboardStack'

// the drawer navigation menu
export default createDrawerNavigator(
  {
    Dashboard: {
      screen: DashboardStack
    },
    Surveys: {
      screen: LifemapStack,
      // Enable drawer when choosing a survey and disable it after that,
      // when creating a Life Map
      navigationOptions: ({ navigation }) => ({
        drawerLockMode:
          navigation.state.index === 0 ? 'unlocked' : 'locked-closed'
      })
    },
    Families: {
      screen: FamiliesStack
    },
    Sync: {
      screen: SyncStack
    }
  },
  {
    contentComponent: DrawerContentComponent,
    drawerWidth: 304,
    contentOptions: {
      labelStyle: {
        ...Platform.select({
          ios: {
            fontFamily: 'Poppins',
            fontWeight: '600'
          },
          android: {
            fontFamily: 'Poppins SemiBold'
          }
        })
      },
      initialRouteName: 'Dashboard'
    },
    transitionConfig: () => ({
      screenInterpolator: () => null,
      transitionSpec: {
        duration: 0
      }
    })
  }
)
