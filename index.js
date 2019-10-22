function Router(container, routes, options = {}) {
  const _appendComponent = (elementName, element, anchor, opts) => {
    if (opts && opts.clearAnchor) {
      anchor.innerHTML = ''
    }
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

  const _goTo = (route, fromOnPushState) => {
    // The history should only be modified if the call of this function
    // is not from the onPushState event handler
    if (!(fromOnPushState && typeof fromOnPushState === 'boolean')) {
      window.history.pushState({}, route, window.location.origin + route)
    }
    if (this.routes[route]) {
      _appendComponent('currentView', routes[route], _routerContainer, {
        clearAnchor: true,
      })
      if (options.debug) {
        console.log(
          '%cNavigated to: ' + route,
          'color: green; font-size: 14px;'
        )
      }
      _replaceLinks(_routerContainer)
    } else {
      _appendComponent('currentView', this.errorHTML, _routerContainer, {
        clearAnchor: true,
      })
      if (options.debug) {
        console.error('Route not found: ' + route)
      }
    }
  }
  // This isn't used much here, but allows navigation when using the window.router object
  this.goTo = _goTo

  const _replaceLinks = containerForReplacement => {
    containerForReplacement.querySelectorAll('.router-link').forEach(link => {
      const linkPath = link.pathname
      link.onclick = () => _goTo(linkPath)
      link.href = 'javascript:void(null);'
    })
  }

  const _routerContainer = document.createElement('div')

  this.routes = routes
  this.errorHTML = options.errorHTML
    ? options.errorHTML
    : '<div>Not Found</div>'

  window.router = this
  this.container = document.getElementById(container)

  if (options.header) {
    _appendComponent('header', options.header, this.container)
  }

  this.container.appendChild(_routerContainer)
  if (options.footer) {
    _appendComponent('footer', options.footer, this.container)
  }

  this.goTo(window.location.pathname)
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
  window.onpopstate = () => window.router.goTo(window.location.pathname, true)
}

export default Router
