const webpack = require("webpack");
const { onProgress } = require("./progress");

let stdoutLineCount = 0;

const defaultOptions = {
  debounceInterval: 180,
  hookStdout: true,
  logger: console.log,
  nyanCatSays: (progress) => progress === 1 && "Nyan! Build Complete!",
  getProgressMessage: (percentage, messages, styles) => {
    const { cyan, green } = styles;
    const [statusText, successText] = messages;

    if (percentage === 1) {
      return `${cyan.open}You Nyaned for${cyan.close} ${green.open}${successText}${green.close}`;
    }

    return `${cyan.open}Nyaning... Time: ${statusText}s - Completed ${Math.ceil(
      percentage * 100
    )}%${cyan.close}`;
  },
  width: Math.abs(process.stdout.columns - 60),
};

function NyanProgressPlugin(overrideOptions) {
  let isPrintingProgress = false;
  let isStarted = false;
  let originalStdoutWrite;
  let shift = 0;
  let startTime = 0;
  let timer = 0;

  const options = {
    ...defaultOptions,
    ...overrideOptions,
  };

  if (options.hookStdout) {
    originalStdoutWrite = process.stdout.write;
    process.stdout.write = function (msg) {
      originalStdoutWrite.apply(process.stdout, arguments);

      if (isStarted && !isPrintingProgress) {
        stdoutLineCount += msg.split("\n").length - 1;
      }
    };
  }

  const handler = (progress, message) => {
    const now = new Date().getTime();
    const timePassed = (now - startTime) / 1000;

    if (!isStarted) {
      onProgress({
        options,
        progress,
        stdoutLineCount,
        isInProgress: false,
        messages: [message],
        step: shift++,
      });

      startTime = now;
      isStarted = true;

      return;
    }

    if (progress === 1) {
      isPrintingProgress = true;

      onProgress({
        options,
        progress,
        stdoutLineCount,
        isInProgress: true,
        messages: [message, `${timePassed}s`],
        step: shift++,
      });

      isPrintingProgress = false;

      if (originalStdoutWrite) {
        process.stdout.write = originalStdoutWrite;
      }

      stdoutLineCount = 0;
      isStarted = false;

      return;
    }

    if (now - timer > options.debounceInterval) {
      isPrintingProgress = true;
      timer = now;

      onProgress({
        options,
        progress,
        stdoutLineCount,
        isInProgress: true,
        messages: [timePassed],
        step: shift++,
      });

      isPrintingProgress = false;
    }
  };

  return new webpack.ProgressPlugin({
    handler,
  });
}

module.exports = NyanProgressPlugin;
