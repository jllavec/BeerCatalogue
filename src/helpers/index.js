export const alcoholEmoji = (beer) => {
  if (beer.abv > 15) return '🤢'
  else if (beer.abv <= 15 && beer.abv > 8) return '🥴'
  else if (beer.abv <= 8 && beer.abv > 3) return '😊'
  else return '🙂'
}

export const lockScroll = () => {
  const scrollY = window.scrollY
  const body = document.body
  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.width = '100%'
}

export const unlockScroll = () => {
  const body = document.body
  const scrollY = body.style.top
  body.style.position = ''
  body.style.top = ''
  body.style.width = ''
  window.scrollTo(0, parseInt(scrollY || '0') * -1)
}
