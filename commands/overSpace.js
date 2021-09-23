async function parse(state, args, report) {
  let spacename = (await args[0](state))
  if(report.isError(spacename)) return report.error("Error inside spacename")
  
  state.push("space", spacename, ""+(await args[1](state)))
  
  return ""
}
module.exports = {
  code: parse,
  arguments: ["spacename","content"],
  description: "Overwrites the space $1 with $2, which can later be accessed with `readSpace` command.",
  examples: ["〈toSpaceιprettyTextιText〉\nCheck 1: 〈readSpaceιprettyText〉\n〈toSpaceιprettyTextι Something 〈readSpaceιprettyText〉〉\nCheck 2: 〈readSpaceιprettyText〉\n〈overSpaceιprettyTextιPrefixed 〈readSpaceιprettyText〉〉\nCheck 3: 〈readSpaceιprettyText〉"],
  version: "〈〉ιᛍ"
}

