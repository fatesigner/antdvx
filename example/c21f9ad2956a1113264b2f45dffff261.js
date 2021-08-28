var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.function.name.js'),require('core-js/modules/web.dom-collections.for-each.js'),ace.define('ace/ext/rtl',['require','exports','module','ace/editor','ace/config'],(function(e,t,i){'use strict';var n=[{name:'leftToRight',bindKey:{win:'Ctrl-Alt-Shift-L',mac:'Command-Alt-Shift-L'},exec:function(e){e.session.$bidiHandler.setRtlDirection(e,!1)},readOnly:!0},{name:'rightToLeft',bindKey:{win:'Ctrl-Alt-Shift-R',mac:'Command-Alt-Shift-R'},exec:function(e){e.session.$bidiHandler.setRtlDirection(e,!0)},readOnly:!0}],o=e('../editor').Editor;function r(e,t){var i=t.getSelection().lead;t.session.$bidiHandler.isRtlLine(i.row)&&0===i.column&&(t.session.$bidiHandler.isMoveLeftOperation&&i.row>0?t.getSelection().moveCursorTo(i.row-1,t.session.getLine(i.row-1).length):t.getSelection().isEmpty()?i.column+=1:i.setPosition(i.row,i.column+1))}function s(e){e.editor.session.$bidiHandler.isMoveLeftOperation=/gotoleft|selectleft|backspace|removewordleft/.test(e.command.name)}function d(e,t){var i=t.session;if(i.$bidiHandler.currentRow=null,i.$bidiHandler.isRtlLine(e.start.row)&&'insert'===e.action&&e.lines.length>1)for(var n=e.start.row;n<e.end.row;n++)i.getLine(n+1).charAt(0)!==i.$bidiHandler.RLE&&(i.doc.$lines[n+1]=i.$bidiHandler.RLE+i.getLine(n+1))}function l(e,t){var i=t.session,n=i.$bidiHandler,o=t.$textLayer.$lines.cells,r=t.layerConfig.width-t.layerConfig.padding+'px';o.forEach((function(e){var t=e.element.style;n&&n.isRtlLine(e.row)?(t.direction='rtl',t.textAlign='right',t.width=r):(t.direction='',t.textAlign='',t.width='')}))}function a(e){var t=e.$textLayer.$lines;function i(e){var t=e.element.style;t.direction=t.textAlign=t.width=''}t.cells.forEach(i),t.cellCache.forEach(i)}e('../config').defineOptions(o.prototype,'editor',{rtlText:{set:function(e){e?(this.on('change',d),this.on('changeSelection',r),this.renderer.on('afterRender',l),this.commands.on('exec',s),this.commands.addCommands(n)):(this.off('change',d),this.off('changeSelection',r),this.renderer.off('afterRender',l),this.commands.off('exec',s),this.commands.removeCommands(n),a(this.renderer)),this.renderer.updateFull()}},rtl:{set:function(e){this.session.$bidiHandler.$isRtl=e,e?(this.setOption('rtlText',!1),this.renderer.on('afterRender',l),this.session.$bidiHandler.seenBidi=!0):(this.renderer.off('afterRender',l),a(this.renderer)),this.renderer.updateFull()}}})})),function(){ace.require(['ace/ext/rtl'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();