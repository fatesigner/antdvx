'use strict';(self['webpackChunk']=self['webpackChunk']||[]).push([[2921],{32921:function(e,n,t){t.d(n,{D0:function(){return S},hv:function(){return Z},ts:function(){return R}});t(3214),t(72410),t(15610),t(25901),t(92189),t(91047);var r=t(39486),i=t(46858),a=t(81581),o=t(98329),u=t(39066),c=t(65237),f=t(79036),s=(t(12099),t(83352),t(25613),t(61013),t(5769),t(63238),t(61418),t(17460),t(14078),t(9572)),l=t(77713),p=t(6511),m=t(79323),h=t(24123),v=t(48848);function y(e,n){var t='undefined'!==typeof Symbol&&e[Symbol.iterator]||e['@@iterator'];if(!t){if(Array.isArray(e)||(t=b(e))||n&&e&&'number'===typeof e.length){t&&(e=t);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')}var a,o=!0,u=!1;return{s:function(){t=t.call(e)},n:function(){var e=t.next();return o=e.done,e},e:function(e){u=!0,a=e},f:function(){try{o||null==t.return||t.return()}finally{if(u)throw a}}}}function b(e,n){if(e){if('string'===typeof e)return d(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return'Object'===t&&e.constructor&&(t=e.constructor.name),'Map'===t||'Set'===t?Array.from(e):'Arguments'===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?d(e,n):void 0}}function d(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function w(e){var n=x();return function(){var t,r=(0,c.Z)(e);if(n){var i=(0,c.Z)(this).constructor;t=Reflect.construct(r,arguments,i)}else t=r.apply(this,arguments);return(0,u.Z)(this,t)}}function x(){if('undefined'===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if('function'===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}var g={accept:'',multiple:!1,fileTypeLimits:[],compress:{quality:.8},clickable:!0},k=function(e){(0,o.Z)(t,e);var n=w(t);function t(e,r){var i;return(0,a.Z)(this,t),i=n.call(this,r),i.name=e,i}return t}((0,f.Z)(Error));function S(e,n){var t;n.multiple&&n.maxCount&&e.length>n.maxCount&&(t=new k('InvalidCount','最多仅支持选择'.concat(n.maxCount,'个文件！')));for(var r=0,i=e.length;r<i;r++){var a=e[r];n.fileTypeLimits.length&&!(0,h.nX)(a,n.fileTypeLimits.map((function(e){return'.'.concat(e)})).join(','))&&(t=new k('InvalidType','仅支持'.concat(n.fileTypeLimits.join(','),'的文件格式！')));var o=(0,h.qm)(a);if(n.minSize&&o<1024*n.minSize&&(t=new k('InvalidSize','最小支持'.concat((0,p.O7)(1024*n.minSize),'的文件'))),n.maxSize&&o>1024*n.maxSize&&(t=new k('InvalidSize','最大支持'.concat((0,p.O7)(1024*n.maxSize),'的文件'))),t)break}return t}function Z(e,n){return C.apply(this,arguments)}function C(){return C=(0,i.Z)(regeneratorRuntime.mark((function e(n,t){var i,a,o,u,c,f,l,p,h,b,d;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:i=[],a=y(n),e.prev=2,a.s();case 4:if((o=a.n()).done){e.next=23;break}if(u=o.value,c=u.name,!(0,v.Or)(u)){e.next=20;break}return e.next=10,(0,s.Z)((0,m._)(u,t.compress));case 10:if(f=e.sent,l=(0,r.Z)(f,2),p=l[0],h=l[1],!p){e.next=18;break}throw new k('Compress',p.message);case 18:c=h.origin.name,u=h.file;case 20:if(u)try{b=new File([u],c),i.push(b)}catch(e){d=new Blob([u]),d.name=c,d.lastModifiedDate=new Date,i.push(d)}case 21:e.next=4;break;case 23:e.next=28;break;case 25:e.prev=25,e.t0=e['catch'](2),a.e(e.t0);case 28:return e.prev=28,a.f(),e.finish(28);case 31:return e.abrupt('return',i);case 32:case'end':return e.stop()}}),e,null,[[2,25,28,31]])}))),C.apply(this,arguments)}function R(e,n,t,r){return z.apply(this,arguments)}function z(){return z=(0,i.Z)(regeneratorRuntime.mark((function e(n,r,i,a){var o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.e(7068).then(t.bind(t,97068));case 2:return o=e.sent,e.abrupt('return',o.createFileChooser(n,(0,l.Z)({},g,r),i,a));case 4:case'end':return e.stop()}}),e)}))),z.apply(this,arguments)}}}]);