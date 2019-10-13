function Router(container, routes, options) {

  function _appendResource(element, anchor) {
    this[element] = element;
    if (typeof element === 'string') {
      const createdElement = document.createElement('div');
      createdElement.innerHTML = element;
      anchor.appendChild(createdElement);
    } else {
      anchor.appendChild(element);
    }
  }

  function goTo(route) {
    window.history.pushState({}, route, `${window.location.origin}${route}`);
    this.routerContent.innerHTML = routes[window.location.pathname];
    if (this.routes[window.location.pathname]) {
      this.routerContent.innerHTML = this.routes[window.location.pathname];
      if (options.debug) {
        console.log(
          `%cNavigated to: ${route}`,
          'color: green; font-size: 14px;',
        );
      }
      _replaceLinks.call(this, this.routerContent);
    } else {
      this.routerContent.innerHTML = this.errorHTML;
      if (options.debug) {
        console.error(`Route not found: ${route}`);
      }
    }
  };

  this.goTo = goTo.bind(this);

  function _replaceLinks(containerForReplacement) {
    containerForReplacement.querySelectorAll('.router-link').forEach(link => {
      link.onclick = this.goTo.bind(this, link.pathname);
      link.href = 'javascript:void(null);';
    });
  }

  this.routerContent = document.createElement('div');

  this.routes = routes;
  this.errorHTML = options.errorHTML
    ? options.errorHTML
    : '<div>Not Found</div>';

  window.onload = () => {
    window.router = this;
    this.container = document.getElementById(container);
    if (options.header) {
      _appendResource.call(this, options.header, this.container);
    }
    this.container.appendChild(this.routerContent);
    if (options.footer) {
      _appendResource.call(this, options.footer, this.container);
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
