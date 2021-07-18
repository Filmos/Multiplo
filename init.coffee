# Your init script
#
# Atom will evaluate this file each time a new window is opened. It is run
# after packages are loaded/activated and after the previous editor state
# has been restored.
#
# An example hack to log to the console when each text editor is saved.
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     console.log "Saved! #{editor.getPath()}"

if("Smart strings")
  smartQuote = (sym, reg, e) ->
    editor = atom.workspace.getActiveTextEditor()
    if(!editor || !editor.hasMultipleCursors) 
      return e.abortKeyBinding()
    if(editor != "" && !editor.hasMultipleCursors())
      sel = editor.getLastSelection()
      txt = sel.getText()
      if(///^#{reg}$///.test(txt))
        sel.insertText(sym)
      else if(///^#{reg}((?:.|\w)*)\1$///.test(txt))
        ex = ///^#{reg}((?:.|\w)*)\1$///.exec(txt)
        sel.insertText(sym+ex[2]+sym)
      else
        e.abortKeyBinding()
    else
      e.abortKeyBinding()
  atom.commands.add 'atom-text-editor', 'custom:smart-quot1', (e) ->
    smartQuote("\"","('|`)",e)
  atom.commands.add 'atom-text-editor', 'custom:smart-quot2', (e) ->
    smartQuote('\'','("|`)',e)
  atom.commands.add 'atom-text-editor', 'custom:smart-quot3', (e) ->
    smartQuote("`","(\"|')",e)
if("Selection search")
  multiRegExp = (sel, fl="") ->
    flags = {}
    res = []
    for s of sel 
      st = sel[s].getText()
      if(flags[st]) 
        continue
      flags[st] = true
      res.push("("+st.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')+")")
    return RegExp(res.join("|"), fl)
    
  atom.commands.add 'atom-text-editor', 'custom:selection-search-up', (e) ->
    editor = atom.workspace.getActiveTextEditor()
    txt = editor.getSelectedText()
    sel = editor.getSelectionsOrderedByBufferPosition()
    lastSel = sel[0]
    if(txt == "")
      e.abortKeyBinding()
    else
      editor.backwardsScanInBufferRange(multiRegExp(sel), [[0,0],lastSel.getBufferRange().start], (o) ->
        editor.addSelectionForBufferRange(o.range, {reversed: true})
        o.stop()
      )
  atom.commands.add 'atom-text-editor', 'custom:selection-search-down', (e) ->
    editor = atom.workspace.getActiveTextEditor()
    txt = editor.getSelectedText()
    sel = editor.getSelectionsOrderedByBufferPosition()
    lastSel = sel[sel.length-1]
    lastBuf = editor.getLastBufferRow()
    if(txt == "")
      e.abortKeyBinding()
    else
      editor.scanInBufferRange(multiRegExp(sel), [lastSel.getBufferRange().end,[lastBuf, editor.lineTextForBufferRow(lastBuf).length]], (o) ->
        editor.addSelectionForBufferRange(o.range)
        o.stop()
      )
  atom.commands.add 'atom-text-editor', 'custom:selection-search-all', (e) ->
    editor = atom.workspace.getActiveTextEditor()
    txt = editor.getSelectedText()
    if(txt != "")
      editor.scan(multiRegExp(sel,"g"), (o) ->
        editor.addSelectionForBufferRange(o.range)
      )
if("String escape")
  atom.commands.add 'atom-text-editor', 'custom:escape-string', ->
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) ->
      txt = sel.getText().replace(/\\/g, "\\\\")
      txt = txt.replace(/(?:\r\n|\r|\n)/g, "\\n")
      if /'/.test(txt)
        txt = txt.replace(/"/g, "\\\"")
      else
        txt = txt.replace(/"/g, "\'")
      sel.insertText("\"#{txt}\"")
    )
  atom.commands.add 'atom-text-editor', 'custom:rigid-escape-string', ->
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) ->
      txt = sel.getText().replace(/\\/g, "\\\\")
      txt = txt.replace(/(?:\r\n|\r|\n)/g, "\\n")
      txt = txt.replace(/"/g, "\\\"")
      sel.insertText("\"#{txt}\"")
    )
if("Faster debug")
  autoFormatDebug = () ->
    editor = atom.workspace.getActiveTextEditor()
    type = editor.getRootScopeDescriptor().getScopesArray()[0]
    if(type == "source.coffee" || type == " source.js")
      return ["console.log(",")"]
    if(type == "source.cs")
      return ["Debug.Log(",");"]
    if(type == "source.lua")
      return ["DEBUG(",")"]
    if(type == "source.autoit.3")
      return ["MsgBox(0, \"Debug\", ",")"]
    return ["",""]
  atom.commands.add 'atom-text-editor', 'custom:fast-debug', ->
    editor = atom.workspace.getActiveTextEditor()
    type = editor.getRootScopeDescriptor().getScopesArray()[0]
    console.log(type)
    editor.mutateSelectedText((sel, ind) ->
      deb = autoFormatDebug()
      txt = sel.getText()
      sel.insertText("#{deb[0]}#{txt}#{deb[1]}")
      sel.setScreenRange(sel.getScreenRange().translate([0,-deb[1].length]))
    )
  atom.commands.add 'atom-text-editor', 'custom:fast-mult-debug', ->
    editor = atom.workspace.getActiveTextEditor()
    sel = editor.getSelectionsOrderedByBufferPosition()
    batchUndo = ->
      for i of sel
        deb = autoFormatDebug()
        txt = sel[i].getText()
        sel[i].insertText("#{txt}\n#{deb[0]}\"Debug: #{i}\"#{deb[1]}")
    editor.transact(batchUndo)
  atom.commands.add 'atom-text-editor', 'custom:find-debug', (e) ->
    editor = atom.workspace.getActiveTextEditor()
    txt = autoFormatDebug()[0].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + ".*?" + autoFormatDebug()[1].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    sel = editor.getSelectionsOrderedByBufferPosition()
    lastSel = sel[sel.length-1]
    lastBuf = editor.getLastBufferRow()
    flag = true
    if(txt == "")
      e.abortKeyBinding()
    else
      editor.scanInBufferRange(RegExp(txt), [lastSel.getBufferRange().end,[lastBuf, editor.lineTextForBufferRow(lastBuf).length]], (o) ->
        editor.setSelectedBufferRange(o.range)
        flag = false
        o.stop()
      )
    if(flag)
      console.log("!QQ!")
      editor.scanInBufferRange(RegExp(txt), [[0,0],[lastBuf, editor.lineTextForBufferRow(lastBuf).length]], (o) ->
        editor.setSelectedBufferRange(o.range)
        o.stop()
      )
if("Code helpers")
  atom.commands.add 'atom-text-editor', 'custom:duplicate', ->
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) ->
      txt = sel.getText()
      if(txt.length == 0)
        poz = sel.getScreenRange()
        sel.expandOverLine()
        txt = sel.getText()
        sel.insertText("#{txt}#{txt}")
        sel.setScreenRange(poz.translate([1,0]))
      else
        sel.insertText("#{txt}#{txt}")
        sel.selectLeft(txt.length)
    )
  atom.commands.add 'atom-text-editor', 'custom:smart-colon', ->
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) ->
      poz = sel.getScreenRange()
      sel.selectToEndOfLine()
      txt = sel.getText()
      sel.insertText("#{txt};")
      sel.setScreenRange(poz)
    )
    
# "Repl": (dat) -> return [Math.round(eval(dat[0].replace(/f/g,""))*10000)/10000+dat[1],"",""]
if("Latex macros")
  latexMacros = [{
    "RegExp": /\(((?:[^|\n$()]|\((?:[^|\n$()]|\([^|\n$()]+\))+\))+)\|((?:[^|\n$()]|\((?:[^|\n$()]|\([^|\n$()]+\))+\))+)\)/,
    "Repl": (dat) -> return ["{{"+dat[1]+"}\\choose{"+dat[2]+"}}","",""]
   },{
    "RegExp": /<=>/,
    "Repl": (dat) -> return ["\\Leftrightarrow ","",""]
   },{
    "RegExp": />=/,
    "Repl": (dat) -> return ["\\geq ","",""]
   },{
    "RegExp": /<=/,
    "Repl": (dat) -> return ["\\leq ","",""]
   },{
    "RegExp": /!=!/,
    "Repl": (dat) -> return ["\\neq ","",""]
   },{
    "RegExp": /->/,
    "Repl": (dat) -> return ["\\to ","",""]
   },{
    "RegExp": /=>/,
    "Repl": (dat) -> return ["\\Rightarrow ","",""]
   },{
    "RegExp": /-\/>/,
    "Repl": (dat) -> return ["\\nrightarrow ","",""]
   },{
    "RegExp": /-8>/,
    "Repl": (dat) -> return ["\\to\\infty","",""]
   },{
    "RegExp": /`R`/,
    "Repl": (dat) -> return ["\\mathbb{R}","",""]
   },{
    "RegExp": /`N`/,
    "Repl": (dat) -> return ["\\mathbb{N}","",""]
   },{
    "RegExp": /`\\\/`/,
    "Repl": (dat) -> return ["\\nabla ","",""]
   },{
  
  
    "RegExp": /`-([^`]+)>`/,
    "Repl": (dat) -> return ["\\xrightarrow{"+dat[1]+"}","",""]
   },{
    "RegExp": /`t-([^`]+)>`/,
    "Repl": (dat) -> return ["\\xrightarrow{\\text{"+dat[1]+"}}","",""]
   },{
    "RegExp": /`=([^`]+)>`/,
    "Repl": (dat) -> return ["\\xRightarrow{"+dat[1]+"}","",""]
   },{
    "RegExp": /`t=([^`]+)>`/,
    "Repl": (dat) -> return ["\\xRightarrow{\\text{"+dat[1]+"}}","",""]
   },{
    "RegExp": /`<=([^`]+)>`/,
    "Repl": (dat) -> return ["\\xLeftrightarrow{"+dat[1]+"}","",""]
   },{
    "RegExp": /`<t=([^`]+)>`/,
    "Repl": (dat) -> return ["\\xLeftrightarrow{\\text{"+dat[1]+"}}","",""]
   },{
    "RegExp": /`=([^`]+)=`/,
    "Repl": (dat) -> return ["\\xlongequal{"+dat[1]+"}","",""]
   },{
    "RegExp": /`t=([^`]+)=`/,
    "Repl": (dat) -> return ["\\xlongequal{\\text{"+dat[1]+"}}","",""]
   },{
    "RegExp": /f::/,
    "Repl": (dat) -> return ["\\displaystyle\\int","\\mathrm{d}x",""]
   },{
    "RegExp": /\\ss(\w+)\)/,
    "Repl": (dat) -> return ["\\subsection*{"+dat[1]+")}","",""]
   },{
    "RegExp": /\['([^\[\]\n]*)'\]/,
    "Repl": (dat) -> return ["\\left\\lceil"+dat[1]+"\\right\\rceil","",""]
   },{
    "RegExp": /\[_([^\[\]\n]*)_\]/,
    "Repl": (dat) -> return ["\\left\\lfloor"+dat[1]+"\\right\\rfloor","",""]
   },{
    "RegExp": /`\[([^`]+)\]`/,
    "Repl": (dat) -> return ["\\left["+dat[1]+"\\right]","",""]
   },{
    "RegExp": /`\(([^`]+)\)`/,
    "Repl": (dat) -> return ["\\left("+dat[1]+"\\right)","",""]
   },{
    "RegExp": /\/([^/\n]+)\/([^/\n]+)\//,
    "Repl": (dat) -> return ["\\frac{"+dat[1]+"}{"+dat[2]+"}","",""]
   }]
  testSentence = (cur, txt) ->
    if(typeof cur.Lang != "undefined" && !cur.Lang.includes(atom.workspace.getActiveTextEditor().getRootScopeDescriptor().getScopesArray()[0]))
      return false
    if(!cur.RegExp.test(txt))
      return false
    if(typeof cur.NotRegExp != "undefined" && cur.NotRegExp.test(txt))
      return false
    return true
  atom.commands.add 'atom-text-editor', 'custom:finish-sentence-latex', ->
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) ->
      oldSel = sel.getScreenRange()
      if(sel.getText().length == 0)
        sel.selectToEndOfLine()
        sel.setScreenRange([[oldSel.start.row, 0],sel.getScreenRange().end])
      txt = sel.getText()

      for curi of latexMacros
        cur = latexMacros[curi]
        if(testSentence(cur, txt))
          dat = cur.RegExp.exec(txt)
          repl = cur.Repl(dat)
          sel.insertText(txt.replace(cur.RegExp,repl[0]+repl[2]+repl[1]))
          sel.selectToEndOfLine()
          sel.setScreenRange([[oldSel.end.row, 0],sel.getScreenRange().end])
          sel.setScreenRange([[oldSel.end.row,sel.getText().indexOf(repl[0])+repl[0].length],[oldSel.end.row,sel.getText().indexOf(repl[0])+repl[0].length+repl[2].length]])
          return ""

      sel.setScreenRange(oldSel)
    )
if("Multicursor functions")
  atom.commands.add 'atom-text-editor', 'custom:number-cursor', ->
    editor = atom.workspace.getActiveTextEditor()
    sel = editor.getSelectionsOrderedByBufferPosition()
    batchUndo = ->
      for i of sel
        sel[i].insertText("#{i}")
    editor.transact(batchUndo)
if("Calculator")
  atom.commands.add 'atom-text-editor', 'custom:calc-formula', ->
    editor = atom.workspace.getActiveTextEditor()
    sel = editor.getSelectionsOrderedByBufferPosition()
    batchUndo = ->
      for i of sel
        txt = sel[i].getText()
        sel[i].insertText(eval(txt)+"")
    editor.transact(batchUndo)
    
    

{File} = require 'atom'
# if("Template language")
`
let symbols = {left: "〈", right:"〉", split:"ᛙ", var:"ᛍ"}

  atom.commands.add('atom-text-editor', 'template-lang:create-empty', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      sel.insertText(symbols.left+sel.getText()+symbols.right, {select: true})
      sel.setBufferRange(sel.getBufferRange().translate([0, 1], [0, -1]))
    })
  })
  
  atom.commands.add('atom-text-editor', 'template-lang:add-split', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      sel.insertText(symbols.split)
    })
  })
  
  atom.commands.add('atom-text-editor', 'template-lang:add-var', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      sel.insertText(symbols.var)
    })
  })
  
  
  atom.commands.add('atom-text-editor', 'template-lang:parse', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      let parsed = fullParse(symbols.left+"="+sel.getText()+symbols.right)
      if(parsed && parsed !== errorFlag) sel.insertText(parsed, {select: true})
    })
    

  })
  
  errorFlag = {"error": ["An error occurred"]}
  report = {
    error: (s, a=[])=>{atom.notifications.addError(s);console.error(s,...a);return errorFlag},
    warn: (s)=>{atom.notifications.addWarning(s);console.warn(s)}
  }
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
  
  function fullParse(string) {
    if(!string) return
    // let raw = string.split(new RegExp("("+symbols.left+".)|("+symbols.split+")|([^"+symbols.left+symbols.split+symbols.right+"]*"+symbols.right+")"))
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
        case "s": retFunc = function(state) {
          let filename = args[0](state)
          if(isError(filename)) return filename
          let cont = args[1](state)
          if(isError(cont)) return cont
            
          let editor = atom.workspace.getActiveTextEditor()
          let path = editor.getPath()
          if(!path) return report.error("Error in save snippet: couldn't find current path")
          path = path.slice(0,path.lastIndexOf("\\")+1)
          let f = new File(path+filename)
          f.write(cont)
          return cont
        }
        break
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
  
`