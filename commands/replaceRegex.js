async function parse(state, args, report) {
  let regexp = ""+(await args[0](state))
  return (""+(await args[2](state))).replace(new RegExp(regexp, "g"), (await args[1](state)))
}
module.exports = {
  code: parse,
  arguments: ["pattern", "replacement", "text"],
  description: "Replaces all fragments that match $1 in $3 with $2, case sensitive.",
  examples: ["〈replaceRegexι\w+:ιmod:compressed_ι[minecraft:dirt, minecraft:stone, twilight:carminite]〉"],
  version: "〈〉ιᛍ"
}