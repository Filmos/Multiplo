async function parse(state, args, report) {
  let regexp = ""+(await args[0](state))
  regexp = regexp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  regexp = regexp.replace(/\n/g, '\\n')
  return ((""+(await args[1](state))).match(new RegExp(regexp, "g")) || []).length
}
module.exports = {
  code: parse,
  arguments: ["pattern", "text"],
  description: "Counts how many times $1 appears in $2.",
  examples: ["〈countι,ιAlfa,Beta,Gamma,Delta〉"],
  version: "〈〉ιᛍ"
}