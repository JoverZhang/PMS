const host = 'http://192.168.43.157:9001/'

function mergeUrl (apis) {
  let cpApis = JSON.parse(JSON.stringify(apis))
  for (const i in apis) {
    if (typeof apis[i] === 'string') {
      cpApis[i] = host + apis[i]
    } else {
      cpApis[i] = mergeUrl(apis[i])
    }
  }
  return cpApis
}

export default (mergeUrl({
  Login: {
    Index: 'Login/'
  },
  Page1: {
    Index: 'Page1/'
  },
  Page2: {
    Index: 'Page2/'
  },
  Page3: {
    Index: 'Page3/'
  },
  Page4: {
    Index: 'Page4/'
  },
  Page5: {
    Index: 'Page5/'
  },
  Page6: {
    Index: 'Page6/'
  }
}))