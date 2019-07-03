import colors from '../../theme.json'
import moment from 'moment'

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

export const buildPDFOptions = (draft, survey) => {
  const dateCreated =
    draft &&
    draft.created &&
    moment
      .utc(draft.created)
      .format('DD-MMMM-YYYY')
      .replace(/-/g, ' / ')

  return {
    html: `<div style="display:flex;align-content: space-between;border-bottom: 1px solid #eee;margin-bottom: 20px">
            <h2 style="width: 50%;height:40px;font-size:19px;"><span style="color: #309E43">${getReportTitle(
              draft
            )}</span> , Life map</h2>
            <h2 style="width: 50%;height:40px;margin-left: auto;text-align:right;font-size:19px;">Created on: <span style="color: #309E43">${dateCreated}</span></h2>
        </div>
        <div style="display:flex;flex-wrap: wrap;">
          ${draft.indicatorSurveyDataList
            .map(indicator => {
              return `<div style="width: 20%">
            <div style="width: 70px;height: 70px;margin: 10px auto 10px auto;border-radius: 70px;background-color:${getColor(
              indicator.value
            )}; display: flex;align-items:center;justify-content: center"></div>
            <span style="display:block;text-align: center">${getIndicatorQuestionByCodeName(
              indicator.key,
              survey
            )}</span>
          </div>`
            })
            .join('')}
        </div>
        `,
    fileName: 'LifeMap',
    directory: 'Documents',
    base64: true,
    padding: 0,
    height: 842,
    width: 595
  }
}
