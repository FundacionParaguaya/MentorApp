import colors from '../../theme.json'
import moment from 'moment'
import { priorityIcon, achievementIcon, styles } from './assets'

const MAX_COLS = 6

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

const createTableRow = (indicatorsArray, survey, achievements, priorities) => {
  return `<tr style="${styles.tableRow}">
    ${indicatorsArray
      .map(indicator => {
        const color = getColor(indicator.value)
        const title = getIndicatorQuestionByCodeName(indicator.key, survey)
        return `<td style="width: ${100 / MAX_COLS}%;${styles.tableData}">
        <div style="${styles.indicatorWrapper}">
      ${
        achievements.some(a => a.indicator === indicator.key)
          ? achievementIcon
          : ''
      }
      ${priorities.some(p => p.indicator === indicator.key) ? priorityIcon : ''}
      <div style="${styles.ball}background-color:${color};"></div>
      <span style="${styles.indicatorName}">${title}</span>
      <div>
    </td>`
      })
      .join('')}
  </tr>`
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
  const reportTitle = getReportTitle(draft)

  return `<div style="${styles.wrapper}">
            <h2 style="${styles.participantName}">${reportTitle}, Life map</h2>
            <h2 style="${styles.date}">Created on: ${dateCreated}</h2>
        </div>
        <table style="${styles.table}">${indicatorsList
    .map((indicator, index) => {
      if (index % MAX_COLS === 0) {
        return createTableRow(
          indicatorsList.slice(index, index + MAX_COLS),
          survey,
          achievements,
          priorities
        )
      }
    })
    .join('')}
        </table>`
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
