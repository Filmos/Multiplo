let defaultOptions = {
  symbols: {left: "〈", right:"〉", split:"ι", var:"ᛍ", error:"⦻"},
  report: {
    error: (s)=>{console.error(s); return symbols.error},
    warn: console.warn,
    isError: (s)=>{return s==symbols.error}
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
  options = {symbols: {}, report: {}, ...options}
  symbols = {...defaultOptions.symbols, ...options.symbols}
  report = {...defaultOptions.report, ...options.report}
  
  if(!string) return
  string = symbols.left+"="+symbols.split+string+symbols.right
  
  let raw = string.split(new RegExp("("+symbols.split+")|("+symbols.right+")|((?:"+symbols.left+"|"+symbols.var+")?[^"+symbols.left+symbols.split+symbols.right+symbols.var+"]*)"))
                  .filter(s => s)
  let index = 0     
  return parse()({})
  
  function parse() {
    if(!raw[index].startsWith(symbols.left)) return report.error("Started bracket without an actual bracket: "+raw[index], [raw])
    let type = raw[index].slice(1).toLowerCase()
    index++
    let args = [], curArg = []
    let retName = undefined
    
    while(index < raw.length) {
      if(raw[index].startsWith(symbols.left)) {curArg.push(parse()); continue}
      if(raw[index] === symbols.split || raw[index] === symbols.right) {
        if(raw[index] === symbols.split && (raw[index-1].startsWith(symbols.left) || raw[index-1].startsWith(symbols.var))) {index++; continue}
        index++
        args.push(funcStacker(curArg))
        curArg = []
        if(raw[index-1] === symbols.right) break
        continue
      }
      if(raw[index].startsWith(symbols.var)) {
        retName = raw[index].slice(1)
        index++
        continue
      }
      
      curArg.push(raw[index])
      index++
    }
    
    let retFunc = ()=>{return report.error('Something weird happened')}
    
    try {
      let comm = require("./commands/"+type+".js")
      if(comm.code && isFunction(comm.code)) retFunc = comm.code
      else 
        retFunc = ()=>{return report.error('Command "'+type+'" has invalid structure')}
    } catch {
      retFunc = ()=>{return report.error('Invalid command name "'+type+'"')}
    }
    // let filename = args[0](state)
    // if(isError(filename)) return filename
    // let cont = args[1](state)
    // if(isError(cont)) return cont
    // 
    // let editor = atom.workspace.getActiveTextEditor()
    // let path = editor.getPath()
    // if(!path) return report.error("Error in save snippet: couldn't find current path")
    // path = path.slice(0,path.lastIndexOf("\\")+1)
    // let f = new File(path+filename)
    // f.write(cont)
    // return cont
    
    return function(state) {
      let res = ""
      try {
        res += retFunc(state, args, report)
      } catch {
        res += report.error('Error occured in "'+type+'" command')
      }
      
      if(retName!=undefined) state[retName] = res
      return res
    }
  }
}
module.exports = {parse: fullParse, defaultOptions: defaultOptions}