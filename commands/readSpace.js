async function parse(state, args, report) {
  let spacename = (await args[0](state))
  if(report.isError(spacename)) return report.error("Error inside spacename")
  
  return state.get("space", spacename) || ""
}
module.exports = {
  code: parse,
  arguments: ["spacename"],
  description: "Returns contents of space with name $1.",
  examples: ["〈forιiι5ιHi 〈indexᛍnameι〈varιi〉ιAdamιMonikaιStefanιRichardιBob〉! 〈toSpaceιgreetedι〈varιname〉, 〉〉\nGreeted 〈readSpaceιgreeted〉"],
  version: "〈〉ιᛍ"
}