# VidiCore Developer Toolkit - create-react-app

See [Create React App](https://create-react-app.dev/docs/getting-started) for more information on the initial setup.

## Quick Start

```
npx create-react-app my-vdt-app --template @vidispine/vdt@latest
cd my-vdt-app
REACT_APP_VIDISPINE_URL=https://example.myvidispine.com yarn start
```

_(npx comes with yarn 5.2+ and higher, see [instructions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f) for older yarn versions)_

In this example, the project folder will be _my-vdt-app_
and the VidiCore API endpoint will be _https://<span>example</span>.myvidispine.com_.

Then open http://localhost:3000/ to see your app.

## Folder Structure

```
my-vdt-app/
  .vscode/
      extensions.json
      settings.json
  .env
  README.md
  package.json
  node_modules/
  public/
    index.html
    favicon.ico
  src/
    const.js
    index.js
    setupProxy.js
    assets/
      header-logo.svg
      logo.svg
    components/
      ErrorBoundary.js
    pages/
      Login/
      NotFound/
      Root/
      Search/
    themes/
      LightTheme.js
```

For the project to build, these files must exist with exact filenames:

- `public/index.html` is the page template;
- `src/index.js` is the JavaScript entry point.
  You can delete or rename the other files.

You may create subdirectories inside src. For faster rebuilds, only files inside src are processed by webpack. You need to put any JS and CSS files inside src, otherwise webpack won’t see them.

Only files inside public can be used from public/index.html. Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories. They will not be included in the production build so you can use them for things like documentation.

If you have Git installed and your project is not part of a larger repository, then a new repository will be initialized resulting in an additional top-level .git directory.

### `.vscode`

The `extensions.json` and `settings.json` files contain the recommended configuration and extensions to work with eslint and prettier for code linting and autofixing.

### `.env` & `.env.development.local`

- `REACT_APP_VIDISPINE_URL` => Specify the VidiCore API endpoint. (eg _https://<span>example</span>.myvidispine.com_ or _http://<span>localhost</span>:8080_)
- `REACT_APP_TITLE` => Sets the header text.
- `REACT_APP_DOCUMENT_TITLE` => Sets the document.title.

See [here](https://create-react-app.dev/docs/advanced-configuration) for additional settings.

### `setupProxy.js`

During development, a proxy can be used to forward requests to the VidiCore API server.
This avoids needing to make any CORS configuration to start with.

Requests to `/API/` and `/APInoauth/` will be forwarded automatically.

See [here](https://create-react-app.dev/docs/proxying-api-requests-in-development#configuring-the-proxy-manually) for more detail

### `const.js`

This includes variables which are used by several other components in the app.

- `LOGIN_EXPIRES_SECONDS` => This defaults to 14 days (in seconds) but you may need to make sure that the VidiCore API has the [`userTokenMaxInterval`](https://apidoc.vidispine.com/latest/system/property.html#vsvar-userTokenMaxInterval) set to the same value.
- `APP_BASENAME` => The relative root of the application which is used for [react-router](https://reactrouter.com/web/api/BrowserRouter/basename-string). This is important when deploying to GitHub pages.

### `index.js`

The initialization script which mounts the react application at the `root` div element.

There are several nested components:

- `ErrorBoundary` => Will show an error message if the application throws an exception. This can also be added to other child components to catch specific errors (more info [here](https://reactjs.org/docs/error-boundaries.html)).
- `MuiThemeProvider` => Merges the default Material-UI theme with the example (more info [here](https://material-ui.com/styles/api/#themeprovider)).
- `CssBaseline` => Sets a baseline in case there are any user-specific style overrides (more info [here](https://material-ui.com/components/css-baseline/))

### `assets`

SVG logos for the login page and the app bar. These are imported in the `const` file.

### `pages`

These components are used for the `Routes`.

- `Login` => The username/password form which also displays errors if the API server is offline.
- `NotFound`=> Fallback component if no routes are matched.
- `Root` => The list of `Route`'s rendered by react-router (more info [here](https://reactrouter.com/web/api/Route)). It is wrapped in the `AuthProvider` which will render the `Login` component if the user does not have a valid authentication token.
- `Search` => An example search using the [SearchInput](https://vidispine.github.io/vdt/dev/?path=/docs/vdt-materialui-searchinput--search-input) and [ItemList](https://vidispine.github.io/vdt/dev/?path=/docs/vdt-materialui-itemlist--item-list), with the [item.searchItem](https://vidispine.github.io/vdt-api/#itemsearchitem) method implemented as a [React hook](https://reactjs.org/docs/hooks-overview.html).

Each "page" folder contains the main component, plus subfolders for related child components, hooks, or contexts.

### `themes`

The `LightTheme` shows how the set the color palette and override the [styles](https://material-ui.com/customization/components/#global-theme-override) and [default props](https://material-ui.com/customization/globals/#default-props) for both VDT and Material-UI components.

We also use the [`withStyles`](https://material-ui.com/styles/basics/#higher-order-component-api) higher-order component throughout the app to provide a `classes` for styling.

## Scripts

Inside the newly created project, you can run some built-in commands:

#### `yarn start`

Runs the app in development mode. Open http://localhost:3000 to view it in the browser.

The page will automatically reload if you make changes to the code. You will see the build errors and lint warnings in the console.

#### `yarn build`

Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed.
