var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.regexp.constructor.js'),require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.regexp.to-string.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.string.trim.js'),require('core-js/modules/es.array.slice.js'),ace.define('ace/mode/python_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),s=e('./text_highlight_rules').TextHighlightRules,i=function(){var e='and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield|async|await|nonlocal',t='True|False|None|NotImplemented|Ellipsis|__debug__',n='abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|binfile|bin|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|apply|delattr|help|next|setattr|set|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern|ascii|breakpoint|bytes',r=this.createKeywordMapper({'invalid.deprecated':'debugger','support.function':n,'variable.language':'self|cls','constant.language':t,keyword:e},'identifier'),s='[uU]?',i='[rR]',o='[fF]',g='(?:[rR][fF]|[fF][rR])',a='(?:(?:[1-9]\\d*)|(?:0))',l='(?:0[oO]?[0-7]+)',u='(?:0[xX][\\dA-Fa-f]+)',x='(?:0[bB][01]+)',p='(?:'+a+'|'+l+'|'+u+'|'+x+')',c='(?:[eE][+-]?\\d+)',d='(?:\\.\\d+)',f='(?:\\d+)',k='(?:(?:'+f+'?'+d+')|(?:'+f+'\\.))',h='(?:(?:'+k+'|'+f+')'+c+')',q='(?:'+h+'|'+k+')',m='\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv\'"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})';this.$rules={start:[{token:'comment',regex:'#.*$'},{token:'string',regex:s+'"{3}',next:'qqstring3'},{token:'string',regex:s+'"(?=.)',next:'qqstring'},{token:'string',regex:s+'\'{3}',next:'qstring3'},{token:'string',regex:s+'\'(?=.)',next:'qstring'},{token:'string',regex:i+'"{3}',next:'rawqqstring3'},{token:'string',regex:i+'"(?=.)',next:'rawqqstring'},{token:'string',regex:i+'\'{3}',next:'rawqstring3'},{token:'string',regex:i+'\'(?=.)',next:'rawqstring'},{token:'string',regex:o+'"{3}',next:'fqqstring3'},{token:'string',regex:o+'"(?=.)',next:'fqqstring'},{token:'string',regex:o+'\'{3}',next:'fqstring3'},{token:'string',regex:o+'\'(?=.)',next:'fqstring'},{token:'string',regex:g+'"{3}',next:'rfqqstring3'},{token:'string',regex:g+'"(?=.)',next:'rfqqstring'},{token:'string',regex:g+'\'{3}',next:'rfqstring3'},{token:'string',regex:g+'\'(?=.)',next:'rfqstring'},{token:'keyword.operator',regex:'\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|@|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|='},{token:'punctuation',regex:',|:|;|\\->|\\+=|\\-=|\\*=|\\/=|\\/\\/=|%=|@=|&=|\\|=|^=|>>=|<<=|\\*\\*='},{token:'paren.lparen',regex:'[\\[\\(\\{]'},{token:'paren.rparen',regex:'[\\]\\)\\}]'},{token:'text',regex:'\\s+'},{include:'constants'}],qqstring3:[{token:'constant.language.escape',regex:m},{token:'string',regex:'"{3}',next:'start'},{defaultToken:'string'}],qstring3:[{token:'constant.language.escape',regex:m},{token:'string',regex:'\'{3}',next:'start'},{defaultToken:'string'}],qqstring:[{token:'constant.language.escape',regex:m},{token:'string',regex:'\\\\$',next:'qqstring'},{token:'string',regex:'"|$',next:'start'},{defaultToken:'string'}],qstring:[{token:'constant.language.escape',regex:m},{token:'string',regex:'\\\\$',next:'qstring'},{token:'string',regex:'\'|$',next:'start'},{defaultToken:'string'}],rawqqstring3:[{token:'string',regex:'"{3}',next:'start'},{defaultToken:'string'}],rawqstring3:[{token:'string',regex:'\'{3}',next:'start'},{defaultToken:'string'}],rawqqstring:[{token:'string',regex:'\\\\$',next:'rawqqstring'},{token:'string',regex:'"|$',next:'start'},{defaultToken:'string'}],rawqstring:[{token:'string',regex:'\\\\$',next:'rawqstring'},{token:'string',regex:'\'|$',next:'start'},{defaultToken:'string'}],fqqstring3:[{token:'constant.language.escape',regex:m},{token:'string',regex:'"{3}',next:'start'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'},{defaultToken:'string'}],fqstring3:[{token:'constant.language.escape',regex:m},{token:'string',regex:'\'{3}',next:'start'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'},{defaultToken:'string'}],fqqstring:[{token:'constant.language.escape',regex:m},{token:'string',regex:'\\\\$',next:'fqqstring'},{token:'string',regex:'"|$',next:'start'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'},{defaultToken:'string'}],fqstring:[{token:'constant.language.escape',regex:m},{token:'string',regex:'\'|$',next:'start'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'},{defaultToken:'string'}],rfqqstring3:[{token:'string',regex:'"{3}',next:'start'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'},{defaultToken:'string'}],rfqstring3:[{token:'string',regex:'\'{3}',next:'start'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'},{defaultToken:'string'}],rfqqstring:[{token:'string',regex:'\\\\$',next:'rfqqstring'},{token:'string',regex:'"|$',next:'start'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'},{defaultToken:'string'}],rfqstring:[{token:'string',regex:'\'|$',next:'start'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'},{defaultToken:'string'}],fqstringParRules:[{token:'paren.lparen',regex:'[\\[\\(]'},{token:'paren.rparen',regex:'[\\]\\)]'},{token:'string',regex:'\\s+'},{token:'string',regex:'\'[^\']*\''},{token:'string',regex:'"[^"]*"'},{token:'function.support',regex:'(!s|!r|!a)'},{include:'constants'},{token:'paren.rparen',regex:'}',next:'pop'},{token:'paren.lparen',regex:'{',push:'fqstringParRules'}],constants:[{token:'constant.numeric',regex:'(?:'+q+'|\\d+)[jJ]\\b'},{token:'constant.numeric',regex:q},{token:'constant.numeric',regex:p+'[lL]\\b'},{token:'constant.numeric',regex:p+'\\b'},{token:['punctuation','function.support'],regex:'(\\.)([a-zA-Z_]+)\\b'},{token:r,regex:'[a-zA-Z_$][a-zA-Z0-9_$]*\\b'}]},this.normalizeRules()};r.inherits(i,s),t.PythonHighlightRules=i})),ace.define('ace/mode/folding/pythonic',['require','exports','module','ace/lib/oop','ace/mode/folding/fold_mode'],(function(e,t,n){'use strict';var r=e('../../lib/oop'),s=e('./fold_mode').FoldMode,i=t.FoldMode=function(e){this.foldingStartMarker=new RegExp('([\\[{])(?:\\s*)$|('+e+')(?:\\s*)(?:#.*)?$')};r.inherits(i,s),function(){this.getFoldWidgetRange=function(e,t,n){var r=e.getLine(n),s=r.match(this.foldingStartMarker);if(s)return s[1]?this.openingBracketBlock(e,s[1],n,s.index):s[2]?this.indentationBlock(e,n,s.index+s[2].length):this.indentationBlock(e,n)}}.call(i.prototype)})),ace.define('ace/mode/python',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/python_highlight_rules','ace/mode/folding/pythonic','ace/range'],(function(e,t,n){'use strict';var r=e('../lib/oop'),s=e('./text').Mode,i=e('./python_highlight_rules').PythonHighlightRules,o=e('./folding/pythonic').FoldMode,g=e('../range').Range,a=function(){this.HighlightRules=i,this.foldingRules=new o('\\:'),this.$behaviour=this.$defaultBehaviour};r.inherits(a,s),function(){this.lineCommentStart='#',this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),s=this.getTokenizer().getLineTokens(t,e),i=s.tokens;if(i.length&&'comment'==i[i.length-1].type)return r;if('start'==e){var o=t.match(/^.*[\{\(\[:]\s*$/);o&&(r+=n)}return r};var e={pass:1,return:1,raise:1,break:1,continue:1};this.checkOutdent=function(t,n,r){if('\r\n'!==r&&'\r'!==r&&'\n'!==r)return!1;var s=this.getTokenizer().getLineTokens(n.trim(),t).tokens;if(!s)return!1;do{var i=s.pop()}while(i&&('comment'==i.type||'text'==i.type&&i.value.match(/^\s+$/)));return!!i&&('keyword'==i.type&&e[i.value])},this.autoOutdent=function(e,t,n){n+=1;var r=this.$getIndent(t.getLine(n)),s=t.getTabString();r.slice(-s.length)==s&&t.remove(new g(n,r.length-s.length,n,r.length))},this.$id='ace/mode/python',this.snippetFileId='ace/snippets/python'}.call(a.prototype),t.Mode=a})),function(){ace.require(['ace/mode/python'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();