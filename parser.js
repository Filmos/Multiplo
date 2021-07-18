let defaultOptions = {
  symbols: {left: "〈", right:"〉", split:"ᛙ", var:"ᛍ"},
  report: {
    error: console.error,
    warn: console.warn
  }
}


errorFlag = {"error": ["An error occurred"]}
function isError(obj) {
  return obj === errorFlag
}
function isFunction(functionToCheck) {
 return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}


function funcStacker(ar) {
  return (state) => {
    let res = ""
    for(a of ar) {
      if(!a) continue
      if(isFunction(a)) {
        let v = a(state)
        if(isError(v)) return v
        res += (v||"")
      } else res += a
    }
    return res
  }
}


function fullParse(string, options) {
  options = {...defaultOptions, ...options}
  symbols = options.symbols
  report = options.report
  
  if(!string) return
  string = symbols.left+"="+string+symbols.right
  
  let raw = string.split(new RegExp("("+symbols.left+".)|("+symbols.split+")|("+symbols.right+")|([^"+symbols.left+symbols.split+symbols.right+symbols.var+"]*"+symbols.var+")"))
                  .filter(s => s)
  console.log(raw)
  let index = 0        
  return parse()({})
              
  function parse() {
    if(!raw[index].startsWith(symbols.left)) return report.error("Started bracket without an actual bracket: "+raw[index], [raw])
    let type = raw[index].slice(-1).toLowerCase()
    index++
    let args = [], curArg = []
    let retName = undefined
    
    while(index < raw.length) {
      if(raw[index].startsWith(symbols.left)) {curArg.push(parse()); continue}
      if(raw[index] === symbols.split || raw[index] === symbols.right) {
        index++
        args.push(funcStacker(curArg))
        curArg = []
        if(raw[index-1] === symbols.right) break
        continue
      }
      if(raw[index].endsWith(symbols.var)) {
        retName = raw[index].slice(0,-symbols.var.length)
        index++
        continue
      }
      
      curArg.push(raw[index])
      index++
    }
    
    let retFunc = funcStacker(args)
    switch(type) {
      case "r": retFunc = function(state) {
        let maxI = args[0](state)
        if(isError(maxI)) return maxI
        if(isNaN(parseInt(maxI))) return report.error('Error in repeat snippet: "'+maxI+'" is not a number')
        let res = ""
        for(let i=0;i<maxI;i++) {
          let cur = args[1]({...state, i: i})
          if(isError(cur)) return cur
          res += cur
        }
        return res
      }
      break
      case "!": retFunc = function(state) {
        let val = args[0](state)
        if(isError(val)) return val
        val = state[val]
        return ""+(val===undefined?"":val)
      }
      break
      case ":": retFunc = function(state) {
        let val = args[0](state)
        if(isError(val)) return val
        try {return ""+eval(val)}
        catch(e) {return report.error('Error in eval snippet: '+e)}
      }
      break
      case "?": retFunc = function(state) {
        let cond = args[0](state)
        if(isError(cond)) return cond
        try {
          let retInd = (eval(cond)?1:2)
          if(!args[retInd]) return ""
          let val = args[retInd](state)
          return val
        }
        catch(e) {return report.error('Error in if snippet: '+e)}
      }
      break
      case "[": retFunc = function(state) {
        let ind = state["i"]
        if(ind===undefined) return report.error('Error in list snippet: not inside a loop')
        if(isNaN(parseInt(ind))) return report.error('Error in list snippet: "'+ind+'" is not a number')
        ind = parseInt(ind)
        if(!args[ind]) return ""
        return args[ind](state)
      }
      break
      // case "s": retFunc = function(state) {
      //   let filename = args[0](state)
      //   if(isError(filename)) return filename
      //   let cont = args[1](state)
      //   if(isError(cont)) return cont
      // 
      //   let editor = atom.workspace.getActiveTextEditor()
      //   let path = editor.getPath()
      //   if(!path) return report.error("Error in save snippet: couldn't find current path")
      //   path = path.slice(0,path.lastIndexOf("\\")+1)
      //   let f = new File(path+filename)
      //   f.write(cont)
      //   return cont
      // }
      // break
      case "=": retFunc = function(state) {
        return args[0](state)
      }
      break
      case "^": retFunc = function(state) {
        let caseType = args[0](state)
        if(isError(caseType)) return caseType
        let text = args[1](state)
        if(isError(text)) return text
        
          
        switch(caseType.toLowerCase()) {
          case "lower":
            return text.toLowerCase()
          case "upper":
            return text.toUpperCase()
        }
        
        let textSplit = text.split(/ |_|-/).filter(s=>s)
        if(textSplit.length == 1) textSplit = textSplit[0].split(/(?=[A-Z])/).filter(s=>s)
        
        switch(caseType.toLowerCase()) {
          case "title":
            return textSplit.map(t => t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join(" ")
          case "camel":
            let ret = textSplit[0].toLowerCase()
            for(let i=1;i<textSplit.length;i++) ret+= textSplit[i].charAt(0).toUpperCase()+textSplit[i].slice(1).toLowerCase()
            return ret
          case "pascal":
            return textSplit.map(t => t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join("")
          case "snake":
            return textSplit.map(s => s.toLowerCase()).join("_")
          case "kebab":
            return textSplit.map(s => s.toLowerCase()).join("-")
          default:
            return report.error('Error in text case snippet: "'+caseType+'" is not a valid case type')
        }
      }
      break
      case "~": retFunc = function(state) {
        let a1 = args[0](state)
        if(isError(a1)) return a1
        try {a1 = eval(a1)}
        catch(e) {return report.error('Error in round snippet ('+a1+'): '+e)}
        a1 = parseFloat(a1)
        if(isNaN(a1)) return report.error('Error in round snippet: "'+a1+'" is not a number')
        if(!args[1]) return Math.round(a1)
        
        let a2 = args[1](state)
        if(isError(a2)) return a2
        try {a2 = eval(a2)}
        catch(e) {return report.error('Error in round snippet ('+a2+'): '+e)}
        a2 = parseFloat(a2)
        if(isNaN(a2)) return report.error('Error in round snippet: "'+a2+'" is not a number')
        
        if(a1==0) return a2
        return Math.round(a2/a1)*a1
      }
      break
    }
    
    return function(state) {
      let res = ""+retFunc(state)
      console.log(retName, res)
      if(retName!=undefined) state[retName] = res
      return res
    }
  }
}
module.exports = fullParse