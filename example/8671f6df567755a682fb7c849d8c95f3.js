var _typeof=require('@babel/runtime/helpers/typeof');ace.define('ace/ext/linking',['require','exports','module','ace/editor','ace/config'],(function(e,o,i){var n=e('../editor').Editor;function t(e){var i=e.editor,n=e.getAccelKey();if(n){i=e.editor;var t=e.getDocumentPosition(),r=i.session,u=r.getTokenAt(t.row,t.column);o.previousLinkingHover&&o.previousLinkingHover!=u&&i._emit('linkHoverOut'),i._emit('linkHover',{position:t,token:u}),o.previousLinkingHover=u}else o.previousLinkingHover&&(i._emit('linkHoverOut'),o.previousLinkingHover=!1)}function r(e){var o=e.getAccelKey(),i=e.getButton();if(0==i&&o){var n=e.editor,t=e.getDocumentPosition(),r=n.session,u=r.getTokenAt(t.row,t.column);n._emit('linkClick',{position:t,token:u})}}e('../config').defineOptions(n.prototype,'editor',{enableLinking:{set:function(e){e?(this.on('click',r),this.on('mousemove',t)):(this.off('click',r),this.off('mousemove',t))},value:!1}}),o.previousLinkingHover=!1})),function(){ace.require(['ace/ext/linking'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();