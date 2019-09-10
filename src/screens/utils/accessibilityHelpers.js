import i18n from '../../i18n'

// export const setListOfLabeles = options => {
//   return options
//     ? options.map((item, index) => `Option ${index + 1}` + item.text).join()
//     : 'items'
// }

export const logoutModalAccessibleText = (
  unsyncedDrafts,
  checkboxesVisible
) => {
  const pause = '.'
  const logoutTitle = `${
    !checkboxesVisible
      ? i18n.t('views.logout.logout')
      : `${i18n.t('general.warning')}!`
  }`

  const logoutCheckboxes = `
  ${i18n.t('general.delete')} ${i18n.t('general.drafts')}
  ${i18n.t('general.delete')} ${i18n.t('general.lifeMaps')}
  ${i18n.t('general.delete')} ${i18n.t('general.familyInfo')}
  ${i18n.t('general.delete')} ${i18n.t('general.cachedData')}${pause}
  `

  const logoutBody = `
    ${
      !checkboxesVisible
        ? unsyncedDrafts
          ? `${i18n.t('views.logout.youHaveUnsynchedData')}
        ${i18n.t('views.logout.thisDataWillBeLost')} . ${i18n.t(
              'views.logout.areYouSureYouWantToLogOut'
            )}${pause}`
          : `
      ${i18n.t('views.logout.weWillMissYou')} ${i18n.t(
              'views.logout.comeBackSoon'
            )} . ${i18n.t('views.logout.areYouSureYouWantToLogOut')}`
        : `${i18n.t('views.logout.looseYourData')} ${i18n.t(
            'views.logout.cannotUndo'
          )}
          ${logoutCheckboxes}
          `
    }
  `
  const logoutButtons = `${
    !checkboxesVisible
      ? `${i18n.t('general.yes')} ${i18n.t('general.no')}`
      : `${i18n.t('general.delete')}${i18n.t('general.cancel')}`
  }`

  return `
  ${logoutTitle}${pause}
  ${logoutBody}
  ${logoutButtons}
`
}
