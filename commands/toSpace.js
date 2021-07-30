async function parse(state, args, report) {
  let spacename = (await args[0](state))
  if(report.isError(spacename)) return report.error("Error inside spacename")
  
  val = state.get("space", spacename) || ""
  state.push("space", spacename, val+""+(await args[1](state)))
  
  return ""
}
module.exports = {
  code: parse,
  arguments: ["spacename","content"],
  description: "Adds $2 to a space with name $1, which can later be accessed with `readSpace` command.",
  examples: ["〈forιiι5ιHi 〈indexᛍnameι〈varιi〉ιAdamιMonikaιStefanιRichardιBob〉! 〈toSpaceιgreetedι〈varιname〉, 〉〉\nGreeted 〈readSpaceιgreeted〉"],
  version: "〈〉ιᛍ"
}

