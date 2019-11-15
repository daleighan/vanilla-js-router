# vanilla-js-router

### What is this project?

It is a library for client-side routing that is independent of any other frameworks or libraries. It was created to be used for a single page application is designed to be flexible and lightweight. It provides the functionality of something like react-router without the bloat of using something like React. It uses template literals or dom elements as components for each different view. Along with this repository there is also an example application [here](https://github.com/daleighan/vanilla-js-router-example-app) that may be useful in deciphering how to use this .

### Installation

Install with npm using
`npm install @daleighan/vanilla-js-router`

## Usage

#### To create a router:

```js
import VanillaJSRouter from 'vanilla-js-router';

const router = new VanillaJSRouter(anchorId, routes, options);
```

-- anchorId is a string that is the id of the component that the router will attach to.

-- routes is an object in the following format:

```js
const routes = {
	[url]: [component],
	[url]: [component],
	...
};
```

- The url is a string that is the relative path of the url for a particular component and the route.
- The component for a route can either be a string of HTML, a function that returns a string of html or a function that returns a DOM node.

-- options is also an object that looks like this:

```js
const options = {
  debug: [boolean],
  errorHTML: [component],
  header: [component],
  footer: [component],
};
```

- The debug option allows addition information about route changes to be logged in the console.

- errorHTML accepts the same types of components mentioned above and is displayed if the requested url is not found.
- header accepts the same types of components and is placed above the content within the router
- footer accepts the same types of components and is placed below the content within the router

#### Creating components:

As previously mentioned, there are three different ways that components can be provided. They are as follows.

-- As a string:

```js
const Component = '<div>My Component</div>';
```

-- As a function that returns a string or template literal:

```js
function Component() {
  '<div>My Component</div>';
}
```

-- As a function that returns a DOM element:

```js
function Component() {
  const div = document.createElement('div');
  div.textContent = 'My Component';
}
```

#### Path matching:

Currently, path matching is not that sophisticated, but it does allow for exact path matching and matching with params. An example of this:

```js
const routes = {
	'/component': Component1,
	'/component/:id': Component2,
	'/component/:id/:action': Component3,
	...
};
```

The first route would have to be an exact match but the second one could be given any id and the third would has two params. If there is an exact match found for the route, that is prioritized over any route that includes params.

For a route with params, these params can be passed to the component if that component is a function. The way to do that for a route that is given two params is as follows:

```js
function Component3({ params }) {
  const div = document.createElement('div');
  div.textContent = `id: ${params.id}, action: ${params.action}`;
  return project;
}
```

#### Navigating using the router:

There are two ways to navigate with the router.

-- using JavaScript. This can be done with:

```js
window.router.goTo(route);
```

-- adding an HTML anchor element with a class of 'router-link':

```html
<a class="router-link" href="/component">My Link</a>
```

Any HTML elements with that class name will be made to use the router when clicked when a component is loaded.
