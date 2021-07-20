let defaultOptions = {
  symbols: {left: "〈", right:"〉", split:"ι", var:"ᛍ", error:"⦻"},
  report: {
    error: (s)=>{console.error(s); return symbols.error},
    warn: console.warn,
    isError: (s)=>{return s==symbols.error}
  }
}


function isFunction(functionToCheck) {
 return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}
function isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]"
}

function funcStacker(ar) {
  return (state) => {
    let res = ""
    for(a of ar) {
      if(!a) continue
      if(isFunction(a)) {
        let v = a(state)
        res += (v.value||"")
        if(v.state) state = v.state
      } else res += a
    }
    return res
  }
}


class State {
  constructor(source) {
    this.data = {}
    for(let cat in source) 
      this.data[cat] = {...source[cat]}
  }
  
  get(cat, name) {
    return (this.data[cat]?this.data[cat][name]:undefined)
  }
  set(cat, name, value) {
    let newData = {...this.data}
    newData[cat] = {...this.data[cat]}
    newData[cat][name] = value
    return new State(newData)
  }
  setMulti(cat, values) {
    let newData = {...this.data}
    newData[cat] = {...this.data[cat],...values}
    return new State(newData)
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
  
  let globalHandles = {files: {}}
  let index = 0  
     
  let parsedText = parse()(new State())
  return {...globalHandles.files, "": parsedText.value}
  
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
    
    
    
    return function(state) {
      let res = ""
      let newState = undefined
      try {
        res = retFunc(state, args, report)
        if(isObject(res)) {
          newState = res.state
          for(let file in res.files)
            globalHandles.files[file] = (globalHandles.files[file]||"")+res.files[file]
            
          res = res[""] || ""
        } else res = ""+res
      } catch(e) {
        res += report.error('Error occured in "'+type+'" command: '+e)
      }
      
      
      let ret = {value: res, state: newState}
      if(retName!=undefined) ret.state = (newState || state).set("variable", retName, res)
      
      return ret
    }
  }
}
module.exports = {parse: fullParse, defaultOptions: defaultOptions}