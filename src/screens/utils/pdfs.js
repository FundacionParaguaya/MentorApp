import colors from '../../theme.json'
import moment from 'moment'
import {
  priorityIcon,
  achievementIcon,
  styles,
  priorityIconWithoutStyles
} from './assets'

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
                  const title = getIndicatorQuestionByCodeName(
                    indicator.key,
                    survey
                  )
                  return `<td style="width: ${100 / MAX_COLS}%;${
                    styles.tableData
                  }">
                              <div style="${styles.indicatorWrapper}">
                            ${
                              achievements.some(
                                a => a.indicator === indicator.key
                              )
                                ? achievementIcon
                                : ''
                            }
                            ${
                              priorities.some(
                                p => p.indicator === indicator.key
                              )
                                ? priorityIcon
                                : ''
                            }
                            <div style="${
                              styles.ball
                            }background-color:${color};"></div>
                            <span style="${
                              styles.indicatorName
                            }">${title}</span>
                            <div>
                          </td>`
                })
                .join('')}
            </tr>`
}

const generatePrioritiesTable = (priorities, dateCreated) => {
  return `<div style="${styles.wrapperPriority}">
            <h2 style="${
              styles.title
            }">My Priorities ${priorityIconWithoutStyles}</h2>
            <h2 style="${styles.date}">Created on: </h2>
          </div>
          <table stye="${styles.tableWithHeader}">
          
            <tr>
              <th style="${styles.tHeader}">Status</th>
              <th style="${styles.tHeader}">Indicator</th>
              <th style="${styles.tHeader}">Why don't you have it</th>
              <th style="${styles.tHeader}">What will you do to get it?</th>
              <th style="${styles.tHeader}">Months required</th>
              <th style="${styles.tHeader}">Review date</th>
            </tr>
            ${priorities
              .map(priority => {
                const { reason, action, estimatedDate, indicator } = priority
                return `<tr>
                          <td style="text-align:center">Status goes here</td>
                          <td style="text-align:center;text-transform:uppercase">${indicator}</td>
                          <td style="text-align:center">${reason}</td>
                          <td style="text-align:center">${action}</td>
                          <td style="text-align:center">${estimatedDate}</td>
                          <td style="text-align:center">${moment(dateCreated)
                            .add(estimatedDate, 'M')
                            .format('DD-MMMM-YYYY')}</td>
                        </tr>`
              })
              .join('')}
            
          </table>`
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
            <h2 style="${styles.title}">${reportTitle}, Life map</h2>
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
        </table>
        ${generatePrioritiesTable(priorities, dateCreated)}
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
