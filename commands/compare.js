async function parse(state, args, report) {
  let a1 = (await args[0](state))
  try {a1 = eval(a1)}
  catch(e) {return report.error('Error in compare command ('+a1+'): '+e)}
  if(isNaN(parseFloat(a1))) return report.error('Error in compare command: "'+a1+'" is not a number')
  a1 = parseFloat(a1)
  
  let a2 = (await args[1](state))
  try {a2 = eval(a2)}
  catch(e) {return report.error('Error in compare command ('+a2+'): '+e)}
  if(isNaN(parseFloat(a2))) return report.error('Error in compare command: "'+a2+'" is not a number')
  a2 = parseFloat(a2)

  if(a1<a2) return (await args[2](state))
  if(a1>a2) return (await args[4](state))
  return (await args[3](state))
}
module.exports = {
  code: parse,
  arguments: ["a","b","ifLess","ifEqual","ifGreater"],
  description: "Compares $1 and $2 and returns proper value ($1<$2: $3, $1=$2: $4, $1>$2: $5).  \nShorthand for 〈ifι$1<$2ι$3ι〈ifι$1>$2ι$5ι$4〉〉",
  examples: ["〈forιiι10ι〈compareι〈varιi〉ι4ιlessιequalιgreater〉 (〈varιi〉)ι, 〉"],
  version: "〈〉ιᛍ"
}
