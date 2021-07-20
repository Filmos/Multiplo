function parse(state, args, report) {
  let pattern = ""+args[0](state)
  
  let val = 0
  if(args[1]) {
    val = args[1](state)
  } else {
    let maxVal = 1
    for(let p of pattern) {
      if(p>="0" && p<="9") maxVal*=p+1
      if(p>="a" && p<="z") maxVal*=p.charCodeAt(0)-"a".charCodeAt(0)+11
      if(p>="A" && p<="Z") maxVal*=p.charCodeAt(0)-"A".charCodeAt(0)+11
    }
    val = Math.floor(Math.random()*maxVal)
  }
  
  let result = ""
  for(let i=pattern.length-1;i>=0;i--) {
    let p = pattern[i]
    let maxP = 1
    
    if(p>="0" && p<="9") maxP = (p*1+1)
    else if(p>="a" && p<="z") maxP=p.charCodeAt(0)-"a".charCodeAt(0)+11
    else if(p>="A" && p<="Z") maxP=p.charCodeAt(0)-"A".charCodeAt(0)+11
    else {result = p+result; continue}
    
    let curP = val%maxP
    val = Math.floor(val/maxP)
    
    if(curP <= 9) result = ""+curP+result
    else if(p>="a" && p<="z") result = String.fromCharCode("a".charCodeAt(0)+curP-10)+result
    else if(p>="A" && p<="Z") result = String.fromCharCode("A".charCodeAt(0)+curP-10)+result
  }
  
  return result
}
module.exports = {
  code: parse,
  arguments: ["pattern", "value"],
  description: "Generate uid in given $1, where each alpha-numeric character represents max value for this spot. If $2 isn't given, a random one will be automatically generated.",
  examples: ["〈forιiι9ι〈uidιFFF-ff.f〉ι\n〉","〈forιiι9ι〈uidι321ι〈varιi〉〉ι\n〉"],
  version: "〈〉ιᛍ"
}
