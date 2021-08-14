var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.string.replace.js'),require('core-js/modules/es.regexp.constructor.js'),require('core-js/modules/es.regexp.to-string.js'),require('core-js/modules/es.string.search.js'),ace.define('ace/mode/doc_comment_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./text_highlight_rules').TextHighlightRules,i=function e(){this.$rules={start:[{token:'comment.doc.tag',regex:'@[\\w\\d_]+'},e.getTagRule(),{defaultToken:'comment.doc',caseInsensitive:!0}]}};r.inherits(i,o),i.getTagRule=function(e){return{token:'comment.doc.tag.storage.type',regex:'\\b(?:TODO|FIXME|XXX|HACK)\\b'}},i.getStartRule=function(e){return{token:'comment.doc',regex:'\\/\\*(?=\\*)',next:e}},i.getEndRule=function(e){return{token:'comment.doc',regex:'\\*\\/',next:e}},t.DocCommentHighlightRules=i})),ace.define('ace/mode/c_cpp_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/doc_comment_highlight_rules','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./doc_comment_highlight_rules').DocCommentHighlightRules,i=e('./text_highlight_rules').TextHighlightRules,l=t.cFunctions='\\b(?:hypot(?:f|l)?|s(?:scanf|ystem|nprintf|ca(?:nf|lb(?:n(?:f|l)?|ln(?:f|l)?))|i(?:n(?:h(?:f|l)?|f|l)?|gn(?:al|bit))|tr(?:s(?:tr|pn)|nc(?:py|at|mp)|c(?:spn|hr|oll|py|at|mp)|to(?:imax|d|u(?:l(?:l)?|max)|k|f|l(?:d|l)?)|error|pbrk|ftime|len|rchr|xfrm)|printf|et(?:jmp|vbuf|locale|buf)|qrt(?:f|l)?|w(?:scanf|printf)|rand)|n(?:e(?:arbyint(?:f|l)?|xt(?:toward(?:f|l)?|after(?:f|l)?))|an(?:f|l)?)|c(?:s(?:in(?:h(?:f|l)?|f|l)?|qrt(?:f|l)?)|cos(?:h(?:f)?|f|l)?|imag(?:f|l)?|t(?:ime|an(?:h(?:f|l)?|f|l)?)|o(?:s(?:h(?:f|l)?|f|l)?|nj(?:f|l)?|pysign(?:f|l)?)|p(?:ow(?:f|l)?|roj(?:f|l)?)|e(?:il(?:f|l)?|xp(?:f|l)?)|l(?:o(?:ck|g(?:f|l)?)|earerr)|a(?:sin(?:h(?:f|l)?|f|l)?|cos(?:h(?:f|l)?|f|l)?|tan(?:h(?:f|l)?|f|l)?|lloc|rg(?:f|l)?|bs(?:f|l)?)|real(?:f|l)?|brt(?:f|l)?)|t(?:ime|o(?:upper|lower)|an(?:h(?:f|l)?|f|l)?|runc(?:f|l)?|gamma(?:f|l)?|mp(?:nam|file))|i(?:s(?:space|n(?:ormal|an)|cntrl|inf|digit|u(?:nordered|pper)|p(?:unct|rint)|finite|w(?:space|c(?:ntrl|type)|digit|upper|p(?:unct|rint)|lower|al(?:num|pha)|graph|xdigit|blank)|l(?:ower|ess(?:equal|greater)?)|al(?:num|pha)|gr(?:eater(?:equal)?|aph)|xdigit|blank)|logb(?:f|l)?|max(?:div|abs))|di(?:v|fftime)|_Exit|unget(?:c|wc)|p(?:ow(?:f|l)?|ut(?:s|c(?:har)?|wc(?:har)?)|error|rintf)|e(?:rf(?:c(?:f|l)?|f|l)?|x(?:it|p(?:2(?:f|l)?|f|l|m1(?:f|l)?)?))|v(?:s(?:scanf|nprintf|canf|printf|w(?:scanf|printf))|printf|f(?:scanf|printf|w(?:scanf|printf))|w(?:scanf|printf)|a_(?:start|copy|end|arg))|qsort|f(?:s(?:canf|e(?:tpos|ek))|close|tell|open|dim(?:f|l)?|p(?:classify|ut(?:s|c|w(?:s|c))|rintf)|e(?:holdexcept|set(?:e(?:nv|xceptflag)|round)|clearexcept|testexcept|of|updateenv|r(?:aiseexcept|ror)|get(?:e(?:nv|xceptflag)|round))|flush|w(?:scanf|ide|printf|rite)|loor(?:f|l)?|abs(?:f|l)?|get(?:s|c|pos|w(?:s|c))|re(?:open|e|ad|xp(?:f|l)?)|m(?:in(?:f|l)?|od(?:f|l)?|a(?:f|l|x(?:f|l)?)?))|l(?:d(?:iv|exp(?:f|l)?)|o(?:ngjmp|cal(?:time|econv)|g(?:1(?:p(?:f|l)?|0(?:f|l)?)|2(?:f|l)?|f|l|b(?:f|l)?)?)|abs|l(?:div|abs|r(?:int(?:f|l)?|ound(?:f|l)?))|r(?:int(?:f|l)?|ound(?:f|l)?)|gamma(?:f|l)?)|w(?:scanf|c(?:s(?:s(?:tr|pn)|nc(?:py|at|mp)|c(?:spn|hr|oll|py|at|mp)|to(?:imax|d|u(?:l(?:l)?|max)|k|f|l(?:d|l)?|mbs)|pbrk|ftime|len|r(?:chr|tombs)|xfrm)|to(?:b|mb)|rtomb)|printf|mem(?:set|c(?:hr|py|mp)|move))|a(?:s(?:sert|ctime|in(?:h(?:f|l)?|f|l)?)|cos(?:h(?:f|l)?|f|l)?|t(?:o(?:i|f|l(?:l)?)|exit|an(?:h(?:f|l)?|2(?:f|l)?|f|l)?)|b(?:s|ort))|g(?:et(?:s|c(?:har)?|env|wc(?:har)?)|mtime)|r(?:int(?:f|l)?|ound(?:f|l)?|e(?:name|alloc|wind|m(?:ove|quo(?:f|l)?|ainder(?:f|l)?))|a(?:nd|ise))|b(?:search|towc)|m(?:odf(?:f|l)?|em(?:set|c(?:hr|py|mp)|move)|ktime|alloc|b(?:s(?:init|towcs|rtowcs)|towc|len|r(?:towc|len))))\\b',s=function(){var e='break|case|continue|default|do|else|for|goto|if|_Pragma|return|switch|while|catch|operator|try|throw|using',t='asm|__asm__|auto|bool|_Bool|char|_Complex|double|enum|float|_Imaginary|int|long|short|signed|struct|typedef|union|unsigned|void|class|wchar_t|template|char16_t|char32_t',n='const|extern|register|restrict|static|volatile|inline|private|protected|public|friend|explicit|virtual|export|mutable|typename|constexpr|new|delete|alignas|alignof|decltype|noexcept|thread_local',r='and|and_eq|bitand|bitor|compl|not|not_eq|or|or_eq|typeid|xor|xor_eq|const_cast|dynamic_cast|reinterpret_cast|static_cast|sizeof|namespace',i='NULL|true|false|TRUE|FALSE|nullptr',s=this.$keywords=this.createKeywordMapper({'keyword.control':e,'storage.type':t,'storage.modifier':n,'keyword.operator':r,'variable.language':'this','constant.language':i},'identifier'),a=/\\(?:['"?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}U[a-fA-F\d]{8}|.)/.source,c='%'+/(\d+\$)?/.source+/[#0\- +']*/.source+/[,;:_]?/.source+/((-?\d+)|\*(-?\d+\$)?)?/.source+/(\.((-?\d+)|\*(-?\d+\$)?)?)?/.source+/(hh|h|ll|l|j|t|z|q|L|vh|vl|v|hv|hl)?/.source+/(\[[^"\]]+\]|[diouxXDOUeEfFgGaACcSspn%])/.source;this.$rules={start:[{token:'comment',regex:'//$',next:'start'},{token:'comment',regex:'//',next:'singleLineComment'},o.getStartRule('doc-start'),{token:'comment',regex:'\\/\\*',next:'comment'},{token:'string',regex:'\'(?:'+a+'|.)?\''},{token:'string.start',regex:'"',stateName:'qqstring',next:[{token:'string',regex:/\\\s*$/,next:'qqstring'},{token:'constant.language.escape',regex:a},{token:'constant.language.escape',regex:c},{token:'string.end',regex:'"|$',next:'start'},{defaultToken:'string'}]},{token:'string.start',regex:'R"\\(',stateName:'rawString',next:[{token:'string.end',regex:'\\)"',next:'start'},{defaultToken:'string'}]},{token:'constant.numeric',regex:'0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b'},{token:'constant.numeric',regex:'[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b'},{token:'keyword',regex:'#\\s*(?:include|import|pragma|line|define|undef)\\b',next:'directive'},{token:'keyword',regex:'#\\s*(?:endif|if|ifdef|else|elif|ifndef)\\b'},{token:'support.function.C99.c',regex:l},{token:s,regex:'[a-zA-Z_$][a-zA-Z0-9_$]*'},{token:'keyword.operator',regex:/--|\+\+|<<=|>>=|>>>=|<>|&&|\|\||\?:|[*%\/+\-&\^|~!<>=]=?/},{token:'punctuation.operator',regex:'\\?|\\:|\\,|\\;|\\.'},{token:'paren.lparen',regex:'[[({]'},{token:'paren.rparen',regex:'[\\])}]'},{token:'text',regex:'\\s+'}],comment:[{token:'comment',regex:'\\*\\/',next:'start'},{defaultToken:'comment'}],singleLineComment:[{token:'comment',regex:/\\$/,next:'singleLineComment'},{token:'comment',regex:/$/,next:'start'},{defaultToken:'comment'}],directive:[{token:'constant.other.multiline',regex:/\\/},{token:'constant.other.multiline',regex:/.*\\/},{token:'constant.other',regex:'\\s*<.+?>',next:'start'},{token:'constant.other',regex:'\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',next:'start'},{token:'constant.other',regex:'\\s*[\'](?:(?:\\\\.)|(?:[^\'\\\\]))*?[\']',next:'start'},{token:'constant.other',regex:/[^\\\/]+/,next:'start'}]},this.embedRules(o,'doc-',[o.getEndRule('start')]),this.normalizeRules()};r.inherits(s,i),t.c_cppHighlightRules=s})),ace.define('ace/mode/matching_brace_outdent',['require','exports','module','ace/range'],(function(e,t,n){'use strict';var r=e('../range').Range,o=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t),o=n.match(/^(\s*\})/);if(!o)return 0;var i=o[1].length,l=e.findMatchingBracket({row:t,column:i});if(!l||l.row==t)return 0;var s=this.$getIndent(e.getLine(l.row));e.replace(new r(t,0,t,i-1),s)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(o.prototype),t.MatchingBraceOutdent=o})),ace.define('ace/mode/folding/cstyle',['require','exports','module','ace/lib/oop','ace/range','ace/mode/folding/fold_mode'],(function(e,t,n){'use strict';var r=e('../../lib/oop'),o=e('../../range').Range,i=e('./fold_mode').FoldMode,l=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,'|'+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,'|'+e.end)))};r.inherits(l,i),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var r=e.getLine(n);if(this.singleLineBlockCommentRe.test(r)&&!this.startRegionRe.test(r)&&!this.tripleStarBlockCommentRe.test(r))return'';var o=this._getFoldWidgetBase(e,t,n);return!o&&this.startRegionRe.test(r)?'start':o},this.getFoldWidgetRange=function(e,t,n,r){var o=e.getLine(n);if(this.startRegionRe.test(o))return this.getCommentRegionBlock(e,o,n);var i=o.match(this.foldingStartMarker);if(i){var l=i.index;if(i[1])return this.openingBracketBlock(e,i[1],n,l);var s=e.getCommentFoldRange(n,l+i[0].length,1);return s&&!s.isMultiLine()&&(r?s=this.getSectionRange(e,n):'all'!=t&&(s=null)),s}if('markbegin'!==t){i=o.match(this.foldingStopMarker);if(i){l=i.index+i[0].length;return i[1]?this.closingBracketBlock(e,i[1],n,l):e.getCommentFoldRange(n,l,-1)}}},this.getSectionRange=function(e,t){var n=e.getLine(t),r=n.search(/\S/),i=t,l=n.length;t+=1;var s=t,a=e.getLength();while(++t<a){n=e.getLine(t);var c=n.search(/\S/);if(-1!==c){if(r>c)break;var g=this.getFoldWidgetRange(e,'all',t);if(g){if(g.start.row<=i)break;if(g.isMultiLine())t=g.end.row;else if(r==c)break}s=t}}return new o(i,l,s,e.getLine(s).length)},this.getCommentRegionBlock=function(e,t,n){var r=t.search(/\s*$/),i=e.getLength(),l=n,s=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,a=1;while(++n<i){t=e.getLine(n);var c=s.exec(t);if(c&&(c[1]?a--:a++,!a))break}var g=n;if(g>l)return new o(l,r,g,t.length)}}.call(l.prototype)})),ace.define('ace/mode/c_cpp',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/c_cpp_highlight_rules','ace/mode/matching_brace_outdent','ace/range','ace/mode/behaviour/cstyle','ace/mode/folding/cstyle'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./text').Mode,i=e('./c_cpp_highlight_rules').c_cppHighlightRules,l=e('./matching_brace_outdent').MatchingBraceOutdent,s=(e('../range').Range,e('./behaviour/cstyle').CstyleBehaviour),a=e('./folding/cstyle').FoldMode,c=function(){this.HighlightRules=i,this.$outdent=new l,this.$behaviour=new s,this.foldingRules=new a};r.inherits(c,o),function(){this.lineCommentStart='//',this.blockComment={start:'/*',end:'*/'},this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),o=this.getTokenizer().getLineTokens(t,e),i=o.tokens,l=o.state;if(i.length&&'comment'==i[i.length-1].type)return r;if('start'==e){var s=t.match(/^.*[\{\(\[]\s*$/);s&&(r+=n)}else if('doc-start'==e){if('start'==l)return'';s=t.match(/^\s*(\/?)\*/);s&&(s[1]&&(r+=' '),r+='* ')}return r},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id='ace/mode/c_cpp',this.snippetFileId='ace/snippets/c_cpp'}.call(c.prototype),t.Mode=c})),ace.define('ace/mode/protobuf_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./text_highlight_rules').TextHighlightRules,i=function(){var e='double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes',t='message|required|optional|repeated|package|import|option|enum',n=this.createKeywordMapper({'keyword.declaration.protobuf':t,'support.type':e},'identifier');this.$rules={start:[{token:'comment',regex:/\/\/.*$/},{token:'comment',regex:/\/\*/,next:'comment'},{token:'constant',regex:'<[^>]+>'},{regex:'=',token:'keyword.operator.assignment.protobuf'},{token:'string',regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:'string',regex:'[\'](?:(?:\\\\.)|(?:[^\'\\\\]))*?[\']'},{token:'constant.numeric',regex:'0[xX][0-9a-fA-F]+\\b'},{token:'constant.numeric',regex:'[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b'},{token:n,regex:'[a-zA-Z_$][a-zA-Z0-9_$]*\\b'}],comment:[{token:'comment',regex:'\\*\\/',next:'start'},{defaultToken:'comment'}]},this.normalizeRules()};r.inherits(i,o),t.ProtobufHighlightRules=i})),ace.define('ace/mode/protobuf',['require','exports','module','ace/lib/oop','ace/mode/c_cpp','ace/mode/protobuf_highlight_rules','ace/mode/folding/cstyle'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./c_cpp').Mode,i=e('./protobuf_highlight_rules').ProtobufHighlightRules,l=e('./folding/cstyle').FoldMode,s=function(){o.call(this),this.foldingRules=new l,this.HighlightRules=i};r.inherits(s,o),function(){this.lineCommentStart='//',this.blockComment={start:'/*',end:'*/'},this.$id='ace/mode/protobuf'}.call(s.prototype),t.Mode=s})),function(){ace.require(['ace/mode/protobuf'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();