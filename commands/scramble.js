function parse(state, args, report) {
  let pattern = ""+args[0](state)
  
  let result = ""
  for(let p of pattern) {
    if(p>="0" && p<="9") result += Math.floor(Math.random()*10)
    else if(p>="a" && p<="z") result += String.fromCharCode(Math.floor(Math.random()*25+97))
    else if(p>="A" && p<="Z") result += String.fromCharCode(Math.floor(Math.random()*25+65))
    else result += p
  }
  
  return result
}
module.exports = {
  code: parse,
  arguments: ["text"],
  description: "Replaces characters in $1 with random ones from the same range.",
  examples: ["〈scrambleιThere are 235 D.O.G.S. active at this moment.〉"],
  version: "〈〉ιᛍ"
}
