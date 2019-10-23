// The container is the id of a containing html element and
// routes is an object containing the names of routes matched with
// string, html elements or functions returning one of those two types.
// Options include a header, a footer, a debug option
function Router(container, routes, options = {}) {
  this.routes = routes;
  this.errorHTML = options.errorHTML
    ? options.errorHTML
    : '<div>Not Found</div>';
  // The container holds the router as well as the header and footer if
  // they are also present
  this.container = document.getElementById(container);
  // The router is attached to the window so that it can be accessed easily
  window.router = this;
  // This function will handle all of the necessary types used
  // by different routes and will append them to an anchor element. The
  // value of input elements can be a string, an html element or a function
  const _appendComponent = (elementName, element, anchor, opts = {}) => {
    if (opts.clearAnchor) {
      // The clearAnchor option is used if the entire contents of innerHtml
      // need to be replaced
      anchor.innerHTML = '';
    }
    // A reference to the appended element is stored in this object
    this[elementName] = element;
    if (typeof element === 'string') {
      const createdElement = document.createElement('div');
      createdElement.innerHTML = element;
      anchor.appendChild(createdElement);
    } else if (typeof element === 'function') {
      // Params may be passed to new elements that are created by functions
      const generated = element({ params: opts.params });
      _appendComponent(elementName, generated, anchor, opts);
    } else {
      anchor.appendChild(element);
    }
  };
  // This function replaces all anchor elements that have a class of 'router-link'
  // with links that use client side routing instead of making requests to a server
  const _replaceLinks = containerForReplacement => {
    containerForReplacement.querySelectorAll('.router-link').forEach(link => {
      const linkPath = link.pathname;
      const search = link.search;
      link.onclick = () => _goTo(linkPath, false, search);
      link.href = 'javascript:void(null);';
    });
  };
  // This is the function that handles the actual client side routing
  const _goTo = (route, fromOnPushState, search = window.location.search) => {
    // The history should only be modified if the call of this function
    // is not from the onPushState event handler and not on initial loading
    if (!(fromOnPushState && typeof fromOnPushState === 'boolean')) {
      window.history.pushState(
        {},
        route,
        window.location.origin + route + search,
      );
    }
    if (this.routes[route]) {
      // If the exact path is found in this.routes, it is loaded
      _loadRoute(route);
    } else {
      // Below, the current route is matched with any route in this.routes that contain
      // params that are a match. The initial approach for how this was done is naive,
      // and definitely can and should be improved in the future
      const sameLength = [];
      const splitCurrent = route.split('/');
      // this.routes is searched for keys with the same number of sections
      for (const key in this.routes) {
        const storedRoute = key.split('/');
        if (storedRoute.length === splitCurrent.length) {
          sameLength.push(storedRoute);
        }
      }
      // All the keys that are the same length are checked for relative matches with
      // a helper function. The helper function also puts the values of any params into
      // the params object. If there are multiple matches in sameLength, it will always
      // go with the first match found
      for (let key of sameLength) {
        const params = {};
        if (_isRelativeMatch(splitCurrent, key, params)) {
          // Params are passed below so that they can be used by functions that return
          // elements with content based on them
          return _loadRoute(key.join('/'), params);
        }
      }
      // Only then will the error page be loaded if there are no matches
      _appendComponent('currentView', this.errorHTML, _routerContainer, {
        clearAnchor: true,
      });
      if (options.debug) {
        console.log(
          `%cRoute not found: ${route}`,
          'color: red; font-size: 14px;',
        );
      }
    }
  };
  // This function isn't used much here, but allows navigation with window.router
  this.goTo = _goTo;
  // This is a reusable function for attaching the correct element to the router
  const _loadRoute = (route, params) => {
    _appendComponent('currentView', this.routes[route], _routerContainer, {
      clearAnchor: true,
      params,
    });
    if (options.debug) {
      console.log(`%cNavigated to: ${route}`, 'color: green; font-size: 14px;');
    }
    _replaceLinks(_routerContainer);
  };
  // This is just a helper function that checks if a url and relative one match.
  // A reference to the object used for params must be used as this object
  // is not returned at the end of the function
  function _isRelativeMatch(entered, key, params) {
    for (let i = 0; i < entered.length; i++) {
      if (key[i][0] !== ':' && entered[i] !== key[i]) {
        return false;
      }
      if (key[i][0] === ':') {
        params[key[i].slice(1)] = entered[i];
      }
    }
    return true;
  }
  // Below, all of the provided components are appended to the container if they are included
  if (options.header) {
    _appendComponent('header', options.header, this.container);
  }
  const _routerContainer = document.createElement('div');
  this.container.appendChild(_routerContainer);
  if (options.footer) {
    _appendComponent('footer', options.footer, this.container);
  }
  // When the page first loads, these two functions are called to make the router load
  // the correct view and to replace necessary routes with ones that use this router
  this.goTo(window.location.pathname, true);
  _replaceLinks(document);

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
  // This is added so that the router navigates correctly when the user uses
  // built-in browser navigation
  window.onpopstate = () => _goTo(window.location.pathname, true);
}

export default Router;
