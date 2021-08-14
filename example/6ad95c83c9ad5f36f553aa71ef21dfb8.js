var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.string.split.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.string.replace.js'),require('core-js/modules/es.string.search.js'),require('core-js/modules/es.array.slice.js'),ace.define('ace/mode/crystal_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),s=e('./text_highlight_rules').TextHighlightRules,o=function(){var e='puts|initialize|previous_def|typeof|as|pointerof|sizeof|instance_sizeof',t='if|end|else|elsif|unless|case|when|break|while|next|until|def|return|class|new|getter|setter|property|lib|fun|do|struct|private|protected|public|module|super|abstract|include|extend|begin|enum|raise|yield|with|alias|rescue|ensure|macro|uninitialized|union|type|require',n='true|TRUE|false|FALSE|nil|NIL|__LINE__|__END_LINE__|__FILE__|__DIR__',r='$DEBUG|$defout|$FILENAME|$LOAD_PATH|$SAFE|$stdin|$stdout|$stderr|$VERBOSE|root_url|flash|session|cookies|params|request|response|logger|self',s=this.$keywords=this.createKeywordMapper({keyword:t,'constant.language':n,'variable.language':r,'support.function':e},'identifier'),o='(?:0[xX][\\dA-Fa-f]+)',a='(?:[0-9][\\d_]*)',i='(?:0o[0-7][0-7]*)',g='(?:0[bB][01]+)',u='(?:[+-]?)(?:'+o+'|'+a+'|'+i+'|'+g+')(?:_?[iIuU](?:8|16|32|64))?\\b',p=/\\(?:[nsrtvfbae'"\\]|[0-7]{3}|x[\da-fA-F]{2}|u[\da-fA-F]{4}|u{[\da-fA-F]{1,6}})/,l=/\\(?:[nsrtvfbae'"\\]|[0-7]{3}|x[\da-fA-F]{2}|u[\da-fA-F]{4}|u{[\da-fA-F]{1,6}}|u{(:?[\da-fA-F]{2}\s)*[\da-fA-F]{2}})/;this.$rules={start:[{token:'comment',regex:'#.*$'},{token:'string.regexp',regex:'[/]',push:[{token:'constant.language.escape',regex:l},{token:'string.regexp',regex:'[/][imx]*(?=[).,;\\s]|$)',next:'pop'},{defaultToken:'string.regexp'}]},[{regex:'[{}]',onMatch:function(e,t,n){return this.next='{'==e?this.nextState:'','{'==e&&n.length?(n.unshift('start',t),'paren.lparen'):'}'==e&&n.length&&(n.shift(),this.next=n.shift(),-1!=this.next.indexOf('string'))?'paren.end':'{'==e?'paren.lparen':'paren.rparen'},nextState:'start'},{token:'string.start',regex:/"/,push:[{token:'constant.language.escape',regex:l},{token:'string',regex:/\\#{/},{token:'paren.start',regex:/#{/,push:'start'},{token:'string.end',regex:/"/,next:'pop'},{defaultToken:'string'}]},{token:'string.start',regex:/`/,push:[{token:'constant.language.escape',regex:l},{token:'string',regex:/\\#{/},{token:'paren.start',regex:/#{/,push:'start'},{token:'string.end',regex:/`/,next:'pop'},{defaultToken:'string'}]},{stateName:'rpstring',token:'string.start',regex:/%[Qx]?\(/,push:[{token:'constant.language.escape',regex:l},{token:'string.start',regex:/\(/,push:'rpstring'},{token:'string.end',regex:/\)/,next:'pop'},{token:'paren.start',regex:/#{/,push:'start'},{defaultToken:'string'}]},{stateName:'spstring',token:'string.start',regex:/%[Qx]?\[/,push:[{token:'constant.language.escape',regex:l},{token:'string.start',regex:/\[/,push:'spstring'},{token:'string.end',regex:/]/,next:'pop'},{token:'paren.start',regex:/#{/,push:'start'},{defaultToken:'string'}]},{stateName:'fpstring',token:'string.start',regex:/%[Qx]?{/,push:[{token:'constant.language.escape',regex:l},{token:'string.start',regex:/{/,push:'fpstring'},{token:'string.end',regex:/}/,next:'pop'},{token:'paren.start',regex:/#{/,push:'start'},{defaultToken:'string'}]},{stateName:'tpstring',token:'string.start',regex:/%[Qx]?</,push:[{token:'constant.language.escape',regex:l},{token:'string.start',regex:/</,push:'tpstring'},{token:'string.end',regex:/>/,next:'pop'},{token:'paren.start',regex:/#{/,push:'start'},{defaultToken:'string'}]},{stateName:'ppstring',token:'string.start',regex:/%[Qx]?\|/,push:[{token:'constant.language.escape',regex:l},{token:'string.end',regex:/\|/,next:'pop'},{token:'paren.start',regex:/#{/,push:'start'},{defaultToken:'string'}]},{stateName:'rpqstring',token:'string.start',regex:/%[qwir]\(/,push:[{token:'string.start',regex:/\(/,push:'rpqstring'},{token:'string.end',regex:/\)/,next:'pop'},{defaultToken:'string'}]},{stateName:'spqstring',token:'string.start',regex:/%[qwir]\[/,push:[{token:'string.start',regex:/\[/,push:'spqstring'},{token:'string.end',regex:/]/,next:'pop'},{defaultToken:'string'}]},{stateName:'fpqstring',token:'string.start',regex:/%[qwir]{/,push:[{token:'string.start',regex:/{/,push:'fpqstring'},{token:'string.end',regex:/}/,next:'pop'},{defaultToken:'string'}]},{stateName:'tpqstring',token:'string.start',regex:/%[qwir]</,push:[{token:'string.start',regex:/</,push:'tpqstring'},{token:'string.end',regex:/>/,next:'pop'},{defaultToken:'string'}]},{stateName:'ppqstring',token:'string.start',regex:/%[qwir]\|/,push:[{token:'string.end',regex:/\|/,next:'pop'},{defaultToken:'string'}]},{token:'string.start',regex:/'/,push:[{token:'constant.language.escape',regex:p},{token:'string.end',regex:/'|$/,next:'pop'},{defaultToken:'string'}]}],{token:'text',regex:'::'},{token:'variable.instance',regex:'@{1,2}[a-zA-Z_\\d]+'},{token:'variable.fresh',regex:'%[a-zA-Z_\\d]+'},{token:'support.class',regex:'[A-Z][a-zA-Z_\\d]+'},{token:'constant.other.symbol',regex:'[:](?:(?:===|<=>|\\[]\\?|\\[]=|\\[]|>>|\\*\\*|<<|==|!=|>=|<=|!~|=~|<|\\+|-|\\*|\\/|%|&|\\||\\^|>|!|~)|(?:(?:[A-Za-z_]|[@$](?=[a-zA-Z0-9_]))[a-zA-Z0-9_]*[!=?]?))'},{token:'constant.numeric',regex:'[+-]?\\d(?:\\d|_(?=\\d))*(?:(?:\\.\\d(?:\\d|_(?=\\d))*)?(?:[eE][+-]?\\d+)?)?(?:_?[fF](?:32|64))?\\b'},{token:'constant.numeric',regex:u},{token:'constant.other.symbol',regex:':"',push:[{token:'constant.language.escape',regex:l},{token:'constant.other.symbol',regex:'"',next:'pop'},{defaultToken:'constant.other.symbol'}]},{token:'constant.language.boolean',regex:'(?:true|false)\\b'},{token:'support.function',regex:'(?:is_a\\?|nil\\?|responds_to\\?|as\\?)'},{token:s,regex:'[a-zA-Z_$][a-zA-Z0-9_$!?]*\\b'},{token:'variable.system',regex:'\\$\\!|\\$\\?'},{token:'punctuation.separator.key-value',regex:'=>'},{stateName:'heredoc',onMatch:function(e,t,n){var r='heredoc',s=e.split(this.splitRegex);return n.push(r,s[3]),[{type:'constant',value:s[1]},{type:'string',value:s[2]},{type:'support.class',value:s[3]},{type:'string',value:s[4]}]},regex:'(<<-)([\']?)([\\w]+)([\']?)',rules:{heredoc:[{token:'string',regex:'^ +'},{onMatch:function(e,t,n){return e===n[1]?(n.shift(),n.shift(),this.next=n[0]||'start','support.class'):(this.next='','string')},regex:'.*$',next:'start'}]}},{regex:'$',token:'empty',next:function(e,t){return'heredoc'===t[0]?t[0]:e}},{token:'punctuation.operator',regex:/[.]\s*(?![.])/,push:[{token:'punctuation.operator',regex:/[.]\s*(?![.])/},{token:'support.function',regex:'[a-zA-Z_$][a-zA-Z0-9_$]*\\b'},{regex:'',token:'empty',next:'pop'}]},{token:'keyword.operator',regex:'!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|\\?|\\:|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\^|\\|'},{token:'punctuation.operator',regex:/[?:,;.]/},{token:'paren.lparen',regex:'[[({]'},{token:'paren.rparen',regex:'[\\])}]'},{token:'text',regex:'\\s+'}]},this.normalizeRules()};r.inherits(o,s),t.CrystalHighlightRules=o})),ace.define('ace/mode/matching_brace_outdent',['require','exports','module','ace/range'],(function(e,t,n){'use strict';var r=e('../range').Range,s=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t),s=n.match(/^(\s*\})/);if(!s)return 0;var o=s[1].length,a=e.findMatchingBracket({row:t,column:o});if(!a||a.row==t)return 0;var i=this.$getIndent(e.getLine(a.row));e.replace(new r(t,0,t,o-1),i)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(s.prototype),t.MatchingBraceOutdent=s})),ace.define('ace/mode/folding/coffee',['require','exports','module','ace/lib/oop','ace/mode/folding/fold_mode','ace/range'],(function(e,t,n){'use strict';var r=e('../../lib/oop'),s=e('./fold_mode').FoldMode,o=e('../../range').Range,a=t.FoldMode=function(){};r.inherits(a,s),function(){this.getFoldWidgetRange=function(e,t,n){var r=this.indentationBlock(e,n);if(r)return r;var s=/\S/,a=e.getLine(n),i=a.search(s);if(-1!=i&&'#'==a[i]){var g=a.length,u=e.getLength(),p=n,l=n;while(++n<u){a=e.getLine(n);var c=a.search(s);if(-1!=c){if('#'!=a[c])break;l=n}}if(l>p){var d=e.getLine(l).length;return new o(p,g,l,d)}}},this.getFoldWidget=function(e,t,n){var r=e.getLine(n),s=r.search(/\S/),o=e.getLine(n+1),a=e.getLine(n-1),i=a.search(/\S/),g=o.search(/\S/);if(-1==s)return e.foldWidgets[n-1]=-1!=i&&i<g?'start':'','';if(-1==i){if(s==g&&'#'==r[s]&&'#'==o[s])return e.foldWidgets[n-1]='',e.foldWidgets[n+1]='','start'}else if(i==s&&'#'==r[s]&&'#'==a[s]&&-1==e.getLine(n-2).search(/\S/))return e.foldWidgets[n-1]='start',e.foldWidgets[n+1]='','';return e.foldWidgets[n-1]=-1!=i&&i<s?'start':'',s<g?'start':''}}.call(a.prototype)})),ace.define('ace/mode/crystal',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/crystal_highlight_rules','ace/mode/matching_brace_outdent','ace/range','ace/mode/behaviour/cstyle','ace/mode/folding/coffee'],(function(e,t,n){'use strict';var r=e('../lib/oop'),s=e('./text').Mode,o=e('./crystal_highlight_rules').CrystalHighlightRules,a=e('./matching_brace_outdent').MatchingBraceOutdent,i=e('../range').Range,g=e('./behaviour/cstyle').CstyleBehaviour,u=e('./folding/coffee').FoldMode,p=function(){this.HighlightRules=o,this.$outdent=new a,this.$behaviour=new g,this.foldingRules=new u};r.inherits(p,s),function(){this.lineCommentStart='#',this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),s=this.getTokenizer().getLineTokens(t,e),o=s.tokens;if(o.length&&'comment'==o[o.length-1].type)return r;if('start'==e){var a=t.match(/^.*[\{\(\[]\s*$/),i=t.match(/^\s*(class|def|module)\s.*$/),g=t.match(/.*do(\s*|\s+\|.*\|\s*)$/),u=t.match(/^\s*(if|else|when)\s*/);(a||i||g||u)&&(r+=n)}return r},this.checkOutdent=function(e,t,n){return/^\s+(end|else)$/.test(t+n)||this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){var r=t.getLine(n);if(/}/.test(r))return this.$outdent.autoOutdent(t,n);var s=this.$getIndent(r),o=t.getLine(n-1),a=this.$getIndent(o),g=t.getTabString();a.length<=s.length&&s.slice(-g.length)==g&&t.remove(new i(n,s.length-g.length,n,s.length))},this.$id='ace/mode/crystal'}.call(p.prototype),t.Mode=p})),function(){ace.require(['ace/mode/crystal'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();