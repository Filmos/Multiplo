function parse(state, args, report) {
  let definition = {
    namespace: args[1](state),
    code: args[2]
  }
  return {"": "", state: state.set("function", args[0](state), definition)}
}
module.exports = {
  code: parse,
  arguments: ["name", "parameterName", "code"],
  description: "Defines a function with $1 to be used with `run` command. When function is run, $3 is executed with all parameters from the run command saved as variables with names $2_0, $2_1, $2_2... Variable $2_count is also available.",
  examples: ["〈defιshoutιparιO what a magic 〈varιpar_0〉 I see there! Oh, and a 〈varιpar_1〉! And 〈varιpar_countι-2〉 more beautiful creatures!〉\n〈runιshoutιhorseιrabbitιcowιsheep〉", "〈defιReport ChangesιpιThere 〈ifι〈varιp_0〉==0ιwere noι〈ifι〈varιp_0〉==1ιwas 1ιwere 〈varιp_0〉〉〉 〈varιp_1〉 change〈ifι〈varιp_0〉!=1ιs〉〈ifι〈varιp_0〉>0ι, proceed with caution〉.〉\nVersion 1.0.0\n  〈runιReport Changesι3ιbreaking〉\n  〈runιReport Changesι7ιmajor〉\nVersion 0.4.2\n  〈runιReport Changesι0ιmajor〉\nVersion 0.4.0\n  〈runιReport Changesι1ιbreaking〉\n  〈runιReport Changesι2ιexperimental〉","〈defιfancy_listιparι〈forιiι〈varιpar_count〉ι> 〈varιpar_〈varιi〉〉ι\n〉〉〈runιfancy_listιItem 1ιItem 2ιItem PIιSomething elseιAnd this as well〉"],
  examplesVersion: "〈〉ι"
}