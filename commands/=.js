function parse(state, args, report) {
  return args[0](state)
}
module.exports = {
  code: parse,
  arguments: ["inner"],
  description: "Doesn't do anything on its own, it simply returns its first argument.",
  examples: ["〈=ι123ι234〉"],
  version: "〈〉ιᛍ"
}