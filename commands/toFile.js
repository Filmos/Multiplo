function parse(state, args, report) {
  let filename = args[0](state)
  if(report.isError(filename)) return report.error("Error inside filename")
  
  let files = {}
  files[filename] = args[1](state)
  
  return {"": "", files: files}
}
module.exports = {
  code: parse,
  arguments: ["filename","content"],
  description: "Saves $2 to a file with path $1.",
  examples: ["unimplemented = {〈forιiι4ι〈toFileιtodo.txtιImplement 〈indexᛍnameι〈varιi〉ιsigmaιdeltoidιbanana-shapedιinverse〉 feature\n〉〈varιname〉: trueι, 〉}","〈forιiι3ι〈forιjι4ι〈toFileιfile〈varιi〉ι〈varιi〉: 〈varιj〉, 〉〉〉"],
  examplesVersion: "〈〉ι"
}

