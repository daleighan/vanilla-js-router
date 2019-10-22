function Router(container, routes, options) {
  if (!options) {
    options = {}
  }
  function _appendComponent(elementName, element, anchor, opts) {
    console.log('elName', elementName)
    if (opts && opts.clearAnchor) {
      anchor.innerHTML = ''
    }
    this[elementName] = element
    if (typeof element === 'string') {
      var createdElement = document.createElement('div')
      createdElement.innerHTML = element
      anchor.appendChild(createdElement)
    } else if (typeof element === 'function') {
      var generated = element()
      _appendComponent.call(this, elementName, generated, anchor, opts)
    } else {
      anchor.appendChild(element)
    }
  }

  function _goTo(route, fromOnPushState) {
    // The history should only be modified if the call of this function is not from the onPushState
    // event handler
    if (!(fromOnPushState && typeof fromOnPushState === 'boolean')) {
      window.history.pushState({}, route, window.location.origin + route)
    }
    if (this.routes[route]) {
      _appendComponent.call(
        this,
        'currentView',
        routes[route],
        _routerContainer,
        { clearAnchor: true }
      )
      if (options.debug) {
        console.log(
          '%cNavigated to: ' + route,
          'color: green; font-size: 14px;'
        )
      }
      _replaceLinks.call(this, this, _routerContainer)
    } else {
      _appendComponent.call(
        this,
        'currentView',
        this.errorHTML,
        _routerContainer,
        { clearAnchor: true }
      )
      if (options.debug) {
        console.error('Route not found: ' + route)
      }
    }
  }

  this.goTo = _goTo.bind(this)

  function _replaceLinks(ctx, containerForReplacement) {
    containerForReplacement
      .querySelectorAll('.router-link')
      .forEach(function(link) {
        link.onclick = _goTo.bind(ctx, link.pathname)
        link.href = 'javascript:void(null);'
      })
  }

  var _routerContainer = document.createElement('div')

  this.routes = routes
  this.errorHTML = options.errorHTML
    ? options.errorHTML
    : '<div>Not Found</div>'

  window.router = this
  this.container = document.getElementById(container)

  if (options.header) {
    _appendComponent.call(this, 'header', options.header, this.container)
  }

  this.container.appendChild(_routerContainer)
  if (options.footer) {
    _appendComponent.call(this, 'footer', options.footer, this.container)
  }

  this.goTo(window.location.pathname)
  _replaceLinks.call(this, this, document)

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
  window.onpopstate = function() {
    window.router.goTo(window.location.pathname, true)
  }
}

export default Router
