const AnsiStyles = require("ansi-styles");
const {
  cursorUp,
  cursorDown,
  eraseEndLine,
  cursorSavePosition,
  cursorRestorePosition,
} = require("ansi-escapes");

const { drawNyan, prepareNyan } = require("./nyan");
const { drawRainbow, rainbow } = require("./rainbow");
const { NYAN_TEMPLATE, NYAN_SAYS_TEMPLATE } = require("./nyan");

const defaultTemplate = prepareNyan({ template: NYAN_TEMPLATE });

const stars1 = [
  '              ',
  '          ✨✨',
  '       ✨✨✨ ',
  '          ✨✨'
];

const stars2 = [
  '              ',
  '     ✨✨✨   ',
  '  ✨✨✨✨✨✨',
  '     ✨✨✨   '
];

const stars3 = [
  '              ',
  ' ✨✨         ',
  '✨✨✨        ',
  ' ✨✨         '
];

const starsFinal = [
  '🌟  ✨✨   🌟 ✨ ✨✨',
  '✨✨✨   🌟    🌟  🌟',
  '✨✨ 🌟 🌟 ✨✨  🌟  ',
  '✨  🌟  ✨ 🌟 ✨ ✨✨',
];

const onProgress = ({ progress, messages, step, isInProgress, options, stdoutLineCount }) => {
  const { getProgressMessage, logger, nyanCatSays, restoreCursorPosition, width } = options;
  const progressWidth = Math.ceil(progress * width);
  const nyanText = nyanCatSays(progress, messages);

  if (isInProgress) {
    if (restoreCursorPosition || nyanText) {
      logger(cursorSavePosition + cursorUp(1));
    }

    logger(cursorUp(rainbow.length + stdoutLineCount + 2));
  } else {
    logger("");
  }

  for (let i = 0; i < rainbow.length; i++) {
    const nyanLine = i + (step % 8 < 4 ? -1 : 0);
    const starsFinalLine = starsFinal[nyanLine] || "";

    let line = nyanText
      ? starsFinalLine
      : drawRainbow({ colors: rainbow[i], width: progressWidth, step });

    if (nyanLine < 4 && nyanLine >= 0) {
      const nyan = nyanText
        ? prepareNyan({ template: NYAN_SAYS_TEMPLATE, text: nyanText })
        : defaultTemplate;

      if (!nyanText) {
        const ones = Math.round(progress * 100)
          .toString()
          .slice(-1);

        if (["1", "2", "3", "4"].includes(ones)) {
          line = line += stars2[nyanLine];
        } else if (["5", "6", "7"].includes(ones)) {
          line = line += stars3[nyanLine];
        } else {
          line = line += stars1[nyanLine];
        }
      }

      line = drawNyan({ nyan, line, index: nyanLine, step });

      if (nyanText) {
        line = `${line} ${starsFinalLine}`;
      }
    }

    logger(line + eraseEndLine);
  }

  logger(
    getProgressMessage(progress, messages, AnsiStyles) +
      eraseEndLine +
      (!isInProgress ? cursorDown(1) : "")
  );

  if (!isInProgress) {
    return;
  }

  if (restoreCursorPosition) {
    logger(cursorRestorePosition + cursorUp(1));
  } else if (stdoutLineCount > 0) {
    logger(cursorDown(stdoutLineCount - 1));
  }
};

module.exports = {
  onProgress,
};
