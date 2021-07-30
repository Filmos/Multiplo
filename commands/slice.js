async function parse(state, args, report) {
  let a1 = (await args[0](state))
  if(isNaN(parseInt(a1))) return report.error('Error in slice command: "'+a1+'" is not a number')
  a1 = parseInt(a1)
  
  let a2 = (await args[1](state))
  if(!a2) return (""+(await args[2](state))).slice(a1)
  
  if(isNaN(parseInt(a2))) return report.error('Error in slice command: "'+a2+'" is not a number')
  a2 = parseInt(a2)
  return (""+(await args[2](state))).slice(a1, a2)
}
module.exports = {
  code: parse,
  arguments: ["start","end","string"],
  description: "Returns fragment of $3, between $1 and $2 positions. Negative values can also be used for positions, and will be counted from the end of the $3.",
  examples: ["〈sliceι1ι-1ι12345〉", "〈sliceι-2ιι12345〉"],
  version: "〈〉ιᛍ"
}