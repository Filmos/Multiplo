async function parse(state, args, report) {
  let arg = (await args[0](state))+"_"
  let parsedParams = {}
  function crawl(json, path) {
    if(!Array.isArray(json) && typeof json === 'object' && json !== null) {
      parsedParams[arg+path+"keys"] = ""+Object.keys(json)
      parsedParams[arg+path+"keys.length"] = Object.keys(json).length
      crawl(Object.keys(json), path+"keys.")
    }
    for(let key in json) {
      parsedParams[arg+path+key] = ""+json[key]
      if(Array.isArray(json[key])) parsedParams[arg+path+key+".length"] = json[key].length
      if(typeof json[key] === 'object' && json[key] !== null) 
        crawl(json[key], path+key+".")
    }
  }
  
  let json = await args[1](state)
  json = eval("v="+json)
  crawl(json, "")
  
  state.pushMulti("variable", parsedParams)
  return ""
}
module.exports = {
  code: parse,
  arguments: ["variableName", "json"],
  description: "Parses $2 and then saves the result as variables starting with $1. Paths can be accessed by *$1_path*, where *path* is a full path from the root with `.` being delimeters.  \nAdditionally, for arrays present in the json property `length` is also available.",
  examples: ['〈jsonιparsedι{"a": 54, "b": [1, 2, "4"]}〉\n〈varιparsed_a〉\n〈varιparsed_b.0〉\n〈varιparsed_b〉\n〈varιparsed_b.length〉\n〈varιparsed_keys〉\n〈varιparsed_keys.0〉\n〈varιparsed_keys.length〉〉'],
  version: "〈〉ιᛍ"
}
