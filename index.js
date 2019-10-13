function Router(container, routes, debug, errorHTML) {
  this.router = document.createElement('div');
  this.routes = routes;

  this.goTo = function(route) {
    window.history.pushState({}, route, `${window.location.origin}${route}`);
    this.router.innerHTML = routes[window.location.pathname];
    if (this.routes[window.location.pathname]) {
      this.router.innerHTML = this.routes[window.location.pathname];
      if (debug) {
        console.log(`Navigated to: ${route}`);
      }
    } else {
      this.router.innerHTML = errorHTML ? erroHTML : '<div>Not Found</div>';
      if (debug) {
        console.error(`Route not found: ${route}`);
      }
    }
  };

  window.router = this;

  window.onload = () => {
    document.getElementById(container).appendChild(this.router);
    this.goTo(window.location.pathname);
    if (debug) {
      console.log(
        'Router Initialized with Routes: ',
        Object.keys(this.routes).join(', '),
      );
      console.log('Current Path: ', window.location.pathname);
    }
  };
}

module.exports = Router;
