function parse(state, args, report) {
  let maxI = args[0](state)
  if(isNaN(parseInt(maxI))) return report.error('Error in repeat command: "'+maxI+'" is not a number')
  
  let res = ""
  for(let i=0;i<maxI;i++)
    res += args[1]({...state, i: i})
  
  return res
}
module.exports = {code: parse}