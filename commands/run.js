function parse(state, args, report) {
  let funcName = args[0](state)
  let func = state.get("function", funcName)
  if(!func) return report.error('Invalid function name "'+funcName+'"')
  
  let passedParams = {}
  passedParams[func.namespace+"_count"] = args.length-1
  for(let i=1;i<args.length;i++)
    passedParams[func.namespace+"_"+(i-1)] = args[i](state)
  
  return func.code(state.setMulti("variable", passedParams))
}
module.exports = {
  code: parse,
  arguments: ["name", "parameter 0", "parameter 1", "parameter 2", "..."],
  description: "Calls function with $1 (previously defined with `def` command). Parameters are passed directly into that function.",
  examples: ["〈defιshoutιparιO what a magic 〈varιpar_0〉 I see there! Oh, and a 〈varιpar_1〉! And 〈varιpar_countι-2〉 more beautiful creatures!〉\n〈runιshoutιhorseιrabbitιcowιsheep〉", "〈defιReport ChangesιpιThere 〈ifι〈varιp_0〉==0ιwere noι〈ifι〈varιp_0〉==1ιwas 1ιwere 〈varιp_0〉〉〉 〈varιp_1〉 change〈ifι〈varιp_0〉!=1ιs〉〈ifι〈varιp_0〉>0ι, proceed with caution〉.〉\nVersion 1.0.0\n  〈runιReport Changesι3ιbreaking〉\n  〈runιReport Changesι7ιmajor〉\nVersion 0.4.2\n  〈runιReport Changesι0ιmajor〉\nVersion 0.4.0\n  〈runιReport Changesι1ιbreaking〉\n  〈runιReport Changesι2ιexperimental〉","〈defιfancy_listιparι〈forιiι〈varιpar_count〉ι> 〈varιpar_〈varιi〉〉ι\n〉〉〈runιfancy_listιItem 1ιItem 2ιItem PIιSomething elseιAnd this as well〉"],
  version: "〈〉ιᛍ"
}
