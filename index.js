// The container is the id of a containing html element and
// routes is an object containing the names of routes matched with
// string, html elements or functions returning one of those two types.
// Options include a header, a footer, a debug option
function Router(container, routes, options = {}) {
  this.routes = routes
  this.errorHTML = options.errorHTML
    ? options.errorHTML
    : '<div>Not Found</div>'
  // The container holds the router as well as the header and footer if
  // they are also present
  this.container = document.getElementById(container)
  // The router is attached to the window so that it can be accessed easily
  window.router = this

  // This function will handle all of the necessary kinds of types used
  // by different routes and will append them to an anchor element. The
  // value of element can be a string, an html element or a function
  const _appendComponent = (elementName, element, anchor, opts = {}) => {
    if (opts.clearAnchor) {
      // The clearAnchor option is used if the entire contents of innerHtml
      // need to be replaced
      anchor.innerHTML = ''
    }
    // A reference to the appended element is stored in this object
    this[elementName] = element
    if (typeof element === 'string') {
      const createdElement = document.createElement('div')
      createdElement.innerHTML = element
      anchor.appendChild(createdElement)
    } else if (typeof element === 'function') {
      const generated = element()
      _appendComponent(elementName, generated, anchor, opts)
    } else {
      anchor.appendChild(element)
    }
  }

  // This is the function that handles the actual client side routing
  const _goTo = (route, fromOnPushState, search = window.location.search) => {
    // The history should only be modified if the call of this function
    // is not from the onPushState event handler
    if (!(fromOnPushState && typeof fromOnPushState === 'boolean')) {
      window.history.pushState(
        {},
        route,
        window.location.origin + route + search
      )
    }
    if (this.routes[route]) {
      _loadSuccess(route)
    } else {
      // match url with params here
      const sameLength = []
      const splitCurrent = route.split('/')
      for (const key in this.routes) {
        const storedRoute = key.split('/')
        if (storedRoute.length === splitCurrent.length) {
          sameLength.push(storedRoute)
        }
      }

      for (let key of sameLength) {
        const params = {}
        if (_isRelativeMatch(splitCurrent, key, params)) {
          console.log('params', params)
          return _loadSuccess(key.join('/'))
        }
      }
      // if no route with params, run code below
      _loadError(route)
    }
  }
  // This function isn't used much here, but allows navigation with window.router
  this.goTo = _goTo

  const _loadSuccess = route => {
    _appendComponent('currentView', this.routes[route], _routerContainer, {
      clearAnchor: true,
    })
    if (options.debug) {
      console.log('%cNavigated to: ' + route, 'color: green; font-size: 14px;')
    }
    _replaceLinks(_routerContainer)
  }

  // This function is only used for attaching the error page if an error occurs
  const _loadError = route => {
    _appendComponent('currentView', this.errorHTML, _routerContainer, {
      clearAnchor: true,
    })
    if (options.debug) {
      console.error('Route not found: ' + route)
    }
  }
  // This is just a helper function that checks if a url and relative one match
  function _isRelativeMatch(entered, key, params) {
    for (let i = 0; i < entered.length; i++) {
      if (key[i][0] !== ':' && entered[i] !== key[i]) {
        return false
      }
      if (key[i][0] === ':') {
        params[key[i].slice(1)] = entered[i]
      }
    }
    return true
  }

  // This function replaces all anchor elements that have a class of 'router-link'
  // with links that use client side routing instead of making requests to a server
  const _replaceLinks = containerForReplacement => {
    containerForReplacement.querySelectorAll('.router-link').forEach(link => {
      const linkPath = link.pathname
      const search = link.search
      link.onclick = () => _goTo(linkPath, false, search)
      link.href = 'javascript:void(null);'
    })
  }

  // Below, all of the provided components are appended to the container if they are needed
  if (options.header) {
    _appendComponent('header', options.header, this.container)
  }

  const _routerContainer = document.createElement('div')
  this.container.appendChild(_routerContainer)

  if (options.footer) {
    _appendComponent('footer', options.footer, this.container)
  }

  // When the page first loads, these to functions are called to make the router load
  // the correct page
  this.goTo(window.location.pathname, true)
  _replaceLinks(document)

  if (options.debug) {
    console.log(
      '%cRouter Initialized with Routes: ' +
        Object.keys(this.routes).join(', '),
      'color: blue; font-size: 14px;'
    )
    console.log(
      '%cCurrent Path: ' + window.location.pathname,
      'color: orange; font-size: 14px;'
    )
  }
  // This is added so that the router navigates correctly when the user uses
  // built-in browser functions
  window.onpopstate = () => window.router.goTo(window.location.pathname, true)
}

export default Router
