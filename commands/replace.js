async function parse(state, args, report) {
  let regexp = ""+(await args[0](state))
  regexp = regexp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  regexp = regexp.replace(/\n/g, '\\n')
  return (""+(await args[2](state))).replace(new RegExp(regexp, "g"), (await args[1](state)))
}
module.exports = {
  code: parse,
  arguments: ["pattern", "replacement", "text"],
  description: "Replaces all occurences of $1 in $3 with $2, case sensitive.",
  examples: ["〈replaceιIιYouιI really like apples... I think.〉"],
  version: "〈〉ιᛍ"
}