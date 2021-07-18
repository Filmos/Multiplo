let multiplo = require('./../parser')
let symbols = multiplo.defaultOptions.symbols
let options = {
  symbols: symbols, 
  report: {
    error: (s, a=[])=>{atom.notifications.addError(s); return multiplo.defaultOptions.report.error(s, a)},
    warn: (s)=>{atom.notifications.addWarning(s); return multiplo.defaultOptions.warn.error(s, a)}
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
  
  atom.commands.add('atom-text-editor', 'multiplo:add-right', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      sel.insertText(symbols.right)
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
  
  
  atom.commands.add('atom-text-editor', 'multiplo:parse', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      let parsed = multiplo.parse(sel.getText(), options)
      if(parsed) sel.insertText(parsed, {select: true})
    })
  })
}
module.exports = registerCommands