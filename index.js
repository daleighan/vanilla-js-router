function Router(container, routes, debug, errorHTML) {
  this.router = document.createElement('div');
  this.routes = routes;
  this.errorHTML = errorHTML ? errorHTML : '<div>Not Found</div>';

  this.goTo = function(route) {
    window.history.pushState({}, route, `${window.location.origin}${route}`);
    this.router.innerHTML = routes[window.location.pathname];
    if (this.routes[window.location.pathname]) {
      this.router.innerHTML = this.routes[window.location.pathname];
      if (debug) {
        console.log(
          `%cNavigated to: ${route}`,
          'color: green; font-size: 14px;',
        );
      }
    } else {
      this.router.innerHTML = this.errorHTML;
      if (debug) {
        console.error(`Route not found: ${route}`);
      }
    }
  };

  window.onload = () => {
    window.router = this;
    document.getElementById(container).appendChild(this.router);
    this.goTo(window.location.pathname);
    if (debug) {
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
    document
      .querySelectorAll('.router-link')
      .forEach(link => (link.href = 'javascript:void(null);'));
  };
}

module.exports = Router;
