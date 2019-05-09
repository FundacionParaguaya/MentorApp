const msp = (dimensions, limit) => {
  return (
    dimensions.scale * dimensions.width >= limit ||
    dimensions.scale * dimensions.height >= limit
  )
}

export const isPortrait = dimensions => {
  return dimensions.height >= dimensions.width
}

export const isLandscape = dimensions => {
  return dimensions.width >= dimensions.height
}

export const isTablet = dimensions => {
  return (
    (dimensions.scale < 2 && msp(dimensions, 912)) ||
    (dimensions.scale >= 2 && msp(dimensions, 1824))
  )
}

export const isPhone = dimensions => {
  return !isTablet()
}
