# Introduction

This is theme should show the capabilities of using content from VidiCore inside of Adobe Premiere Pro. It is written in a boilerplate manner with reactjs, material-ui in order to kick-start feature development for already working VidiCore instances. It also contains debugging tool for easy development.

This theme provides following functionality:

- Connect to a VidiCore instance via API
- Search for assets
- Download assets into Premiere Pro.

This theme is a starter kit for acessing your VidiCore assets in Adobe Premiere Pro and it provides building blocks for extending the CEP extension.

## What you will need:

- VidiCore instance on VidiNet - media management platform [Learn more](https://youtube.com/playlist?list=PLwcCgSUesG-D3Z9oJYBNADHQrMHmBYPng)
- ZXP installer - The third-party program that can be downloaded here: [ZXP installer](https://zxpinstaller.com)
- ZXPSignCMD - Tool for creating certificate and compressing into ZXP packaged that can be downloaded here: [ZXPSignCMD](https://github.com/Adobe-CEP/CEP-Resources/tree/master/ZXPSignCMD)

## Worth to read:

- Getting started with CEP extenstions [Adobe-CEP](https://github.com/Adobe-CEP/Getting-Started-guides)

## Terminology

**React** is a JavaScript library for building user interfaces.

**Material-UI** or **MUI** provides a robust, customizable, and accessible library of foundational and advanced components, enabling you to build your own design system and develop React applications faster.

**CSinterface** - A CommonJS version of the Adobe-CEP/CEP-Resources CSInterface library

**Vulcan** - The Vulcan library implements the IPC Toolkit, which allows you to send and receive messages between applications. (These correspond to the former Flex CSXS, CEP IMS, and Vulcan libraries.)

**VidiNet** - is a cloud-based platform at the heart of the content ecosystem. The foundation for a broad range of applications and services, VidiNet provides a robust footing for the complete content chain.

**ZXP EXTENSION** - A file with the ZXP file extension is an Adobe zip Format Extension Package file which is a kind of
plugin for adobe system applications. ZXP files are compressed ZIP files that were created for installing
with adobe extension manager.

**CEP** - Adobe Common Extensibility Platform - JavaScript libraries for communicating with the operating system and Extension Manager and for communicating with the host application and other extensions.

## Folder structure

Except for the required `CSXS` folder, which must contain a `manifest.xml`, the folder structure is flexible. One recommended way to structure the folders would be:

- `/CSXS` -- contains the `manifest.xml` file, which stores the extension configuration data. As noted above, this is a requirement for your extension to show up in the host app.

- `/client` (vdt-adobe-panel-client) -- contains the front-end HTML, JavaScript, and CSS code, as well as the required Adobe `CSInterface.js` library, and any third-party libraries you might want to include (for example, jQuery).

- `/host` (vdt-adobe-panel-host) -- contains any ExtendScript files (in this case, `index.jsx`) for your extension. These are used to access and drive most features in the host app

This structure allows you to achieve a clear separation of concerns by devoting one folder to each, client-side and host app.

For the project to build, these files must exist with exact filenames:

- `public/index.html` is the page template;
- `src/index.js` is the JavaScript entry point.
  You can delete or rename the other files.

You may create subdirectories inside src. For faster rebuilds, only files inside src are processed by webpack. You need to put any JS and CSS files inside src, otherwise, webpack won’t see them.

Only files inside public can be used from public/index.html. Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories. They will not be included in the production build so you can use them for things like documentation.

If you have Git installed and your project is not part of a larger repository, then a new repository will be initialized resulting in an additional top-level .git directory.

## Scripts

Inside the newly created project, you can run some built-in commands:

#### `yarn start`

Runs the app in development mode. Open http://localhost:3000 to view it in the browser.
The page will automatically reload if you make changes to the code. You will see the build errors and lint warnings in the console.

#### `Debug`

Open http://localhost:7777/ to debug your app.

#### `yarn build`

Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed.

The Adobe Extension manager uses a .zxp package to distribute digital products

Create a basic .zxp package
Add the ZXPSignCmd and the generated certificate in the same folder. Create a folder with the name of your plugin and place the plugin inside.

`ZXPSignCmd -selfSignedCert <countryCode> <stateOrProvince> <organization> <commonName> <password> <outputPath.p12>`

example:
`ZXPSignCmd-64bit' -selfSignedCert US LA Vidispine vdt-panels abc123 MyCert.p12`

## Install Extension

After signing certificate with ZXPSignCmd and creating zxp package you can install it via **ZXP EXTENSION**
Drag your application onto **ZXP EXTENSION** and restart Adobe Premiere Pro. After restart it should app under windows -> Extensions.

## Uninstall Extension

MacOS:
Launch Terminal and run this command:
open /Library/Application\ Support/Adobe/CEP/extensions/
Windows 64:
C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\
Windows 32:
C:\Program Files\Common Files\Adobe\CEP\extensions\
