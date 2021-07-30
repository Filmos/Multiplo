async function parse(state, args, report) {
  let cond = (await args[0](state))
  if(report.isError(cond)) return report.error("Error inside if condition")
  try {
    let retInd = (eval(cond)?1:2)
    if(!args[retInd]) return ""
    let val = (await args[retInd](state))
    return val
  }
  catch(e) {return report.error('Error in if command: '+e)}
}
module.exports = {
  code: parse,
  arguments: ["condition", "ifTrue", "ifFalse"],
  description: "If $1 is true (checked by evaluating as javascript), returns $2. Otherwise returns $3.  \n$3 is potional and defaults to \"\".",
  examples: ["〈forιiι5ι〈ifι〈varιi〉%2==0ιHey! ιHo! 〉〉"],
  version: "〈〉ιᛍ"
}