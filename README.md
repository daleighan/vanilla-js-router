### Installation

Install with npm using
`npm install @daleighan/vanilla-js-router`

## Usage

To create a router:

```js
import VanillaJSRouter from 'vanilla-js-router';

const router = new VanillaJSRouter(anchorId, routes, options);
```

-- Anchor is a string that is the id of the component that the router will attach to.

-- Routes is an object in the following format:

```js
const routes = {
	[url]: [component],
	[url]: [component],
	...
};
```

- The url is a string that is the relative path of the url for a particular component and the route.
- The component for a route can either be a string of HTML, a function that returns a string of html or a function that returns a DOM node.

-- Options is also an object that looks like this:

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
