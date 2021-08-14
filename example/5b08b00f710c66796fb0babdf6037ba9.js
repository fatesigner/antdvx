var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.array.slice.js'),require('core-js/modules/es.regexp.constructor.js'),require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.regexp.to-string.js'),require('core-js/modules/es.string.replace.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.string.search.js'),ace.define('ace/mode/doc_comment_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('./text_highlight_rules').TextHighlightRules,i=function e(){this.$rules={start:[{token:'comment.doc.tag',regex:'@[\\w\\d_]+'},e.getTagRule(),{defaultToken:'comment.doc',caseInsensitive:!0}]}};r.inherits(i,o),i.getTagRule=function(e){return{token:'comment.doc.tag.storage.type',regex:'\\b(?:TODO|FIXME|XXX|HACK)\\b'}},i.getStartRule=function(e){return{token:'comment.doc',regex:'\\/\\*(?=\\*)',next:e}},i.getEndRule=function(e){return{token:'comment.doc',regex:'\\*\\/',next:e}},t.DocCommentHighlightRules=i})),ace.define('ace/mode/apex_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules','ace/mode/doc_comment_highlight_rules'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('../mode/text_highlight_rules').TextHighlightRules,i=e('../mode/doc_comment_highlight_rules').DocCommentHighlightRules,a=function(){var e=this.createKeywordMapper({'variable.language':'activate|any|autonomous|begin|bigdecimal|byte|cast|char|collect|const|end|exit|export|float|goto|group|having|hint|import|inner|into|join|loop|number|object|of|outer|parallel|pragma|retrieve|returning|search|short|stat|synchronized|then|this_month|transaction|type|when',keyword:'private|protected|public|native|synchronized|abstract|threadsafe|transient|static|final|and|array|as|asc|break|bulk|by|catch|class|commit|continue|convertcurrency|delete|desc|do|else|enum|extends|false|final|finally|for|from|future|global|if|implements|in|insert|instanceof|interface|last_90_days|last_month|last_n_days|last_week|like|limit|list|map|merge|new|next_90_days|next_month|next_n_days|next_week|not|null|nulls|on|or|override|package|return|rollback|savepoint|select|set|sort|super|testmethod|this|this_week|throw|today|tolabel|tomorrow|trigger|true|try|undelete|update|upsert|using|virtual|webservice|where|while|yesterday|switch|case|default','storage.type':'def|boolean|byte|char|short|int|float|pblob|date|datetime|decimal|double|id|integer|long|string|time|void|blob|Object','constant.language':'true|false|null|after|before|count|excludes|first|includes|last|order|sharing|with','support.function':'system|apex|label|apexpages|userinfo|schema'},'identifier',!0);function t(t){return'__c'==t.slice(-3)?'support.function':e(t)}function n(e,t){return{regex:e+(t.multiline?'':'(?=.)'),token:'string.start',next:[{regex:t.escape,token:'character.escape'},{regex:t.error,token:'error.invalid'},{regex:e+(t.multiline?'':'|$'),token:'string.end',next:t.next||'start'},{defaultToken:'string'}]}}function r(){return[{token:'comment',regex:'\\/\\/(?=.)',next:[i.getTagRule(),{token:'comment',regex:'$|^',next:'start'},{defaultToken:'comment',caseInsensitive:!0}]},i.getStartRule('doc-start'),{token:'comment',regex:/\/\*/,next:[i.getTagRule(),{token:'comment',regex:'\\*\\/',next:'start'},{defaultToken:'comment',caseInsensitive:!0}]}]}this.$rules={start:[n('\'',{escape:/\\[nb'"\\]/,error:/\\./,multiline:!1}),r('c'),{type:'decoration',token:['meta.package.apex','keyword.other.package.apex','meta.package.apex','storage.modifier.package.apex','meta.package.apex','punctuation.terminator.apex'],regex:/^(\s*)(package)\b(?:(\s*)([^ ;$]+)(\s*)((?:;)?))?/},{regex:/@[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,token:'constant.language'},{regex:/[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,token:t},{regex:'`#%',token:'error.invalid'},{token:'constant.numeric',regex:/[+-]?\d+(?:(?:\.\d*)?(?:[LlDdEe][+-]?\d+)?)\b|\.\d+[LlDdEe]/},{token:'keyword.operator',regex:/--|\+\+|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|[!$%&*+\-~\/^]=?/,next:'start'},{token:'punctuation.operator',regex:/[?:,;.]/,next:'start'},{token:'paren.lparen',regex:/[\[]/,next:'maybe_soql',merge:!1},{token:'paren.lparen',regex:/[\[({]/,next:'start',merge:!1},{token:'paren.rparen',regex:/[\])}]/,merge:!1}],maybe_soql:[{regex:/\s+/,token:'text'},{regex:/(SELECT|FIND)\b/,token:'keyword',caseInsensitive:!0,next:'soql'},{regex:'',token:'none',next:'start'}],soql:[{regex:'(:?ASC|BY|CATEGORY|CUBE|DATA|DESC|END|FIND|FIRST|FOR|FROM|GROUP|HAVING|IN|LAST|LIMIT|NETWORK|NULLS|OFFSET|ORDER|REFERENCE|RETURNING|ROLLUP|SCOPE|SELECT|SNIPPET|TRACKING|TYPEOF|UPDATE|USING|VIEW|VIEWSTAT|WHERE|WITH|AND|OR)\\b',token:'keyword',caseInsensitive:!0},{regex:'(:?target_length|toLabel|convertCurrency|count|Contact|Account|User|FIELDS)\\b',token:'support.function',caseInsensitive:!0},{token:'paren.rparen',regex:/[\]]/,next:'start',merge:!1},n('\'',{escape:/\\[nb'"\\]/,error:/\\./,multiline:!1,next:'soql'}),n('"',{escape:/\\[nb'"\\]/,error:/\\./,multiline:!1,next:'soql'}),{regex:/\\./,token:'character.escape'},{regex:/[\?\&\|\!\{\}\[\]\(\)\^\~\*\:\"\'\+\-\,\.=\\\/]/,token:'keyword.operator'}],'log-start':[{token:'timestamp.invisible',regex:/^[\d:.() ]+\|/,next:'log-header'},{token:'timestamp.invisible',regex:/^  (Number of|Maximum)[^:]*:/,next:'log-comment'},{token:'invisible',regex:/^Execute Anonymous:/,next:'log-comment'},{defaultToken:'text'}],'log-comment':[{token:'log-comment',regex:/.*$/,next:'log-start'}],'log-header':[{token:'timestamp.invisible',regex:/((USER_DEBUG|\[\d+\]|DEBUG)\|)+/},{token:'keyword',regex:'(?:EXECUTION_FINISHED|EXECUTION_STARTED|CODE_UNIT_STARTED|CUMULATIVE_LIMIT_USAGE|LIMIT_USAGE_FOR_NS|CUMULATIVE_LIMIT_USAGE_END|CODE_UNIT_FINISHED)'},{regex:'',next:'log-start'}]},this.embedRules(i,'doc-',[i.getEndRule('start')]),this.normalizeRules()};r.inherits(a,o),t.ApexHighlightRules=a})),ace.define('ace/mode/folding/cstyle',['require','exports','module','ace/lib/oop','ace/range','ace/mode/folding/fold_mode'],(function(e,t,n){'use strict';var r=e('../../lib/oop'),o=e('../../range').Range,i=e('./fold_mode').FoldMode,a=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,'|'+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,'|'+e.end)))};r.inherits(a,i),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var r=e.getLine(n);if(this.singleLineBlockCommentRe.test(r)&&!this.startRegionRe.test(r)&&!this.tripleStarBlockCommentRe.test(r))return'';var o=this._getFoldWidgetBase(e,t,n);return!o&&this.startRegionRe.test(r)?'start':o},this.getFoldWidgetRange=function(e,t,n,r){var o=e.getLine(n);if(this.startRegionRe.test(o))return this.getCommentRegionBlock(e,o,n);var i=o.match(this.foldingStartMarker);if(i){var a=i.index;if(i[1])return this.openingBracketBlock(e,i[1],n,a);var s=e.getCommentFoldRange(n,a+i[0].length,1);return s&&!s.isMultiLine()&&(r?s=this.getSectionRange(e,n):'all'!=t&&(s=null)),s}if('markbegin'!==t){i=o.match(this.foldingStopMarker);if(i){a=i.index+i[0].length;return i[1]?this.closingBracketBlock(e,i[1],n,a):e.getCommentFoldRange(n,a,-1)}}},this.getSectionRange=function(e,t){var n=e.getLine(t),r=n.search(/\S/),i=t,a=n.length;t+=1;var s=t,l=e.getLength();while(++t<l){n=e.getLine(t);var g=n.search(/\S/);if(-1!==g){if(r>g)break;var c=this.getFoldWidgetRange(e,'all',t);if(c){if(c.start.row<=i)break;if(c.isMultiLine())t=c.end.row;else if(r==g)break}s=t}}return new o(i,a,s,e.getLine(s).length)},this.getCommentRegionBlock=function(e,t,n){var r=t.search(/\s*$/),i=e.getLength(),a=n,s=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,l=1;while(++n<i){t=e.getLine(n);var g=s.exec(t);if(g&&(g[1]?l--:l++,!l))break}var c=n;if(c>a)return new o(a,r,c,t.length)}}.call(a.prototype)})),ace.define('ace/mode/apex',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/apex_highlight_rules','ace/mode/folding/cstyle','ace/mode/behaviour/cstyle'],(function(e,t,n){'use strict';var r=e('../lib/oop'),o=e('../mode/text').Mode,i=e('./apex_highlight_rules').ApexHighlightRules,a=e('../mode/folding/cstyle').FoldMode,s=e('../mode/behaviour/cstyle').CstyleBehaviour;function l(){o.call(this),this.HighlightRules=i,this.foldingRules=new a,this.$behaviour=new s}r.inherits(l,o),l.prototype.lineCommentStart='//',l.prototype.blockComment={start:'/*',end:'*/'},t.Mode=l})),function(){ace.require(['ace/mode/apex'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();