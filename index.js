function Router(container, routes, errorHTML) {
  this.router = document.createElement('div');
  this.routes = routes;
  console.log(
    'Router Initialized with Routes: ',
    Object.keys(this.routes).join(', '),
  );
  console.log('Current Path: ', window.location.pathname);
  document.getElementById(container).appendChild(this.router);
  if (this.routes[window.location.pathname]) {
    this.router.innerHTML = this.routes[window.location.pathname];
  } else {
    this.router.innerHTML = errorHTML ? erroHTML : '<div>Not Found</div>';
  }
  this.goTo = function(route) {
    window.history.pushState({}, route, `${window.location.origin}/${route}/`);
    this.router.innerHTML = routes[window.location.pathname];
    if (this.routes[window.location.pathname]) {
      this.router.innerHTML = this.routes[window.location.pathname];
    } else {
      this.router.innerHTML = errorHTML ? erroHTML : '<div>Not Found</div>';
    }
  };
  window.router = this;
}

module.exports = Router;
