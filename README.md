# Multiplo
Something about this tool, idk

## Usage
Base explanation

### Atom
How to use it in atom

## Commands
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

### 〈indexιindexιelement 0ιelement 1ιelement 2ι...〉
Return `index` element given as next arguments. Overflowing is completely safe, and defaults to "".

#### Examples
##### Input
```
〈forιiι3ι〈indexι〈varιi〉ιaιbιcιd〉〉
```
 ##### Output
```
abc
```

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
