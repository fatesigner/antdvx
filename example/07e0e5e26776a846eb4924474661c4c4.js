var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.array.join.js'),ace.define('ace/ext/statusbar',['require','exports','module','ace/lib/dom','ace/lib/lang'],(function(e,t,n){'use strict';var o=e('../lib/dom'),i=e('../lib/lang'),a=function(e,t){this.element=o.createElement('div'),this.element.className='ace_status-indicator',this.element.style.cssText='display: inline-block;',t.appendChild(this.element);var n=i.delayedCall(function(){this.updateStatus(e)}.bind(this)).schedule.bind(null,100);e.on('changeStatus',n),e.on('changeSelection',n),e.on('keyboardActivity',n)};(function(){this.updateStatus=function(e){var t=[];function n(e,n){e&&t.push(e,n||'|')}n(e.keyBinding.getStatusText(e)),e.commands.recording&&n('REC');var o=e.selection,i=o.lead;if(!o.isEmpty()){var a=e.getSelectionRange();n('('+(a.end.row-a.start.row)+':'+(a.end.column-a.start.column)+')',' ')}n(i.row+':'+i.column,' '),o.rangeCount&&n('['+o.rangeCount+']',' '),t.pop(),this.element.textContent=t.join('')}}).call(a.prototype),t.StatusBar=a})),function(){ace.require(['ace/ext/statusbar'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();