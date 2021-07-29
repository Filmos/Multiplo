let multiplo = require('./../parser')
let symbols = multiplo.defaultOptions.symbols
let filesChanged = 0
let options = {
  symbols: symbols, 
  report: {
    error: (s, a=[])=>{atom.notifications.addError(s); return multiplo.defaultOptions.report.error(s, a)},
    warn: (s)=>{atom.notifications.addWarning(s); return multiplo.defaultOptions.warn.error(s, a)}
  },
  tools: {
    saveFile: (filename, content) => {
      let editor = atom.workspace.getActiveTextEditor()
      let path = editor.getPath()
      if(!path) return atom.notifications.addError("Couldn't find current path, outside files weren't saved.");
      path = path.slice(0,path.lastIndexOf("\\")+1)
      
      let f = new att.File(path+filename)
      f.write(content)
    }
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
  
  att = require('atom')
  atom.commands.add('atom-text-editor', 'multiplo:parse', () => {
    editor = atom.workspace.getActiveTextEditor()
    editor.mutateSelectedText((sel, ind) => {
      let parsed = multiplo.parse(sel.getText(), options)
      if(parsed.trim()) sel.insertText(parsed, {select: true})
      
      if(filesChanged > 0)
        atom.notifications.addInfo("Modified "+filesChanged+" additional file"+(filesChanged>1?"s":""))
      filesChanged = 0
    })
  })
}
module.exports = registerCommands