function parse(state, args, report) {
  let caseType = args[0](state)
  let text = args[1](state)


  switch(caseType.toLowerCase()) {
    case "none":
      return text
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
      return report.error('Error in text case command: "'+caseType+'" is not a valid case type')
  }
}
module.exports = {
  code: parse,
  arguments: ["caseType", "text"],
  description: "Changes case styling of $2 to $1. Possible styles include `lower`, `upper`, `title`, `camel`, `pascal`, `snake`, `kebab` and `none`.",
  examples: ["〈forιiι8ι〈indexᛍtypeι〈varιi〉ιNoneιLowerιUpperιTitleιCamelιPascalιSnakeιKebab〉: 〈caseι〈varιtype〉ιsOmE eXAmPlE TExT〉ι\n〉","[〈forιiι3ι{filename: '〈indexᛍfilenameι〈varιi〉ιamazing_pigιcool_bovineιcrazy_axolotl〉.json', display: '〈caseιtitleι〈varιfilename〉〉'}ι, 〉]"],
  version: "〈〉ιᛍ"
}
