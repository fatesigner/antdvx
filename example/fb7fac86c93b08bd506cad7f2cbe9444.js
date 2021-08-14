var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.regexp.constructor.js'),require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.regexp.to-string.js'),require('core-js/modules/es.string.replace.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.string.search.js'),ace.define('ace/mode/folding/cstyle',['require','exports','module','ace/lib/oop','ace/range','ace/mode/folding/fold_mode'],(function(e,t,n){'use strict';var r=e('../../lib/oop'),i=e('../../range').Range,o=e('./fold_mode').FoldMode,s=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,'|'+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,'|'+e.end)))};r.inherits(s,o),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var r=e.getLine(n);if(this.singleLineBlockCommentRe.test(r)&&!this.startRegionRe.test(r)&&!this.tripleStarBlockCommentRe.test(r))return'';var i=this._getFoldWidgetBase(e,t,n);return!i&&this.startRegionRe.test(r)?'start':i},this.getFoldWidgetRange=function(e,t,n,r){var i=e.getLine(n);if(this.startRegionRe.test(i))return this.getCommentRegionBlock(e,i,n);var o=i.match(this.foldingStartMarker);if(o){var s=o.index;if(o[1])return this.openingBracketBlock(e,o[1],n,s);var a=e.getCommentFoldRange(n,s+o[0].length,1);return a&&!a.isMultiLine()&&(r?a=this.getSectionRange(e,n):'all'!=t&&(a=null)),a}if('markbegin'!==t){o=i.match(this.foldingStopMarker);if(o){s=o.index+o[0].length;return o[1]?this.closingBracketBlock(e,o[1],n,s):e.getCommentFoldRange(n,s,-1)}}},this.getSectionRange=function(e,t){var n=e.getLine(t),r=n.search(/\S/),o=t,s=n.length;t+=1;var a=t,g=e.getLength();while(++t<g){n=e.getLine(t);var c=n.search(/\S/);if(-1!==c){if(r>c)break;var l=this.getFoldWidgetRange(e,'all',t);if(l){if(l.start.row<=o)break;if(l.isMultiLine())t=l.end.row;else if(r==c)break}a=t}}return new i(o,s,a,e.getLine(a).length)},this.getCommentRegionBlock=function(e,t,n){var r=t.search(/\s*$/),o=e.getLength(),s=n,a=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,g=1;while(++n<o){t=e.getLine(n);var c=a.exec(t);if(c&&(c[1]?g--:g++,!g))break}var l=n;if(l>s)return new i(s,r,l,t.length)}}.call(s.prototype)})),ace.define('ace/mode/tcl_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),i=e('./text_highlight_rules').TextHighlightRules,o=function(){this.$rules={start:[{token:'comment',regex:'#.*\\\\$',next:'commentfollow'},{token:'comment',regex:'#.*$'},{token:'support.function',regex:'[\\\\]$',next:'splitlineStart'},{token:'text',regex:/\\(?:["{}\[\]$\\])/},{token:'text',regex:'^|[^{][;][^}]|[/\r/]',next:'commandItem'},{token:'string',regex:'[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:'string',regex:'[ ]*["]',next:'qqstring'},{token:'variable.instance',regex:'[$]',next:'variable'},{token:'support.function',regex:'!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::'},{token:'identifier',regex:'[a-zA-Z_$][a-zA-Z0-9_$]*\\b'},{token:'paren.lparen',regex:'[[{]',next:'commandItem'},{token:'paren.lparen',regex:'[(]'},{token:'paren.rparen',regex:'[\\])}]'},{token:'text',regex:'\\s+'}],commandItem:[{token:'comment',regex:'#.*\\\\$',next:'commentfollow'},{token:'comment',regex:'#.*$',next:'start'},{token:'string',regex:'[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:'variable.instance',regex:'[$]',next:'variable'},{token:'support.function',regex:'(?:[:][:])[a-zA-Z0-9_/]+(?:[:][:])',next:'commandItem'},{token:'support.function',regex:'[a-zA-Z0-9_/]+(?:[:][:])',next:'commandItem'},{token:'support.function',regex:'(?:[:][:])',next:'commandItem'},{token:'paren.rparen',regex:'[\\])}]'},{token:'paren.lparen',regex:'[[({]'},{token:'support.function',regex:'!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::'},{token:'keyword',regex:'[a-zA-Z0-9_/]+',next:'start'}],commentfollow:[{token:'comment',regex:'.*\\\\$',next:'commentfollow'},{token:'comment',regex:'.+',next:'start'}],splitlineStart:[{token:'text',regex:'^.',next:'start'}],variable:[{token:'variable.instance',regex:'[a-zA-Z_\\d]+(?:[(][a-zA-Z_\\d]+[)])?',next:'start'},{token:'variable.instance',regex:'{?[a-zA-Z_\\d]+}?',next:'start'}],qqstring:[{token:'string',regex:'(?:[^\\\\]|\\\\.)*?["]',next:'start'},{token:'string',regex:'.+'}]}};r.inherits(o,i),t.TclHighlightRules=o})),ace.define('ace/mode/matching_brace_outdent',['require','exports','module','ace/range'],(function(e,t,n){'use strict';var r=e('../range').Range,i=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t),i=n.match(/^(\s*\})/);if(!i)return 0;var o=i[1].length,s=e.findMatchingBracket({row:t,column:o});if(!s||s.row==t)return 0;var a=this.$getIndent(e.getLine(s.row));e.replace(new r(t,0,t,o-1),a)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(i.prototype),t.MatchingBraceOutdent=i})),ace.define('ace/mode/tcl',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/folding/cstyle','ace/mode/tcl_highlight_rules','ace/mode/matching_brace_outdent','ace/range'],(function(e,t,n){'use strict';var r=e('../lib/oop'),i=e('./text').Mode,o=e('./folding/cstyle').FoldMode,s=e('./tcl_highlight_rules').TclHighlightRules,a=e('./matching_brace_outdent').MatchingBraceOutdent,g=(e('../range').Range,function(){this.HighlightRules=s,this.$outdent=new a,this.foldingRules=new o,this.$behaviour=this.$defaultBehaviour});r.inherits(g,i),function(){this.lineCommentStart='#',this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=this.getTokenizer().getLineTokens(t,e),o=i.tokens;if(o.length&&'comment'==o[o.length-1].type)return r;if('start'==e){var s=t.match(/^.*[\{\(\[]\s*$/);s&&(r+=n)}return r},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id='ace/mode/tcl',this.snippetFileId='ace/snippets/tcl'}.call(g.prototype),t.Mode=g})),function(){ace.require(['ace/mode/tcl'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();