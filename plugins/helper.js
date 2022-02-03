function isURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
  ) // fragment locator
  return !!pattern.test(str)
}

const imgPath ='http://localhost:3000/uploads/'
export default ({ app }, inject) => {
  inject('getUrl', function (url, id) {
    if (
      typeof url === 'object' &&
      (url instanceof File || url instanceof Blob)
    ) {
      const fr = new FileReader()
      fr.onload = function (event) {
        document.getElementById(id).src = event.target.result
      }
      fr.readAsDataURL(url)
    }
    if (isURL(url)) {
      return url
    } else {
      return imgPath + url
    }
  })

  inject('isTouchDevice', function () {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    )
  })

  inject('setLocal', function (name, item, stringfiy = true, alwase = true) {
    if (stringfiy && item) {
      item = JSON.stringify(item)
    }
    if (alwase) {
      localStorage.setItem(name, item)
    } else {
      sessionStorage.setItem(name, item)
    }
    return true
  })
  inject('getLocal', function (name, parse = true) {
    let item = localStorage.getItem(name) || sessionStorage.getItem(name)
    if (item && parse) {
      item = JSON.parse(item)
    }
    return item
  })
  inject('shallowEqual', function (object1, object2) {
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)
    if (keys1.length !== keys2.length) {
      return false
    }
    for (const key of keys1) {
      if (object1[key] !== object2[key]) {
        return false
      }
    }
    return true
  })
  inject('round', function (num) {
    return Math.round(num)
  })
  function objectToFormData(obj, form = null, namespace = null) {
    const fd = form || new FormData()
    let formKey

    for (const property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        if (namespace) {
          formKey = namespace + '[' + property + ']'
        } else {
          formKey = property
        }

        // if the property is an object, but not a File,
        // use recursivity.
        if (Array.isArray(obj[property])) {
          fd.append(formKey, JSON.stringify(obj[property]))
        } else if (
          typeof obj[property] === 'object' &&
          !(obj[property] instanceof File) &&
          !(obj[property] instanceof Blob)
        ) {
          if (obj[property] == null) {
            fd.append(formKey, '')
          }
          objectToFormData(obj[property], fd, property)
        } else {
          // if it's a string or a File object
          fd.append(formKey, obj[property] || '')
        }
      }
    }
    return fd
  }
  inject('objectToFormData', objectToFormData)
  inject('localeDate', function (date = new Date()) {
    return date.toLocaleDateString('ar-EG-u-nu-latn', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  })

  inject('info', function () {
    const agent = {
      browser: {
        name: null,
        version: null,
        v: null,
        userAgent: null,
        app: null,
        os: null,
      },
      mobile: false,
      pointlock: false,
    }

    //  var nVer = navigator.appVersion;
    const nAgt = navigator.userAgent
    let browserName = navigator.appName
    let fullVersion = '' + parseFloat(navigator.appVersion)
    let majorVersion = parseInt(navigator.appVersion, 10)
    let nameOffset, verOffset, ix
    agent.pointlock =
      'pointerLockElement' in document ||
      'mozPointerLockElement' in document ||
      'webkitPointerLockElement' in document

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
      browserName = 'Opera'
      fullVersion = nAgt.substring(verOffset + 6)
      if ((verOffset = nAgt.indexOf('Version')) !== -1)
        fullVersion = nAgt.substring(verOffset + 8)
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.includes('MSIE')) !== -1) {
      browserName = 'Microsoft Internet Explorer'
      fullVersion = nAgt.substring(verOffset + 5)
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
      browserName = 'Chrome'
      fullVersion = nAgt.substring(verOffset + 7)
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
      browserName = 'Safari'
      fullVersion = nAgt.substring(verOffset + 7)
      if ((verOffset = nAgt.indexOf('Version')) !== -1)
        fullVersion = nAgt.substring(verOffset + 8)
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
      browserName = 'Firefox'
      fullVersion = nAgt.substring(verOffset + 8)
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if (
      (nameOffset = nAgt.lastIndexOf(' ') + 1) <
      (verOffset = nAgt.lastIndexOf('/'))
    ) {
      browserName = nAgt.substring(nameOffset, verOffset)
      fullVersion = nAgt.substring(verOffset + 1)
      if (browserName.toLowerCase() === browserName.toUpperCase()) {
        browserName = navigator.appName
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) !== -1)
      fullVersion = fullVersion.substring(0, ix)
    if ((ix = fullVersion.indexOf(' ')) !== -1)
      fullVersion = fullVersion.substring(0, ix)

    majorVersion = parseInt('' + fullVersion, 10)
    if (isNaN(majorVersion)) {
      fullVersion = '' + parseFloat(navigator.appVersion)
      majorVersion = parseInt(navigator.appVersion, 10)
    }
    agent.browser.name = browserName
    agent.browser.version = fullVersion
    agent.browser.v = majorVersion
    agent.browser.app = navigator.appName
    agent.browser.userAgent = navigator.userAgent
    let OSName = 'Unknown OS'
    if (navigator.appVersion.includes('Win')) OSName = 'Windows'
    if (navigator.appVersion.includes('Mac')) OSName = 'MacOS'
    if (navigator.appVersion.includes('X11')) OSName = 'UNIX'
    if (navigator.appVersion.includes('Linux')) OSName = 'Linux'

    agent.browser.os = OSName
    agent.mobile =
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.includes('IEMobile')

    return agent
  })
}
