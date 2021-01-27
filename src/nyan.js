const { bold, inverse, magentaBright } = require("ansi-styles");
const { wrap } = require("./utils");

const NYAN_TEMPLATE = {
  ascii: [
    '   ,--------,     ',
    '   │▗▝ ▞ ▝ ˄---˄  ',
    ' ~~│ ▞  ▞ ❬.◕‿‿◕.❭',
    '   `w-w---- w w   '
  ],
  colors: [
    '   ggggggggggg    ',
    '   gMMMMMMMggggg  ',
    ' gggMMMMMMgwwwwwwg',
    '   gggggggggggg   '
  ]
};

const NYAN_SAYS_TEMPLATE = {
  ascii: [
    '   ,--------,      ,(-)-.',
    '   │▗▝ ▞ ▝ ˄---˄  / (X) |',
    ' ~~│ ▞  ▞ ❬.◕‿‿◕.❭--(-)-’',
    '   `w-w---- w w           '
  ],
  colors: [
    '   ggggggggggg     w(w)ww',
    '   gMMMMMMMggggg  ww(w)ww',
    ' gggMMMMMMgwwwwwwgww(w)ww',
    '   gggggggggggg           '
  ]
};

const templateColorMap = {
  g: (t) => t,
  M: (t) => wrap(bold, wrap(magentaBright, wrap(inverse, t))),
  w: (t) => wrap(bold, t),
};

const prepareNyan = ({ template, text }) => {
  text = text && text.toString();

  return template.ascii.map((row, idx) => {
    return row
      .replace(/\((.)\)/, (_m, c) => {
        return c === "X" ? text : text.replace(/./g, c);
      })
      .split("")
      .reduce((arr, chr, j) => {
        const color = template.colors[idx][j];
        const last = arr[arr.length - 1];

        if (last && last.colorCode === color) {
          last.text += chr;
          return arr;
        }

        return [
          ...arr,
          {
            colorCode: color,
            color:
              templateColorMap[color] ||
              function (t) {
                return t;
              },
            text: chr,
          },
        ];
      }, []);
  });
};

const drawNyan = ({ nyan, line, index, step }) => {
  return nyan[index].reduce((l, obj) => {
    const text = obj.text.replace(/(w)/gi, (m) => {
      if (step % 5 === 0 || step % 4 === 0) {
        return m.toUpperCase();
      }

      return m;
    });

    return `${l}${obj.color(text)}`;
  }, line);
};

module.exports = {
  prepareNyan,
  drawNyan,
  NYAN_TEMPLATE,
  NYAN_SAYS_TEMPLATE,
};
