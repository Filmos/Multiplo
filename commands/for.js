function parse(state, args, report) {
  let iterator = args[0](state)
  let maxI = args[1](state)
  if(isNaN(parseInt(maxI))) return report.error('Error in repeat command: "'+maxI+'" is not a number')
  
  let separator = ()=>""
  if(args[3]) separator = args[3]
  
  let res = ""
  for(let i=0;i<maxI;i++) {
    let newState = state.set("variable", iterator, i)
    
    res += args[2](newState) + (i+1<maxI?separator(newState):"")
  }
  
  return res
}
module.exports = {
  code: parse,
  arguments: ["iteratorName", "n", "content", "seperator"],
  description: "Repeats $2 times its $3. Loop index (0-based) can be accessed as variable $1.  \nOptional $4 can be defined, which will be placed between each iteration. In here variable $1 is also present, and represents loop index of the previous element.",
  examples: ["〈forιiι15ι+-〉", "〈forιiι3ιIteration 〈varιi〉ι\n〉", "[〈forιiι5ι'item〈varιi〉'ι〈forιjι〈varιiι+1〉ι, ιreserved〉〉]"],
  version: "〈〉ιᛍ"
}