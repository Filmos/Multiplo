async function parse(state, args, report) {
  let val = (await args[0](state))
  if(report.isError(val)) return report.error("Error inside variable name")
  
  val = state.get("variable", val)
  if(val===undefined) return ""
  
  if(args[1]===undefined) return val
  return ""+eval(val+(await args[1](state)))
}
module.exports = {
  code: parse,
  arguments: ["name", "operation"],
  description: "Returns variable with given $1. If variable doesn't exist, \"\" will be returned instead.  \nOptional $2 can be defined, which will be added at the end of the current value and then evaluated. This doesn't change the actual value of the variable, only the return value of this command.",
  examples: ["〈forιiι3ιIteration 〈varιi〉\n〉","〈forιiι5ιIteration 〈varιiι*2+1〉\n〉"],
  version: "〈〉ιᛍ"
}