var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.regexp.constructor.js'),require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.regexp.to-string.js'),require('core-js/modules/es.string.replace.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.string.search.js'),ace.define('ace/mode/fsharp_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./text_highlight_rules').TextHighlightRules,i=function(){var e=this.createKeywordMapper({variable:'this',keyword:'abstract|assert|base|begin|class|default|delegate|done|downcast|downto|elif|else|exception|extern|false|finally|function|global|inherit|inline|interface|internal|lazy|match|member|module|mutable|namespace|open|or|override|private|public|rec|return|return!|select|static|struct|then|to|true|try|typeof|upcast|use|use!|val|void|when|while|with|yield|yield!|__SOURCE_DIRECTORY__|as|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|include|method|mixin|object|parallel|process|protected|pure|sealed|tailcall|trait|virtual|volatile|and|do|end|for|fun|if|in|let|let!|new|not|null|of|endif',constant:'true|false'},'identifier'),t='(?:(?:(?:(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.))|(?:\\d+))(?:[eE][+-]?\\d+))|(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.)))';this.$rules={start:[{token:'variable.classes',regex:'\\[\\<[.]*\\>\\]'},{token:'comment',regex:'//.*$'},{token:'comment.start',regex:/\(\*(?!\))/,push:'blockComment'},{token:'string',regex:'\'.\''},{token:'string',regex:'"""',next:[{token:'constant.language.escape',regex:/\\./,next:'qqstring'},{token:'string',regex:'"""',next:'start'},{defaultToken:'string'}]},{token:'string',regex:'"',next:[{token:'constant.language.escape',regex:/\\./,next:'qqstring'},{token:'string',regex:'"',next:'start'},{defaultToken:'string'}]},{token:['verbatim.string','string'],regex:'(@?)(")',stateName:'qqstring',next:[{token:'constant.language.escape',regex:'""'},{token:'string',regex:'"',next:'start'},{defaultToken:'string'}]},{token:'constant.float',regex:'(?:'+t+'|\\d+)[jJ]\\b'},{token:'constant.float',regex:t},{token:'constant.integer',regex:'(?:(?:(?:[1-9]\\d*)|(?:0))|(?:0[oO]?[0-7]+)|(?:0[xX][\\dA-Fa-f]+)|(?:0[bB][01]+))\\b'},{token:['keyword.type','variable'],regex:'(type\\s)([a-zA-Z0-9_$-]*\\b)'},{token:e,regex:'[a-zA-Z_$][a-zA-Z0-9_$]*\\b'},{token:'keyword.operator',regex:'\\+\\.|\\-\\.|\\*\\.|\\/\\.|#|;;|\\+|\\-|\\*|\\*\\*\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|<-|=|\\(\\*\\)'},{token:'paren.lparen',regex:'[[({]'},{token:'paren.rparen',regex:'[\\])}]'}],blockComment:[{regex:/\(\*\)/,token:'comment'},{regex:/\(\*(?!\))/,token:'comment.start',push:'blockComment'},{regex:/\*\)/,token:'comment.end',next:'pop'},{defaultToken:'comment'}]},this.normalizeRules()};r.inherits(i,o),t.FSharpHighlightRules=i})),ace.define('ace/mode/folding/cstyle',['require','exports','module','ace/lib/oop','ace/range','ace/mode/folding/fold_mode'],(function(e,t,n){'use strict';var r=e('../../lib/oop'),o=e('../../range').Range,i=e('./fold_mode').FoldMode,s=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,'|'+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,'|'+e.end)))};r.inherits(s,i),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var r=e.getLine(n);if(this.singleLineBlockCommentRe.test(r)&&!this.startRegionRe.test(r)&&!this.tripleStarBlockCommentRe.test(r))return'';var o=this._getFoldWidgetBase(e,t,n);return!o&&this.startRegionRe.test(r)?'start':o},this.getFoldWidgetRange=function(e,t,n,r){var o=e.getLine(n);if(this.startRegionRe.test(o))return this.getCommentRegionBlock(e,o,n);var i=o.match(this.foldingStartMarker);if(i){var s=i.index;if(i[1])return this.openingBracketBlock(e,i[1],n,s);var a=e.getCommentFoldRange(n,s+i[0].length,1);return a&&!a.isMultiLine()&&(r?a=this.getSectionRange(e,n):'all'!=t&&(a=null)),a}if('markbegin'!==t){i=o.match(this.foldingStopMarker);if(i){s=i.index+i[0].length;return i[1]?this.closingBracketBlock(e,i[1],n,s):e.getCommentFoldRange(n,s,-1)}}},this.getSectionRange=function(e,t){var n=e.getLine(t),r=n.search(/\S/),i=t,s=n.length;t+=1;var a=t,l=e.getLength();while(++t<l){n=e.getLine(t);var g=n.search(/\S/);if(-1!==g){if(r>g)break;var c=this.getFoldWidgetRange(e,'all',t);if(c){if(c.start.row<=i)break;if(c.isMultiLine())t=c.end.row;else if(r==g)break}a=t}}return new o(i,s,a,e.getLine(a).length)},this.getCommentRegionBlock=function(e,t,n){var r=t.search(/\s*$/),i=e.getLength(),s=n,a=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,l=1;while(++n<i){t=e.getLine(n);var g=a.exec(t);if(g&&(g[1]?l--:l++,!l))break}var c=n;if(c>s)return new o(s,r,c,t.length)}}.call(s.prototype)})),ace.define('ace/mode/fsharp',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/fsharp_highlight_rules','ace/mode/folding/cstyle'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./text').Mode,i=e('./fsharp_highlight_rules').FSharpHighlightRules,s=e('./folding/cstyle').FoldMode,a=function(){o.call(this),this.HighlightRules=i,this.foldingRules=new s};r.inherits(a,o),function(){this.lineCommentStart='//',this.blockComment={start:'(*',end:'*)',nestable:!0},this.$id='ace/mode/fsharp'}.call(a.prototype),t.Mode=a})),function(){ace.require(['ace/mode/fsharp'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();