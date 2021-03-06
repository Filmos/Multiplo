fs = require('fs');
parser = require("./../parser.js")
symbols = parser.defaultOptions.symbols


async function createReadme() {
  let fullREADME = (""+fs.readFileSync('readme_intro.md')).split("\n")
  fullREADME = updateSymbols(fullREADME.slice(1).join("\n"), fullREADME[0])

  let commands = fs.readdirSync('./../commands/')
  for(let file of commands) {
    let comm = require("./../commands/"+file)
    fullREADME += await makeCommandReadme(file.split(".")[0], comm)
  };

  fs.writeFile('./../README.md', fullREADME, function (err) {
    if (err) return console.error(err);
  });
}
createReadme()



async function makeCommandReadme(name, comm) {
  let args = comm.arguments || []
  let title = symbols.left+[name, ...args].join(symbols.split)+symbols.right
  
  let examples = []
  for(let ex of (comm.examples || [])) {
    let inputOutsideFiles = {}
    let outputOutsideFiles = ""
    
    if(typeof ex === 'object' && ex !== null) {inputOutsideFiles = ex; ex = ex[""]}
    let updated = updateSymbols(ex, comm.version)
    let parsed = await parser.parse(updated, {tools: {
      saveFile: (filename, content) => {outputOutsideFiles += "*"+filename+'*\n```\n'+content+'\n```\n'},
      readFile: (filename) => inputOutsideFiles[filename]
    }})
    
    
    let currentExample = '##### Input\n```\n'+updated+'\n```\n'
    for(let filename in inputOutsideFiles) if(filename != "")
        currentExample += "*"+filename+'*\n```\n'+inputOutsideFiles[filename]+'\n```\n'
    
    currentExample+='##### Output\n'
    if(parsed) currentExample += '```\n'+parsed+'\n```\n'
    currentExample += outputOutsideFiles
    
    
    examples.push(currentExample)
  }
  examples = examples.join("\n\n---\n")
  
  let description = comm.description
  if(description) for(let i=args.length-1;i>=0;i--)
    description = description.replace(new RegExp("\\$"+(i+1), 'g'), "`"+args[i]+"`")
  else if(examples) description = "No description is available for this command"
  else description = "No documentation is available for this command"
  description = updateSymbols(description, comm.version)
  
  
  return `
### ${title}
${description}`+(examples?`

#### Examples
${examples}
`:"")+
"<br><br><br>"
}

function updateSymbols(string, symbolsVersion) {
  if(!symbolsVersion) return string
  
  let currentVersion = symbols.left+symbols.right+symbols.split+symbols.var+symbols.error
  if(currentVersion.length < symbolsVersion.length) {
    console.warn("Invalid symbols version: "+symbolsVersion)
    return string
  }
  if(currentVersion.indexOf(symbolsVersion)==0) return string
  
  for(let i=0;i<symbolsVersion.length;i++)
    string = string.replace(new RegExp(symbolsVersion[i], 'g'), currentVersion[i])
  return string
}