function parse(state, args, report) {
  let num = args[0](state)
  if(isNaN(parseInt(num))) return report.error('Error in roman command: "'+num+'" is not a number')
  num = parseInt(num)
  
  var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
             "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
             "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "",
      i = 3;
  while (i--)
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}
module.exports = {
  code: parse,
  arguments: ["number"],
  description: "Convert $1 into roman numerals.",
  examples: ["〈forιiι20ι〈romanι〈varιiι+1〉〉ι, 〉"],
  version: "〈〉ιᛍ"
}
