var _typeof=require('@babel/runtime/helpers/typeof');ace.define('ace/snippets/graphqlschema',['require','exports','module'],(function(e,n,t){'use strict';n.snippetText='# Type Snippet\ntrigger type\nsnippet type\n\ttype ${1:type_name} {\n\t\t${2:type_siblings}\n\t}\n\n# Input Snippet\ntrigger input\nsnippet input\n\tinput ${1:input_name} {\n\t\t${2:input_siblings}\n\t}\n\n# Interface Snippet\ntrigger interface\nsnippet interface\n\tinterface ${1:interface_name} {\n\t\t${2:interface_siblings}\n\t}\n\n# Interface Snippet\ntrigger union\nsnippet union\n\tunion ${1:union_name} = ${2:type} | ${3: type}\n\n# Enum Snippet\ntrigger enum\nsnippet enum\n\tenum ${1:enum_name} {\n\t\t${2:enum_siblings}\n\t}\n',n.scope='graphqlschema'})),function(){ace.require(['ace/snippets/graphqlschema'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();