async function parse(state, args, report) {
  let val = (await args[0](state))
  try {return ""+eval(val)}
  catch(e) {return report.error('Error in eval command: '+e)}
}
module.exports = {
  code: parse,
  arguments: ["code"],
  description: "Evaluates javascript passed as $1. Especially useful for mathematical operations.",
  examples: ["〈evalι123+5*234〉","〈forιiι3ι23+4*〈varιi〉=〈evalι23+4*〈varιi〉〉ι\n〉"],
  version: "〈〉ιᛍ"
}