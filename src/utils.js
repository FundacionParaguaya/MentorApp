export const replaceSpecialChars = text => {
  const SYMBOLS_MAP = {
    'Ã³': 'ó',
    'Ã¼': 'ü',
    'Ã¤': 'ä',
    'Ã¶': 'ö',
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã±': 'ñ',
    'Ã\u00ad': 'í'
  }

  let textToBeCleaned = JSON.stringify(text)
  for (const symbol in SYMBOLS_MAP) {
    if (SYMBOLS_MAP.hasOwnProperty(symbol)) {
      const CORRECT_CHAR_FROM_MAP = SYMBOLS_MAP[symbol]
      textToBeCleaned = textToBeCleaned.replace(
        new RegExp(symbol, 'g'),
        CORRECT_CHAR_FROM_MAP
      )
    }
  }
  return JSON.parse(textToBeCleaned)
}
