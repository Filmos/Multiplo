async function parse(state, args, report) {
  return ((""+(await args[1](state))).match(new RegExp(""+(await args[0](state)), "g")) || []).length
}
module.exports = {
  code: parse,
  arguments: ["pattern", "text"],
  description: "Counts how many times $1 appears in $2.",
  examples: ["〈countι,ιAlfa,Beta,Gamma,Delta〉"],
  version: "〈〉ιᛍ"
}