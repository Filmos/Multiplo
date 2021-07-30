async function parse(state, args, report, tools) {
  let filename = (await args[0](state))
  if(report.isError(filename)) return report.error("Error inside filename")
  
  if(!tools.readFile) return report.error("Reading additional files is not supported in this environment")
  return (await tools.readFile(filename))
}
module.exports = {
  code: parse,
  arguments: ["filename"],
  description: "Returns content of a file with path $1.",
  examples: [{"":"DISCLAIMER: The following information hasn't been confirmed and may be false.\n\n〈readFileιsource.txt〉", "source.txt": "I like dogs"}],
  version: "〈〉ιᛍ"
}