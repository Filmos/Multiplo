〈〉ιᛍ⦻
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