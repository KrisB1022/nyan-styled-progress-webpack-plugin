# nyan-styled-progress-webpack-plugin

###### _Meow (forked from [Alexkuz](https://github.com/alexkuz/nyan-progress-webpack-plugin))_

<img src="Nyan Building.png" width="500px" />
<br/>
<br/>
<img src="Nyan Completed.png" width="500px" />

## Install

```
$ npm i -D nyan-styled-progress-webpack-plugin

$ yarn add nyan-styled-progress-wegpack-plugin --dev
```

## Usage

```javascript
// weback.config.js
const webpack = require("webpack");
const NyanProgressPlugin = require("nyan-progress-webpack-plugin");

module.exports = {
  plugins: [new NyanProgressPlugin(options)],
};
```

###### This plugin uses [webpack progress-plugin](https://webpack.js.org/plugins/progress-plugin/) under the hood.

## Options

| Name                    | type                                   | Default                            | Description                                                                                                                                   |
| ----------------------- | -------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger`                | `Function`                             | console.log                        | Used for logging messages to command line                                                                                                     |
| `width`                 | `Number`                               | process.stdout.columns             | Helps determine the width of nyan cat and rainbow                                                                                             |
| `hookStdout`            | Boolean                                | `true`                             | If `true`, patches `process.stdout.write` during progress and counts extraneous log messages, to position Nyan Cat properly                   |
| `getProgressMessage`    | `Function(progress, messages, styles)` | (progress, messages, styles) => {} | Gets custom progress message. `styles` is provided for convenience (exported from [ansi-styles](https://github.com/chalk/ansi-styles) module) |
| `debounceInterval`      | `Number`                               | 180                                | Defines how often `getProgressMessage` is called (in milliseconds)                                                                            |
| `nyanCatSays`           | `Function(progress, messages)`         | (progress, messages) => {}         | function to define what nyan cat is saying                                                                                                    |
| `restoreCursorPosition` | `Boolean`                              | false                              | Enable this flag, if your terminal supports saving/restoring cursor position, for better output handling                                      |
