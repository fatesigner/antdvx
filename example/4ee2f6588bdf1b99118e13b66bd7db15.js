var _typeof=require('@babel/runtime/helpers/typeof');ace.define('ace/mode/plain_text',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/text_highlight_rules','ace/mode/behaviour'],(function(e,t,i){'use strict';var o=e('../lib/oop'),n=e('./text').Mode,u=e('./text_highlight_rules').TextHighlightRules,r=e('./behaviour').Behaviour,d=function(){this.HighlightRules=u,this.$behaviour=new r};o.inherits(d,n),function(){this.type='text',this.getNextLineIndent=function(e,t,i){return''},this.$id='ace/mode/plain_text'}.call(d.prototype),t.Mode=d})),function(){ace.require(['ace/mode/plain_text'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();