function Router(container, routes, options) {
  if (options.header) {
    const header = document.createElement('div');
    header.innerHTML = options.header;
    this.header = header;
  }
  this.router = document.createElement('div');
  if (options.footer) {
    const footer = document.createElement('div');
    footer.innerHTML = options.footer;
    this.footer = footer;
  }
  this.routes = routes;
  this.errorHTML = options.errorHTML
    ? options.errorHTML
    : '<div>Not Found</div>';

  this.goTo = function(route) {
    window.history.pushState({}, route, `${window.location.origin}${route}`);
    this.router.innerHTML = routes[window.location.pathname];
    if (this.routes[window.location.pathname]) {
      this.router.innerHTML = this.routes[window.location.pathname];
      if (options.debug) {
        console.log(
          `%cNavigated to: ${route}`,
          'color: green; font-size: 14px;',
        );
      }
      this.router.querySelectorAll('.router-link').forEach(link => {
        link.onclick = this.goTo.bind(this, link.pathname);
        link.href = 'javascript:void(null);';
      });
    } else {
      this.router.innerHTML = this.errorHTML;
      if (options.debug) {
        console.error(`Route not found: ${route}`);
      }
    }
  };

  window.onload = () => {
    window.router = this;
    this.container = document.getElementById(container)
    if (this.header) {
      this.container.appendChild(this.header);
    }
    this.container.appendChild(this.router);
    if (this.footer) {
      this.container.appendChild(this.footer);
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
    document.querySelectorAll('.router-link').forEach(link => {
      link.onclick = this.goTo.bind(this, link.pathname);
      link.href = 'javascript:void(null);';
    });
  };
}

module.exports = Router;
