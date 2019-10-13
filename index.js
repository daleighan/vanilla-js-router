function Router(container, routes, options) {

  function _appendComponent(elementName, element, anchor, opts) {
    if (opts && opts.clearAnchor) {
      anchor.innerHTML = '';
    }
    this[elementName] = element;
    if (typeof element === 'string') {
      const createdElement = document.createElement('div');
      createdElement.innerHTML = element;
      anchor.appendChild(createdElement);
    } else {
      anchor.appendChild(element);
    }
  }

  function _goTo(route) {
    window.history.pushState({}, route, `${window.location.origin}${route}`);
    if (this.routes[window.location.pathname]) {
      _appendComponent.call(
        this,
        'currentView',
        routes[window.location.pathname],
        _routerContainer,
        {clearAnchor: true},
      );
      if (options.debug) {
        console.log(
          `%cNavigated to: ${route}`,
          'color: green; font-size: 14px;',
        );
      }
      _replaceLinks.call(this, _routerContainer);
    } else {
      _appendComponent.call(
        this,
        'currentView',
        this.errorHTML,
        _routerContainer,
        {clearAnchor: true},
      );
      if (options.debug) {
        console.error(`Route not found: ${route}`);
      }
    }
  }

  this.goTo = _goTo.bind(this);

  function _replaceLinks(containerForReplacement) {
    containerForReplacement.querySelectorAll('.router-link').forEach(link => {
      link.onclick = this.goTo.bind(this, link.pathname);
      link.href = 'javascript:void(null);';
    });
  }

  const _routerContainer = document.createElement('div');

  this.routes = routes;
  this.errorHTML = options.errorHTML
    ? options.errorHTML
    : '<div>Not Found</div>';

  window.onload = () => {
    window.router = this;
    this.container = document.getElementById(container);
    if (options.header) {
      _appendComponent.call(this, 'header', options.header, this.container);
    }
    this.container.appendChild(_routerContainer);
    if (options.footer) {
      _appendComponent.call(this, 'footer', options.footer, this.container);
    }
    this.goTo(window.location.pathname);
    if (options.debug) {
      console.log(
        `%cRouter Initialized with Routes: ${Object.keys(this.routes).join(
          ', ',
        )}`,
        'color: blue; font-size: 14px;',
      );
      console.log(
        `%cCurrent Path: ${window.location.pathname}`,
        'color: orange; font-size: 14px;',
      );
    }
    _replaceLinks.call(this, document);
  };
}

module.exports = Router;
