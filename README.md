# Multiplo
Multiplo is a template language which makes writing repetitive text significantly easier. It allows for functions such as for, if or even saving to a different file to be implemented and then parsed into final result.

## Usage
This tool is based around a single javascript file `parser.js` which does all the magic. There is a bridge which allows you to use this tool as an atom pluging, but this file can also be used directly.

### Atom
This tool can be used as an atom plugin. All you need to do is add following code into your init script:
```CoffeeScript
multiplo = require 'Path/to/multiplo/bridge/atom'
multiplo()
```
This will add a function which converts currently selected text (`multiplo:parse`) and a few helper functions which insert syntax characters.

Following keymap is recommended:
```cson 
"alt-[": 'multiplo:create-empty'   
"alt-]": 'multiplo:add-right'   
"alt-,": 'multiplo:add-split'   
"alt-'": 'multiplo:add-var'   
"alt-enter": 'multiplo:parse'   
```

### Custom
As it was said earlier, you can use this tool in your own way by directly referencing `parser.js`. It exports two values - `defaultOptions`, which contains default options for the parser, and `parse(text, options)`, which is the function which transforms the text.   

#### Parameters
`Text` is a simple string in proper syntax (which is described in later chapters). 
`Options`, however is slightly more complicated (it's also optional, so if things really go wrong you can just leave it empty). It has following fields:

##### Symbols
This is an object containing symbols used for syntax. If for some reason you don't like the default ones, this is the place to change them.

In this documentation, following symbols are used:  
**left** - `〈`  
**right** - `〉`  
**split** - `ι`  
**var** - `ᛍ`  
**error** - `⦻`  

##### Report
This is an object containing different functions used when something is wrong with parsed syntax.  
`error(message)` and `warn(message)` are functions that are for reporting any errors or warnings. It is recommended that after doing your own handling, default functions are called and their values are returned (example: `error: (s)=>{atom.notifications.addError(s); return multiplo.defaultOptions.report.error(s, a)}`).

`isError(value)` is a function which checks if value is actually an error. If you changed the return value of `error` function, you need to change this one to detect it.

### Return value
This function return a single object, with keys being filenames (since syntax allows for saving to outside files as well) and values being the parsed text. Those filenames could be relative or absolute, depending on how they were used in raw text.  
There is one special filename, `""`. It is always returned, and contains parsed text that wasn't saved in an outside file. In most cases, this is the value that you are looking for.

### Help
If all of this seems confusing, but you are still determined to write your own bridge instead of using an existing one, take a look at the `bridge` directory of this tool. It contains a few files (ok, a single one right now) that implement such bridges for different environments, which could be used as decent examples.

## Syntax
The whole syntax is based around a few special unicode characters - `〈`,`〉`,`ι`,`ᛍ`,`⦻`. Because those are very, very unlikely to appear in the files you are working on, there is no need to escape special characters (and in case they do appear, you can just change them in parser options).

Syntax itself is very simple, and contains of a single structure - `〈commandNameιparam 1ιparam 2ιparam 3ι...〉`. This executes `commandName` with given parameters, and then replaces everything between `〈〉` with its return value. This can be placed next to standard text, and its return value will be approprietly combined with it (so you can do stuff like `〈somethingιI like 〈...〉 really much〉`).

You can also expand this structure into `〈commandNameᛍvariableNameιparam 1ιparam 2ιparam 3ι...〉`. This will parse the command as usual, but its return value will be saved as `variableName` and can later be accessed with the `var` command.

The last special character is `⦻`. It only appears in the parsing result, and represents an error. Remember that this symbol doesn't necessarily mean that an error occurred in this spot, it could have happened deeper in the syntax and then cascaded a few layers up.

## Commands
### 〈-ιcomment〉
Ignores anything inside `comment`, useful for writing comments.

#### Examples
##### Input
```
Visible text 〈-ιremember to buy milk 〉is all you see
```
##### Output
```
Visible text is all you see
```

<br><br><br>
### 〈=ιinner〉
Doesn't do anything on its own, it simply returns its first argument.

#### Examples
##### Input
```
〈=ι123ι234〉
```
##### Output
```
123
```

<br><br><br>
### 〈caseιcaseTypeιtext〉
Changes case styling of `text` to `caseType`. Possible styles include `lower`, `upper`, `title`, `camel`, `pascal`, `snake`, `kebab` and `none`.

#### Examples
##### Input
```
〈forιiι8ι〈indexᛍtypeι〈varιi〉ιNoneιLowerιUpperιTitleιCamelιPascalιSnakeιKebab〉: 〈caseι〈varιtype〉ιsOmE eXAmPlE TExT〉ι
〉
```
##### Output
```
None: sOmE eXAmPlE TExT
Lower: some example text
Upper: SOME EXAMPLE TEXT
Title: Some Example Text
Camel: someExampleText
Pascal: SomeExampleText
Snake: some_example_text
Kebab: some-example-text
```


---
##### Input
```
[〈forιiι3ι{filename: '〈indexᛍfilenameι〈varιi〉ιamazing_pigιcool_bovineιcrazy_axolotl〉.json', display: '〈caseιtitleι〈varιfilename〉〉'}ι, 〉]
```
##### Output
```
[{filename: 'amazing_pig.json', display: 'Amazing Pig'}, {filename: 'cool_bovine.json', display: 'Cool Bovine'}, {filename: 'crazy_axolotl.json', display: 'Crazy Axolotl'}]
```

<br><br><br>
### 〈compareιaιbιifLessιifEqualιifGreater〉
Compares `a` and `b` and returns proper value (`a`<`b`: `ifLess`, `a`=`b`: `ifEqual`, `a`>`b`: `ifGreater`).  
Shorthand for 〈ifι`a`<`b`ι`ifLess`ι〈ifι`a`>`b`ι`ifGreater`ι`ifEqual`〉〉

#### Examples
##### Input
```
〈forιiι10ι〈compareι〈varιi〉ι4ιlessιequalιgreater〉 (〈varιi〉)ι, 〉
```
##### Output
```
less (0), less (1), less (2), less (3), equal (4), greater (5), greater (6), greater (7), greater (8), greater (9)
```

<br><br><br>
### 〈defιnameιparameterNameιcode〉
Defines a function with `name` to be used with `run` command. When function is run, `code` is executed with all parameters from the run command saved as variables with names `parameterName`_0, `parameterName`_1, `parameterName`_2... Variable `parameterName`_count is also available.

#### Examples
##### Input
```
〈defιshoutιparιO what a magic 〈varιpar_0〉 I see there! Oh, and a 〈varιpar_1〉! And 〈varιpar_countι-2〉 more beautiful creatures!〉
〈runιshoutιhorseιrabbitιcowιsheep〉
```
##### Output
```

O what a magic horse I see there! Oh, and a rabbit! And 2 more beautiful creatures!
```


---
##### Input
```
〈defιReport ChangesιpιThere 〈ifι〈varιp_0〉==0ιwere noι〈ifι〈varιp_0〉==1ιwas 1ιwere 〈varιp_0〉〉〉 〈varιp_1〉 change〈ifι〈varιp_0〉!=1ιs〉〈ifι〈varιp_0〉>0ι, proceed with caution〉.〉
Version 1.0.0
  〈runιReport Changesι3ιbreaking〉
  〈runιReport Changesι7ιmajor〉
Version 0.4.2
  〈runιReport Changesι0ιmajor〉
Version 0.4.0
  〈runιReport Changesι1ιbreaking〉
  〈runιReport Changesι2ιexperimental〉
```
##### Output
```

Version 1.0.0
  There were 3 breaking changes, proceed with caution.
  There were 7 major changes, proceed with caution.
Version 0.4.2
  There were no major changes.
Version 0.4.0
  There was 1 breaking change, proceed with caution.
  There were 2 experimental changes, proceed with caution.
```


---
##### Input
```
〈defιfancy_listιparι〈forιiι〈varιpar_count〉ι> 〈varιpar_〈varιi〉〉ι
〉〉〈runιfancy_listιItem 1ιItem 2ιItem PIιSomething elseιAnd this as well〉
```
##### Output
```
> Item 1
> Item 2
> Item PI
> Something else
> And this as well
```

<br><br><br>
### 〈evalιcode〉
Evaluates javascript passed as `code`. Especially useful for mathematical operations.

#### Examples
##### Input
```
〈evalι123+5*234〉
```
##### Output
```
1293
```


---
##### Input
```
〈forιiι3ι23+4*〈varιi〉=〈evalι23+4*〈varιi〉〉ι
〉
```
##### Output
```
23+4*0=23
23+4*1=27
23+4*2=31
```

<br><br><br>
### 〈forιiteratorNameιnιcontentιseperator〉
Repeats `n` times its `content`. Loop index (0-based) can be accessed as variable `iteratorName`.  
Optional `seperator` can be defined, which will be placed between each iteration. In here variable `iteratorName` is also present, and represents loop index of the previous element.

#### Examples
##### Input
```
〈forιiι15ι+-〉
```
##### Output
```
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
```


---
##### Input
```
〈forιiι3ιIteration 〈varιi〉ι
〉
```
##### Output
```
Iteration 0
Iteration 1
Iteration 2
```


---
##### Input
```
[〈forιiι5ι'item〈varιi〉'ι〈forιjι〈varιiι+1〉ι, ιreserved〉〉]
```
##### Output
```
['item0', 'item1', reserved, 'item2', reserved, reserved, 'item3', reserved, reserved, reserved, 'item4']
```

<br><br><br>
### 〈ifιconditionιifTrueιifFalse〉
If `condition` is true (checked by evaluating as javascript), returns `ifTrue`. Otherwise returns `ifFalse`.  
`ifFalse` is potional and defaults to "".

#### Examples
##### Input
```
〈forιiι5ι〈ifι〈varιi〉%2==0ιHey! ιHo! 〉〉
```
##### Output
```
Hey! Ho! Hey! Ho! Hey! 
```

<br><br><br>
### 〈indexιindex numberιelement 0ιelement 1ιelement 2ι...〉
Return `index number` element given as next arguments. Overflowing is completely safe, and defaults to "".

#### Examples
##### Input
```
〈forιiι3ι〈indexι〈varιi〉ιaιbιcιd〉〉
```
##### Output
```
abc
```

<br><br><br>
### 〈readSpaceιspacename〉
Returns contents of space with name `spacename`.

#### Examples
##### Input
```
〈forιiι5ιHi 〈indexᛍnameι〈varιi〉ιAdamιMonikaιStefanιRichardιBob〉! 〈toSpaceιgreetedι〈varιname〉, 〉〉
Greeted 〈readSpaceιgreeted〉
```
##### Output
```
Hi Adam! Hi Monika! Hi Stefan! Hi Richard! Hi Bob! 
Greeted Adam, Monika, Stefan, Richard, Bob, 
```

<br><br><br>
### 〈romanιnumber〉
Convert `number` into roman numerals.

#### Examples
##### Input
```
〈forιiι20ι〈romanι〈varιiι+1〉〉ι, 〉
```
##### Output
```
I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII, XIII, XIV, XV, XVI, XVII, XVIII, XIX, XX
```

<br><br><br>
### 〈roundιvalueιprecision〉
Rounds `value` with given `precision`. If `precision` is not given, it will just round to nearest integer.

#### Examples
##### Input
```
[〈forιiι6ι〈roundι〈varιi〉*1.3333〉ι,〉]
```
##### Output
```
[0,1,3,4,5,7]
```


---
##### Input
```
〈forιiι12ι〈evalι〈varιi〉*0.1〉 -> 〈roundι〈varιi〉*0.1ι0.25〉ι; 〉
```
##### Output
```
0 -> 0; 0.1 -> 0; 0.2 -> 0.25; 0.30000000000000004 -> 0.25; 0.4 -> 0.5; 0.5 -> 0.5; 0.6000000000000001 -> 0.5; 0.7000000000000001 -> 0.75; 0.8 -> 0.75; 0.9 -> 1; 1 -> 1; 1.1 -> 1
```

<br><br><br>
### 〈runιnameιparameter 0ιparameter 1ιparameter 2ι...〉
Calls function with `name` (previously defined with `def` command). Parameters are passed directly into that function.

#### Examples
##### Input
```
〈defιshoutιparιO what a magic 〈varιpar_0〉 I see there! Oh, and a 〈varιpar_1〉! And 〈varιpar_countι-2〉 more beautiful creatures!〉
〈runιshoutιhorseιrabbitιcowιsheep〉
```
##### Output
```

O what a magic horse I see there! Oh, and a rabbit! And 2 more beautiful creatures!
```


---
##### Input
```
〈defιReport ChangesιpιThere 〈ifι〈varιp_0〉==0ιwere noι〈ifι〈varιp_0〉==1ιwas 1ιwere 〈varιp_0〉〉〉 〈varιp_1〉 change〈ifι〈varιp_0〉!=1ιs〉〈ifι〈varιp_0〉>0ι, proceed with caution〉.〉
Version 1.0.0
  〈runιReport Changesι3ιbreaking〉
  〈runιReport Changesι7ιmajor〉
Version 0.4.2
  〈runιReport Changesι0ιmajor〉
Version 0.4.0
  〈runιReport Changesι1ιbreaking〉
  〈runιReport Changesι2ιexperimental〉
```
##### Output
```

Version 1.0.0
  There were 3 breaking changes, proceed with caution.
  There were 7 major changes, proceed with caution.
Version 0.4.2
  There were no major changes.
Version 0.4.0
  There was 1 breaking change, proceed with caution.
  There were 2 experimental changes, proceed with caution.
```


---
##### Input
```
〈defιfancy_listιparι〈forιiι〈varιpar_count〉ι> 〈varιpar_〈varιi〉〉ι
〉〉〈runιfancy_listιItem 1ιItem 2ιItem PIιSomething elseιAnd this as well〉
```
##### Output
```
> Item 1
> Item 2
> Item PI
> Something else
> And this as well
```

<br><br><br>
### 〈toFileιfilenameιcontent〉
Saves `content` to a file with path `filename`.

#### Examples
##### Input
```
unimplemented = {〈forιiι4ι〈toFileιtodo.txtιImplement 〈indexᛍnameι〈varιi〉ιsigmaιdeltoidιbanana-shapedιinverse〉 feature
〉〈varιname〉: trueι, 〉}
```
##### Output
```
unimplemented = {sigma: true, deltoid: true, banana-shaped: true, inverse: true}
```
*todo.txt*
```
Implement sigma feature
Implement deltoid feature
Implement banana-shaped feature
Implement inverse feature

```


---
##### Input
```
〈forιiι3ι〈forιjι4ι〈toFileιfile〈varιi〉ι〈varιi〉: 〈varιj〉, 〉〉〉
```
##### Output
*file0*
```
0: 0, 0: 1, 0: 2, 0: 3, 
```
*file1*
```
1: 0, 1: 1, 1: 2, 1: 3, 
```
*file2*
```
2: 0, 2: 1, 2: 2, 2: 3, 
```

<br><br><br>
### 〈toSpaceιspacenameιcontent〉
Adds `content` to a space with name `spacename`, which can later be accessed with `readSpace` command.

#### Examples
##### Input
```
〈forιiι5ιHi 〈indexᛍnameι〈varιi〉ιAdamιMonikaιStefanιRichardιBob〉! 〈toSpaceιgreetedι〈varιname〉, 〉〉
Greeted 〈readSpaceιgreeted〉
```
##### Output
```
Hi Adam! Hi Monika! Hi Stefan! Hi Richard! Hi Bob! 
Greeted Adam, Monika, Stefan, Richard, Bob, 
```

<br><br><br>
### 〈uidιpatternιvalue〉
Generate uid in given `pattern`, where each alpha-numeric character represents max value for this spot. If `value` isn't given, a random one will be automatically generated.

#### Examples
##### Input
```
〈forιiι9ι〈uidιFFF-ff.f〉ι
〉
```
##### Output
```
FDF-01.d
195-33.8
A1E-3b.e
093-c6.5
8C9-c7.4
60F-6a.f
C01-b9.4
624-2e.9
AAA-67.0
```


---
##### Input
```
〈forιiι9ι〈uidι321ι〈varιi〉〉ι
〉
```
##### Output
```
000
001
010
011
020
021
100
101
110
```

<br><br><br>
### 〈varιnameιoperation〉
Returns variable with given `name`. If variable doesn't exist, "" will be returned instead.  
Optional `operation` can be defined, which will be added at the end of the current value and then evaluated. This doesn't change the actual value of the variable, only the return value of this command.

#### Examples
##### Input
```
〈forιiι3ιIteration 〈varιi〉
〉
```
##### Output
```
Iteration 0
Iteration 1
Iteration 2

```


---
##### Input
```
〈forιiι5ιIteration 〈varιiι*2+1〉
〉
```
##### Output
```
Iteration 1
Iteration 3
Iteration 5
Iteration 7
Iteration 9

```

<br><br><br>