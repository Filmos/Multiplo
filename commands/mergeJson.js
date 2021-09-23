async function parse(state, args, report) {
  let jsonA = (await args[0](state))+""; jsonA = eval("v="+jsonA.trim())
  let jsonB = (await args[1](state))+""; jsonB = eval("v="+jsonB.trim())
  
  function crawl(jsonA, jsonB) {
    if(Array.isArray(jsonA) && Array.isArray(jsonB)) return jsonA.concat(jsonB)
    if(Array.isArray(jsonA) || Array.isArray(jsonB)) return jsonB
    
    let jsonC = {}
    for(let key in jsonA) {
      if(jsonB[key] === undefined) {jsonC[key] = jsonA[key]; continue}
      if(typeof jsonA[key] === 'object' && jsonA[key] !== null
      && typeof jsonB[key] === 'object' && jsonB[key] !== null) 
        jsonC[key] = crawl(jsonA[key], jsonB[key])
      else 
        jsonC[key] = jsonB[key]
    }
    for(let key in jsonB)
      if(jsonC[key] === undefined) jsonC[key] = jsonB[key]
    
    return jsonC
  }
  
  
  return JSON.stringify(crawl(jsonA, jsonB))
}
module.exports = {
  code: parse,
  arguments: ["jsonA", "jsonB"],
  description: "Combines $1 and $2 into a single json object. Merging happens in deeper paths as well, in case of a conflict values from $2 will overwrite values from $1.",
  examples: ['〈mergeJsonι\n{a: 1, ab: 2, arrayAB: [1, 3], arrayA: [2], arrayB: 8, objectAB: {a: "e", ab: "f"}}ι\n{b: 3, ab: 5, arrayAB: [2, 3, 4], arrayA: 7, arrayB: [3], objectAB: {b: "g", ab: "hi"}}〉'],
  version: "〈〉ιᛍ"
}
