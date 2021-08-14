var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.string.trim.js'),require('core-js/modules/es.string.replace.js'),ace.define('ace/mode/lua_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./text_highlight_rules').TextHighlightRules,i=function(){var e='break|do|else|elseif|end|for|function|if|in|local|repeat|return|then|until|while|or|and|not',t='true|false|nil|_G|_VERSION',n='string|xpcall|package|tostring|print|os|unpack|require|getfenv|setmetatable|next|assert|tonumber|io|rawequal|collectgarbage|getmetatable|module|rawset|math|debug|pcall|table|newproxy|type|coroutine|_G|select|gcinfo|pairs|rawget|loadstring|ipairs|_VERSION|dofile|setfenv|load|error|loadfile|sub|upper|len|gfind|rep|find|match|char|dump|gmatch|reverse|byte|format|gsub|lower|preload|loadlib|loaded|loaders|cpath|config|path|seeall|exit|setlocale|date|getenv|difftime|remove|time|clock|tmpname|rename|execute|lines|write|close|flush|open|output|type|read|stderr|stdin|input|stdout|popen|tmpfile|log|max|acos|huge|ldexp|pi|cos|tanh|pow|deg|tan|cosh|sinh|random|randomseed|frexp|ceil|floor|rad|abs|sqrt|modf|asin|min|mod|fmod|log10|atan2|exp|sin|atan|getupvalue|debug|sethook|getmetatable|gethook|setmetatable|setlocal|traceback|setfenv|getinfo|setupvalue|getlocal|getregistry|getfenv|setn|insert|getn|foreachi|maxn|foreach|concat|sort|remove|resume|yield|status|wrap|create|running|__add|__sub|__mod|__unm|__concat|__lt|__index|__call|__gc|__metatable|__mul|__div|__pow|__len|__eq|__le|__newindex|__tostring|__mode|__tonumber',r='string|package|os|io|math|debug|table|coroutine',o='setn|foreach|foreachi|gcinfo|log10|maxn',i=this.createKeywordMapper({keyword:e,'support.function':n,'keyword.deprecated':o,'constant.library':r,'constant.language':t,'variable.language':'self'},'identifier'),a='(?:(?:[1-9]\\d*)|(?:0))',l='(?:0[xX][\\dA-Fa-f]+)',s='(?:'+a+'|'+l+')',u='(?:\\.\\d+)',d='(?:\\d+)',g='(?:(?:'+d+'?'+u+')|(?:'+d+'\\.))',c='(?:'+g+')';this.$rules={start:[{stateName:'bracketedComment',onMatch:function(e,t,n){return n.unshift(this.next,e.length-2,t),'comment'},regex:/\-\-\[=*\[/,next:[{onMatch:function(e,t,n){return e.length==n[1]?(n.shift(),n.shift(),this.next=n.shift()):this.next='','comment'},regex:/\]=*\]/,next:'start'},{defaultToken:'comment'}]},{token:'comment',regex:'\\-\\-.*$'},{stateName:'bracketedString',onMatch:function(e,t,n){return n.unshift(this.next,e.length,t),'string.start'},regex:/\[=*\[/,next:[{onMatch:function(e,t,n){return e.length==n[1]?(n.shift(),n.shift(),this.next=n.shift()):this.next='','string.end'},regex:/\]=*\]/,next:'start'},{defaultToken:'string'}]},{token:'string',regex:'"(?:[^\\\\]|\\\\.)*?"'},{token:'string',regex:'\'(?:[^\\\\]|\\\\.)*?\''},{token:'constant.numeric',regex:c},{token:'constant.numeric',regex:s+'\\b'},{token:i,regex:'[a-zA-Z_$][a-zA-Z0-9_$]*\\b'},{token:'keyword.operator',regex:'\\+|\\-|\\*|\\/|%|\\#|\\^|~|<|>|<=|=>|==|~=|=|\\:|\\.\\.\\.|\\.\\.'},{token:'paren.lparen',regex:'[\\[\\(\\{]'},{token:'paren.rparen',regex:'[\\]\\)\\}]'},{token:'text',regex:'\\s+|\\w+'}]},this.normalizeRules()};r.inherits(i,o),t.LuaHighlightRules=i})),ace.define('ace/mode/folding/lua',['require','exports','module','ace/lib/oop','ace/mode/folding/fold_mode','ace/range','ace/token_iterator'],(function(e,t,n){'use strict';var r=e('../../lib/oop'),o=e('./fold_mode').FoldMode,i=e('../../range').Range,a=e('../../token_iterator').TokenIterator,l=t.FoldMode=function(){};r.inherits(l,o),function(){this.foldingStartMarker=/\b(function|then|do|repeat)\b|{\s*$|(\[=*\[)/,this.foldingStopMarker=/\bend\b|^\s*}|\]=*\]/,this.getFoldWidget=function(e,t,n){var r=e.getLine(n),o=this.foldingStartMarker.test(r),i=this.foldingStopMarker.test(r);if(o&&!i){var a=r.match(this.foldingStartMarker);if('then'==a[1]&&/\belseif\b/.test(r))return;if(a[1]){if('keyword'===e.getTokenAt(n,a.index+1).type)return'start'}else{if(!a[2])return'start';var l=e.bgTokenizer.getState(n)||'';if('bracketedComment'==l[0]||'bracketedString'==l[0])return'start'}}if('markbeginend'!=t||!i||o&&i)return'';a=r.match(this.foldingStopMarker);if('end'===a[0]){if('keyword'===e.getTokenAt(n,a.index+1).type)return'end'}else{if(']'!==a[0][0])return'end';l=e.bgTokenizer.getState(n-1)||'';if('bracketedComment'==l[0]||'bracketedString'==l[0])return'end'}},this.getFoldWidgetRange=function(e,t,n){var r=e.doc.getLine(n),o=this.foldingStartMarker.exec(r);if(o)return o[1]?this.luaBlock(e,n,o.index+1):o[2]?e.getCommentFoldRange(n,o.index+1):this.openingBracketBlock(e,'{',n,o.index);o=this.foldingStopMarker.exec(r);return o?'end'===o[0]&&'keyword'===e.getTokenAt(n,o.index+1).type?this.luaBlock(e,n,o.index+1):']'===o[0][0]?e.getCommentFoldRange(n,o.index+1):this.closingBracketBlock(e,'}',n,o.index+o[0].length):void 0},this.luaBlock=function(e,t,n,r){var o=new a(e,t,n),l={function:1,do:1,then:1,elseif:-1,end:-1,repeat:1,until:-1},s=o.getCurrentToken();if(s&&'keyword'==s.type){var u=s.value,d=[u],g=l[u];if(g){var c=-1===g?o.getCurrentTokenColumn():e.getLine(t).length,h=t;o.step=-1===g?o.stepBackward:o.stepForward;while(s=o.step())if('keyword'===s.type){var f=g*l[s.value];if(f>0)d.unshift(s.value);else if(f<=0){if(d.shift(),!d.length&&'elseif'!=s.value)break;0===f&&d.unshift(s.value)}}if(!s)return null;if(r)return o.getCurrentTokenRange();t=o.getCurrentTokenRow();return-1===g?new i(t,e.getLine(t).length,h,c):new i(h,c,t,o.getCurrentTokenColumn())}}}}.call(l.prototype)})),ace.define('ace/mode/lua',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/lua_highlight_rules','ace/mode/folding/lua','ace/range','ace/worker/worker_client'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./text').Mode,i=e('./lua_highlight_rules').LuaHighlightRules,a=e('./folding/lua').FoldMode,l=e('../range').Range,s=e('../worker/worker_client').WorkerClient,u=function(){this.HighlightRules=i,this.foldingRules=new a,this.$behaviour=this.$defaultBehaviour};r.inherits(u,o),function(){this.lineCommentStart='--',this.blockComment={start:'--[',end:']--'};var e={function:1,then:1,do:1,else:1,elseif:1,repeat:1,end:-1,until:-1},t=['else','elseif','end','until'];function n(t){for(var n=0,r=0;r<t.length;r++){var o=t[r];'keyword'==o.type?o.value in e&&(n+=e[o.value]):'paren.lparen'==o.type?n+=o.value.length:'paren.rparen'==o.type&&(n-=o.value.length)}return n<0?-1:n>0?1:0}this.getNextLineIndent=function(e,t,r){var o=this.$getIndent(t),i=0,a=this.getTokenizer().getLineTokens(t,e),l=a.tokens;return'start'==e&&(i=n(l)),i>0?o+r:i<0&&o.substr(o.length-r.length)==r&&!this.checkOutdent(e,t,'\n')?o.substr(0,o.length-r.length):o},this.checkOutdent=function(e,n,r){if('\n'!=r&&'\r'!=r&&'\r\n'!=r)return!1;if(n.match(/^\s*[\)\}\]]$/))return!0;var o=this.getTokenizer().getLineTokens(n.trim(),e).tokens;return!(!o||!o.length)&&('keyword'==o[0].type&&-1!=t.indexOf(o[0].value))},this.getMatching=function(t,n,r){if(void 0==n){var o=t.selection.lead;r=o.column,n=o.row}var i=t.getTokenAt(n,r);if(i&&i.value in e)return this.foldingRules.luaBlock(t,n,r,!0)},this.autoOutdent=function(e,t,n){var r=t.getLine(n),o=r.match(/^\s*/)[0].length;if(o&&n){var i=this.getMatching(t,n,o+1);if(i&&i.start.row!=n){var a=this.$getIndent(t.getLine(i.start.row));a.length!=o&&(t.replace(new l(n,0,n,o),a),t.outdentRows(new l(n+1,0,n+1,0)))}}},this.createWorker=function(e){var t=new s(['ace'],'ace/mode/lua_worker','Worker');return t.attachToDocument(e.getDocument()),t.on('annotate',(function(t){e.setAnnotations(t.data)})),t.on('terminate',(function(){e.clearAnnotations()})),t},this.$id='ace/mode/lua',this.snippetFileId='ace/snippets/lua'}.call(u.prototype),t.Mode=u})),function(){ace.require(['ace/mode/lua'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();