async function parse(state, args, report) {
  let json = (await args[0](state))+""; json = eval("v="+json.trim())
  let oper = (await args[1](state))+""
  let operPref = ""
  if(args[2]) operPref = (await args[2](state))+""
  
  let operFunc = (v)=>{console.log(operPref+v+oper); return eval(operPref+v+oper)}
  function crawl(json) {
    if(Array.isArray(json)) return json.map(operFunc)
    
    let jsonR = {}
    for(let key in json) {
      if(typeof json[key] === 'object' && json[key] !== null) 
        jsonR[key] = crawl(json[key])
      else jsonR[key] = operFunc(json[key])
    }
    
    return jsonR
  }
  
  return JSON.stringify(crawl(json))
}
module.exports = {
  code: parse,
  arguments: ["json", "operation", "operationPrefix"],
  description: "Runs eval($3+val+$2) on each value from $1, inclding deeper paths.",
  examples: ['〈eachJsonι{a: 3, b: 5, array: [4, 9, 1], object: {c: 4, d: 2, e: 0}}ι/2)*2ιMath.floor(〉'],
  version: "〈〉ιᛍ"
}
