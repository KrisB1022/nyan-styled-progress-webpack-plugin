const {
  bold,
  inverse,
  redBright,
  yellowBright,
  greenBright,
  cyanBright,
  bgRedBright,
  bgYellowBright,
  bgGreenBright,
  bgCyanBright,
} = require("ansi-styles");
const { wrap } = require("./utils");

const rainbow = [
  [(t) => wrap(redBright, t), (t) => t.replace(/./g, " ")],
  [
    (t) => wrap(bgRedBright, wrap(yellowBright, t)),
    (t) => wrap(bold, wrap(redBright, wrap(bgRedBright, t))),
  ],
  [
    (t) => wrap(bgYellowBright, wrap(greenBright, t)),
    (t) => wrap(bold, wrap(yellowBright, wrap(bgYellowBright, t))),
  ],
  [
    (t) => wrap(bgGreenBright, wrap(cyanBright, t)),
    (t) => wrap(bold, wrap(greenBright, wrap(bgGreenBright, t))),
  ],
  [
    (t) => wrap(inverse, wrap(cyanBright, t)),
    (t) => wrap(bold, wrap(cyanBright, wrap(bgCyanBright, t))),
  ],
];

const wave = ["\u2584", "\u2591"];

const drawRainbow = ({ colors, width, step }) => {
  let idx = step;
  let line = "";
  let text = "";

  for (let i = 0; i < width; i++) {
    text += wave[idx % 2];

    if ((step + i) % 4 === 0) {
      line += colors[idx % 2](text);
      text = "";
      idx++;
    }
  }

  return text ? `${line}${colors[idx % 2](text)}` : line;
};

module.exports = {
  rainbow,
  drawRainbow,
};
