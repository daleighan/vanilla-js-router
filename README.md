# vanilla-js-router

### What is this project?

It is a library for client-side routing that is independent of any other frameworks or libraries. It was created to be used for a single page application is designed to be flexible and lightweight. It provides the functionality of something like react-router without the bloat of using something like the react library. It uses template literals or dom elements as components for each different view. Along with this repository there is also an example application [here](https://github.com/daleighan/vanilla-js-router-example-app) that may be useful in deciphering how to use this .

### Installation

Install with npm using
`npm install @daleighan/vanilla-js-router`

## Usage

To create a router:

```js
import VanillaJSRouter from 'vanilla-js-router';

const router = new VanillaJSRouter(anchorId, routes, options);
```

Anchor is a string that is the id of the component that the router will attach to. Routes is an object in the following format:

```js
const routes = {
	[url]: [route],
	[url]: [route],
	...
}
```

The url is a string that is the relative path of the url for a particular component and the route. The value for a route can either be a string of HTML, a function that returns a string of html or a function that returns a DOM node.
