function parse(state, args, report) {
  let a1 = args[0](state)
  try {a1 = eval(a1)}
  catch(e) {return report.error('Error in round command ('+a1+'): '+e)}
  if(isNaN(parseFloat(a1))) return report.error('Error in round command: "'+a1+'" is not a number')
  a1 = parseFloat(a1)
  
  if(!args[1]) return Math.round(a1)

  let a2 = args[1](state)
  try {a2 = eval(a2)}
  catch(e) {return report.error('Error in round command ('+a2+'): '+e)}
  if(isNaN(parseFloat(a2))) return report.error('Error in round command: "'+a2+'" is not a number')
  a2 = parseFloat(a2)

  if(a2==0) return a1
  return Math.round(a1/a2)*a2
}
module.exports = {
  code: parse,
  arguments: ["value","precision"],
  description: "Rounds $1 with given $2. If $2 is not given, it will just round to nearest integer.",
  examples: ["[〈forιiι6ι〈roundι〈varιi〉*1.3333〉ι,〉]", "〈forιiι12ι〈evalι〈varιi〉*0.1〉 -> 〈roundι〈varιi〉*0.1ι0.25〉ι; 〉"],
  version: "〈〉ιᛍ"
}