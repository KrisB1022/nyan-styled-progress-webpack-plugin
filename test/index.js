const NyanStyledProgressPlugin = require("../index");

function loop(progress, onLoop) {
  const finished = onLoop(progress);

  if (!finished) {
    progress += 0.000003;
    process.nextTick(loop.bind(null, progress, onLoop));
  }
}

function handleTestPlugin(plugin, done) {
  plugin.handler(0, "started");

  loop(0.01, (progress) => {
    if (progress < 1) {
      plugin.handler(progress, `progress: ${progress}`);
    } else {
      plugin.handler(1, "finished");
      done();
    }

    return progress >= 1;
  });
}

describe("Nyan Plugin", () => {
  it("works with default options", (done) => {
    const plugin = new NyanStyledProgressPlugin();
    handleTestPlugin(plugin, done);
  });

  it("works with large debounce interval", (done) => {
    const plugin = new NyanStyledProgressPlugin({ debounceInterval: 1000 });
    handleTestPlugin(plugin, done);
  });

  it("works with small debounce interval", (done) => {
    const plugin = new NyanStyledProgressPlugin({ debounceInterval: 50 });
    handleTestPlugin(plugin, done);
  });

  it("works with long extraneous console output", (done) => {
    let i = 0;
    const plugin = new NyanStyledProgressPlugin({ debounceInterval: 50 });

    loop(0.01, (progress) => {
      if (progress < 1) {
        plugin.handler(progress, `progress: ${progress}`);
      } else {
        plugin.handler(1, "finished");
        console.log("extraneous message on end");
        done();
      }
      if (i === 1000) {
        for (let j = 1; j <= 50; j++) {
          console.log(`extraneous message on progress ${j} of 50`);
        }
      }
      i++;

      return progress >= 1;
    });
  });

  it("works with cursor position restoring", (done) => {
    const plugin = new NyanStyledProgressPlugin({
      debounceInterval: 50,
      restoreCursorPosition: true,
    });
    handleTestPlugin(plugin, done);
  });

  it("works with custom message", (done) => {
    const plugin = new NyanStyledProgressPlugin({
      getProgressMessage: (_progress, message) => {
        return `Nyan cat says: "${message}"`;
      },
      nyanCatSays: (progress) => {
        return progress === 1 ? "My work here is done!" : (progress * 100).toFixed(1);
      },
    });

    handleTestPlugin(plugin, done);
  });
});
