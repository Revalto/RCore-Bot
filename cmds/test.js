module.exports = {
  regexp: /^(тест)$/i,
  bregexp: /^button(\d)$/i,
  func: async(context) => {
    await context.send(`Что-то`);
  }
};
