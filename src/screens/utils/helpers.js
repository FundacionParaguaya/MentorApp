const LATIN_CHARS = /^[A-Za-z0-9]*$/

export const checkAndReplaceSpecialChars = question => {
  return {
    ...question,
    options: question.options.map(option => {
      return {
        ...option,
        text: LATIN_CHARS.test(option.text.replace(/\s/g, '')) // check for strange chars and if found decode
          ? option.text
          : decodeURIComponent(option.text)
      }
    })
  }
}
