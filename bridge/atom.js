let symbols = {left: "〈", right:"〉", split:"ᛙ", var:"ᛍ"}
let options = {
  symbols: symbols, 
  report: {
    error: (s, a=[])=>{atom.notifications.addError(s);console.error(s,...a);return errorFlag},
    warn: (s)=>{atom.notifications.addWarning(s);console.warn(s)}
  }
}

let registerCommands = () => {
  atom.commands.add('atom-text-editor', 'multiplo:create-empty', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      sel.insertText(symbols.left+sel.getText()+symbols.right, {select: true})
      sel.setBufferRange(sel.getBufferRange().translate([0, 1], [0, -1]))
    })
  })
  
  atom.commands.add('atom-text-editor', 'multiplo:add-split', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      sel.insertText(symbols.split)
    })
  })
  
  atom.commands.add('atom-text-editor', 'multiplo:add-var', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      sel.insertText(symbols.var)
    })
  })
  
  
  multiploParser = require('./../parser')
  atom.commands.add('atom-text-editor', 'multiplo:parse', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      let parsed = multiploParser(sel.getText(), options)
      if(parsed && parsed !== errorFlag) sel.insertText(parsed, {select: true})
    })
  })
}
module.exports = registerCommands