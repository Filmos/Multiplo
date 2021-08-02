async function parse(state, args, report) {
  return (""+(await args[2](state))).replace(new RegExp(""+(await args[0](state)), "g"), (await args[1](state)))
}
module.exports = {
  code: parse,
  arguments: ["pattern", "replacement", "text"],
  description: "Replaces all occurences of $1 in $3 with $2, case sensitive.",
  examples: ["〈replaceιIιYouιI really like apples... I think.〉"],
  version: "〈〉ιᛍ"
}