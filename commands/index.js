function parse(state, args, report) {
  let ind = args[0](state)
  if(isNaN(parseInt(ind))) return report.error('Error in index command: "'+ind+'" is not a number')
  ind = parseInt(ind)+1
  
  if(ind==0 || !args[ind]) return ""
  return args[ind](state)
}
module.exports = {
  code: parse,
  arguments: ["index number", "element 0", "element 1", "element 2", "..."],
  description: "Return $1 element given as next arguments. Overflowing is completely safe, and defaults to \"\".",
  examples: ["〈forιiι3ι〈indexι〈varιi〉ιaιbιcιd〉〉"],
  examplesVersion: "〈〉ι"
}
