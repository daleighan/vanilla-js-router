function Router(container, routes) {
  this.router = document.createElement('div');
  this.routes = routes;
  console.log('Router Initialized with Routes: ', Object.keys(this.routes).join(', '));
  console.log('Current Path: ', window.location.pathname)
  document.getElementById(container).appendChild(this.router);
  this.router.innerHTML = this.routes[window.location.pathname.replace(/\/$/, "")] || '<div>Not Found</div>';
}

module.exports = Router;
