var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.array.filter.js'),require('core-js/modules/es.regexp.constructor.js'),require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.regexp.to-string.js'),require('core-js/modules/es.string.replace.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.string.search.js'),ace.define('ace/mode/doc_comment_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var i=e('../lib/oop'),r=e('./text_highlight_rules').TextHighlightRules,o=function e(){this.$rules={start:[{token:'comment.doc.tag',regex:'@[\\w\\d_]+'},e.getTagRule(),{defaultToken:'comment.doc',caseInsensitive:!0}]}};i.inherits(o,r),o.getTagRule=function(e){return{token:'comment.doc.tag.storage.type',regex:'\\b(?:TODO|FIXME|XXX|HACK)\\b'}},o.getStartRule=function(e){return{token:'comment.doc',regex:'\\/\\*(?=\\*)',next:e}},o.getEndRule=function(e){return{token:'comment.doc',regex:'\\*\\/',next:e}},t.DocCommentHighlightRules=o})),ace.define('ace/mode/swift_highlight_rules',['require','exports','module','ace/lib/oop','ace/lib/lang','ace/mode/doc_comment_highlight_rules','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var i=e('../lib/oop'),r=e('../lib/lang'),o=e('./doc_comment_highlight_rules').DocCommentHighlightRules,s=e('./text_highlight_rules').TextHighlightRules,a=function(){var e=this.createKeywordMapper({'variable.language':'',keyword:'__COLUMN__|__FILE__|__FUNCTION__|__LINE__|as|associativity|break|case|class|continue|default|deinit|didSet|do|dynamicType|else|enum|extension|fallthrough|for|func|get|if|import|in|infix|init|inout|is|left|let|let|mutating|new|none|nonmutating|operator|override|postfix|precedence|prefix|protocol|return|right|safe|Self|self|set|struct|subscript|switch|Type|typealias|unowned|unsafe|var|weak|where|while|willSet|convenience|dynamic|final|infix|lazy|mutating|nonmutating|optional|override|postfix|prefix|required|static|guard|defer','storage.type':'bool|double|Double|extension|float|Float|int|Int|open|internal|fileprivate|private|public|string|String','constant.language':'false|Infinity|NaN|nil|no|null|null|off|on|super|this|true|undefined|yes','support.function':''},'identifier');function t(e,t){var n=t.nestable||t.interpolation,i=t.interpolation&&t.interpolation.nextState||'start',o={regex:e+(t.multiline?'':'(?=.)'),token:'string.start'},s=[t.escape&&{regex:t.escape,token:'character.escape'},t.interpolation&&{token:'paren.quasi.start',regex:r.escapeRegExp(t.interpolation.lead+t.interpolation.open),push:i},t.error&&{regex:t.error,token:'error.invalid'},{regex:e+(t.multiline?'':'|$'),token:'string.end',next:n?'pop':'start'},{defaultToken:'string'}].filter(Boolean);if(n?o.push=s:o.next=s,!t.interpolation)return o;var a=t.interpolation.open,l=t.interpolation.close,g={regex:'['+r.escapeRegExp(a+l)+']',onMatch:function(e,t,n){return this.next=e==a?this.nextState:'',e==a&&n.length?(n.unshift('start',t),'paren'):e==l&&n.length&&(n.shift(),this.next=n.shift(),-1!=this.next.indexOf('string'))?'paren.quasi.end':e==a?'paren.lparen':'paren.rparen'},nextState:i};return[g,o]}function n(){return[{token:'comment',regex:'\\/\\/(?=.)',next:[o.getTagRule(),{token:'comment',regex:'$|^',next:'start'},{defaultToken:'comment',caseInsensitive:!0}]},o.getStartRule('doc-start'),{token:'comment.start',regex:/\/\*/,stateName:'nested_comment',push:[o.getTagRule(),{token:'comment.start',regex:/\/\*/,push:'nested_comment'},{token:'comment.end',regex:'\\*\\/',next:'pop'},{defaultToken:'comment',caseInsensitive:!0}]}]}this.$rules={start:[t('"""',{escape:/\\(?:[0\\tnr"']|u{[a-fA-F1-9]{0,8}})/,interpolation:{lead:'\\',open:'(',close:')'},error:/\\./,multiline:!0}),t('"',{escape:/\\(?:[0\\tnr"']|u{[a-fA-F1-9]{0,8}})/,interpolation:{lead:'\\',open:'(',close:')'},error:/\\./,multiline:!1}),n(),{regex:/@[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,token:'variable.parameter'},{regex:/[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,token:e},{token:'constant.numeric',regex:/[+-]?(?:0(?:b[01]+|o[0-7]+|x[\da-fA-F])|\d+(?:(?:\.\d*)?(?:[PpEe][+-]?\d+)?)\b)/},{token:'keyword.operator',regex:/--|\+\+|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,next:'start'},{token:'punctuation.operator',regex:/[?:,;.]/,next:'start'},{token:'paren.lparen',regex:/[\[({]/,next:'start'},{token:'paren.rparen',regex:/[\])}]/}]},this.embedRules(o,'doc-',[o.getEndRule('start')]),this.normalizeRules()};i.inherits(a,s),t.HighlightRules=a})),ace.define('ace/mode/folding/cstyle',['require','exports','module','ace/lib/oop','ace/range','ace/mode/folding/fold_mode'],(function(e,t,n){'use strict';var i=e('../../lib/oop'),r=e('../../range').Range,o=e('./fold_mode').FoldMode,s=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,'|'+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,'|'+e.end)))};i.inherits(s,o),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var i=e.getLine(n);if(this.singleLineBlockCommentRe.test(i)&&!this.startRegionRe.test(i)&&!this.tripleStarBlockCommentRe.test(i))return'';var r=this._getFoldWidgetBase(e,t,n);return!r&&this.startRegionRe.test(i)?'start':r},this.getFoldWidgetRange=function(e,t,n,i){var r=e.getLine(n);if(this.startRegionRe.test(r))return this.getCommentRegionBlock(e,r,n);var o=r.match(this.foldingStartMarker);if(o){var s=o.index;if(o[1])return this.openingBracketBlock(e,o[1],n,s);var a=e.getCommentFoldRange(n,s+o[0].length,1);return a&&!a.isMultiLine()&&(i?a=this.getSectionRange(e,n):'all'!=t&&(a=null)),a}if('markbegin'!==t){o=r.match(this.foldingStopMarker);if(o){s=o.index+o[0].length;return o[1]?this.closingBracketBlock(e,o[1],n,s):e.getCommentFoldRange(n,s,-1)}}},this.getSectionRange=function(e,t){var n=e.getLine(t),i=n.search(/\S/),o=t,s=n.length;t+=1;var a=t,l=e.getLength();while(++t<l){n=e.getLine(t);var g=n.search(/\S/);if(-1!==g){if(i>g)break;var u=this.getFoldWidgetRange(e,'all',t);if(u){if(u.start.row<=o)break;if(u.isMultiLine())t=u.end.row;else if(i==g)break}a=t}}return new r(o,s,a,e.getLine(a).length)},this.getCommentRegionBlock=function(e,t,n){var i=t.search(/\s*$/),o=e.getLength(),s=n,a=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,l=1;while(++n<o){t=e.getLine(n);var g=a.exec(t);if(g&&(g[1]?l--:l++,!l))break}var u=n;if(u>s)return new r(s,i,u,t.length)}}.call(s.prototype)})),ace.define('ace/mode/swift',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/swift_highlight_rules','ace/mode/behaviour/cstyle','ace/mode/folding/cstyle'],(function(e,t,n){'use strict';var i=e('../lib/oop'),r=e('./text').Mode,o=e('./swift_highlight_rules').HighlightRules,s=e('./behaviour/cstyle').CstyleBehaviour,a=e('./folding/cstyle').FoldMode,l=function(){this.HighlightRules=o,this.foldingRules=new a,this.$behaviour=new s,this.$behaviour=this.$defaultBehaviour};i.inherits(l,r),function(){this.lineCommentStart='//',this.blockComment={start:'/*',end:'*/',nestable:!0},this.$id='ace/mode/swift'}.call(l.prototype),t.Mode=l})),function(){ace.require(['ace/mode/swift'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();