function parse(state, args) {
  return args[0](state)
}
module.exports = {code: parse}