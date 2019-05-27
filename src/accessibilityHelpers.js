import i18n from './i18n'
import AccessibilityInfo from 'react-native'

export const logoutMessage = (unsyncedDrafts, checkboxesVisible) => {
  let title = !checkboxesVisible
    ? i18n.t('views.logout.logout')
    : `${i18n.t('general.warning')}!`
  return unsyncedDrafts
    ? `${title} ${i18n.t('views.logout.youHaveUnsynchedData')} ${i18n.t(
        'views.logout.thisDataWillBeLost'
      )} ${i18n.t('views.logout.areYouSureYouWantToLogOut')} ${i18n.t(
        'general.yes'
      )} ${i18n.t('general.no')}`
    : `${title} ${i18n.t('views.logout.weWillMissYou')} ${i18n.t(
        'views.logout.comeBackSoon'
      )} ${i18n.t('views.logout.areYouSureYouWantToLogOut')} ${i18n.t(
        'general.yes'
      )} ${i18n.t('general.no')}`
}

export const setListOfLabeles = options => {
  return options
    ? options.map((item, index) => `Option ${index + 1}` + item.text).join()
    : 'items'
}
