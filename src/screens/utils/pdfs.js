import colors from '../../theme.json'
import moment from 'moment'
import { priorityIcon, achievementIcon, styles } from './assets'

export const getReportTitle = snapshot => {
  const firstParticipant = snapshot.familyData.familyMembersList.find(
    m => !!m.firstParticipant
  )
  return `${firstParticipant.firstName} ${firstParticipant.lastName}`
}

export const getIndicatorQuestionByCodeName = (codeName, survey) => {
  const { surveyStoplightQuestions: questions } = survey
  return questions.find(q => q.codeName === codeName).questionText
}

export const getColor = value => {
  switch (value) {
    case 1:
      return colors.palered
    case 2:
      return colors.gold
    case 3:
      return colors.palegreen
    case 0:
      return colors.palegrey

    default:
      return colors.palegrey
  }
}

const generateLifeMapHtmlTemplate = (draft, survey) => {
  const indicatorsList = draft.indicatorSurveyDataList
  const achievements = draft.achievements
  const priorities = draft.priorities
  const dateCreated =
    draft &&
    draft.created &&
    moment
      .utc(draft.created)
      .format('DD-MMMM-YYYY')
      .replace(/-/g, ' / ')

  return `<div style="${styles.wrapper}">
            <h2 style="${styles.participantName}">${getReportTitle(
    draft
  )}, Life map</h2>
            <h2 style="${styles.date}">Created on: ${dateCreated}</h2>
        </div>
        <div style="${styles.indicatorsWrapper}">
          ${indicatorsList
            .map(indicator => {
              return `<div style="width: 20%;position:relative">
            ${
              achievements.some(a => a.indicator === indicator.key)
                ? achievementIcon
                : ''
            }
            ${
              priorities.some(p => p.indicator === indicator.key)
                ? priorityIcon
                : ''
            }
            <div style="${styles.indicator};background-color:${getColor(
                indicator.value
              )};"></div>
            <span style="${
              styles.indicatorName
            }">${getIndicatorQuestionByCodeName(indicator.key, survey)}</span>
          </div>`
            })
            .join('')}
        </div>
        `
}

export const buildPrintOptions = (draft, survey) => {
  return {
    html: generateLifeMapHtmlTemplate(draft, survey)
  }
}

export const buildPDFOptions = (draft, survey) => {
  return {
    html: generateLifeMapHtmlTemplate(draft, survey),
    fileName: `${getReportTitle(draft)}, Life Map`,
    directory: 'docs',
    padding: 0,
    height: 842,
    width: 595
  }
}
