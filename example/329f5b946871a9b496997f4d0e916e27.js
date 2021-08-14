var _typeof=require('@babel/runtime/helpers/typeof');require('core-js/modules/es.regexp.exec.js'),require('core-js/modules/es.string.split.js'),require('core-js/modules/es.function.name.js'),require('core-js/modules/es.string.replace.js'),require('core-js/modules/es.regexp.constructor.js'),require('core-js/modules/es.regexp.to-string.js'),require('core-js/modules/es.string.match.js'),require('core-js/modules/es.array.map.js'),require('core-js/modules/web.dom-collections.for-each.js'),require('core-js/modules/es.array.sort.js'),require('core-js/modules/es.object.keys.js'),require('core-js/modules/es.array.iterator.js'),require('core-js/modules/es.object.to-string.js'),require('core-js/modules/web.dom-collections.iterator.js'),ace.define('ace/ext/menu_tools/overlay_page',['require','exports','module','ace/lib/dom'],(function(e,t,o){'use strict';var a=e('../../lib/dom'),r='#ace_settingsmenu, #kbshortcutmenu {background-color: #F7F7F7;color: black;box-shadow: -5px 4px 5px rgba(126, 126, 126, 0.55);padding: 1em 0.5em 2em 1em;overflow: auto;position: absolute;margin: 0;bottom: 0;right: 0;top: 0;z-index: 9991;cursor: default;}.ace_dark #ace_settingsmenu, .ace_dark #kbshortcutmenu {box-shadow: -20px 10px 25px rgba(126, 126, 126, 0.25);background-color: rgba(255, 255, 255, 0.6);color: black;}.ace_optionsMenuEntry:hover {background-color: rgba(100, 100, 100, 0.1);transition: all 0.3s}.ace_closeButton {background: rgba(245, 146, 146, 0.5);border: 1px solid #F48A8A;border-radius: 50%;padding: 7px;position: absolute;right: -8px;top: -8px;z-index: 100000;}.ace_closeButton{background: rgba(245, 146, 146, 0.9);}.ace_optionsMenuKey {color: darkslateblue;font-weight: bold;}.ace_optionsMenuCommand {color: darkcyan;font-weight: normal;}.ace_optionsMenuEntry input, .ace_optionsMenuEntry button {vertical-align: middle;}.ace_optionsMenuEntry button[ace_selected_button=true] {background: #e7e7e7;box-shadow: 1px 0px 2px 0px #adadad inset;border-color: #adadad;}.ace_optionsMenuEntry button {background: white;border: 1px solid lightgray;margin: 0px;}.ace_optionsMenuEntry button:hover{background: #f0f0f0;}';a.importCssString(r),o.exports.overlayPage=function(e,t,o){var a=document.createElement('div'),r=!1;function i(e){27===e.keyCode&&n()}function n(){a&&(document.removeEventListener('keydown',i),a.parentNode.removeChild(a),e&&e.focus(),a=null,o&&o())}function s(e){r=e,e&&(a.style.pointerEvents='none',t.style.pointerEvents='auto')}return a.style.cssText='margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; '+(e?'background-color: rgba(0, 0, 0, 0.3);':''),a.addEventListener('click',(function(e){r||n()})),document.addEventListener('keydown',i),t.addEventListener('click',(function(e){e.stopPropagation()})),a.appendChild(t),document.body.appendChild(a),e&&e.blur(),{close:n,setIgnoreFocusOut:s}}})),ace.define('ace/ext/modelist',['require','exports','module'],(function(e,t,o){'use strict';var a=[];function r(e){for(var t=l.text,o=e.split(/[\/\\]/).pop(),r=0;r<a.length;r++)if(a[r].supportsFile(o)){t=a[r];break}return t}var i=function(e,t,o){var a;this.name=e,this.caption=t,this.mode='ace/mode/'+e,this.extensions=o,a=/\^/.test(o)?o.replace(/\|(\^)?/g,(function(e,t){return'$|'+(t?'^':'^.*\\.')}))+'$':'^.*\\.('+o+')$',this.extRe=new RegExp(a,'gi')};i.prototype.supportsFile=function(e){return e.match(this.extRe)};var n={ABAP:['abap'],ABC:['abc'],ActionScript:['as'],ADA:['ada|adb'],Alda:['alda'],Apache_Conf:['^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd'],Apex:['apex|cls|trigger|tgr'],AQL:['aql'],AsciiDoc:['asciidoc|adoc'],ASL:['dsl|asl'],Assembly_x86:['asm|a'],AutoHotKey:['ahk'],BatchFile:['bat|cmd'],C_Cpp:['cpp|c|cc|cxx|h|hh|hpp|ino'],C9Search:['c9search_results'],Cirru:['cirru|cr'],Clojure:['clj|cljs'],Cobol:['CBL|COB'],coffee:['coffee|cf|cson|^Cakefile'],ColdFusion:['cfm'],Crystal:['cr'],CSharp:['cs'],Csound_Document:['csd'],Csound_Orchestra:['orc'],Csound_Score:['sco'],CSS:['css'],Curly:['curly'],D:['d|di'],Dart:['dart'],Diff:['diff|patch'],Dockerfile:['^Dockerfile'],Dot:['dot'],Drools:['drl'],Edifact:['edi'],Eiffel:['e|ge'],EJS:['ejs'],Elixir:['ex|exs'],Elm:['elm'],Erlang:['erl|hrl'],Forth:['frt|fs|ldr|fth|4th'],Fortran:['f|f90'],FSharp:['fsi|fs|ml|mli|fsx|fsscript'],FSL:['fsl'],FTL:['ftl'],Gcode:['gcode'],Gherkin:['feature'],Gitignore:['^.gitignore'],Glsl:['glsl|frag|vert'],Gobstones:['gbs'],golang:['go'],GraphQLSchema:['gql'],Groovy:['groovy'],HAML:['haml'],Handlebars:['hbs|handlebars|tpl|mustache'],Haskell:['hs'],Haskell_Cabal:['cabal'],haXe:['hx'],Hjson:['hjson'],HTML:['html|htm|xhtml|vue|we|wpy'],HTML_Elixir:['eex|html.eex'],HTML_Ruby:['erb|rhtml|html.erb'],INI:['ini|conf|cfg|prefs'],Io:['io'],Jack:['jack'],Jade:['jade|pug'],Java:['java'],JavaScript:['js|jsm|jsx'],JSON:['json'],JSON5:['json5'],JSONiq:['jq'],JSP:['jsp'],JSSM:['jssm|jssm_state'],JSX:['jsx'],Julia:['jl'],Kotlin:['kt|kts'],LaTeX:['tex|latex|ltx|bib'],LESS:['less'],Liquid:['liquid'],Lisp:['lisp'],LiveScript:['ls'],LogiQL:['logic|lql'],LSL:['lsl'],Lua:['lua'],LuaPage:['lp'],Lucene:['lucene'],Makefile:['^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make'],Markdown:['md|markdown'],Mask:['mask'],MATLAB:['matlab'],Maze:['mz'],MediaWiki:['wiki|mediawiki'],MEL:['mel'],MIXAL:['mixal'],MUSHCode:['mc|mush'],MySQL:['mysql'],Nginx:['nginx|conf'],Nim:['nim'],Nix:['nix'],NSIS:['nsi|nsh'],Nunjucks:['nunjucks|nunjs|nj|njk'],ObjectiveC:['m|mm'],OCaml:['ml|mli'],Pascal:['pas|p'],Perl:['pl|pm'],Perl6:['p6|pl6|pm6'],pgSQL:['pgsql'],PHP:['php|inc|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module'],PHP_Laravel_blade:['blade.php'],Pig:['pig'],Powershell:['ps1'],Praat:['praat|praatscript|psc|proc'],Prisma:['prisma'],Prolog:['plg|prolog'],Properties:['properties'],Protobuf:['proto'],Puppet:['epp|pp'],Python:['py'],QML:['qml'],R:['r'],Razor:['cshtml|asp'],RDoc:['Rd'],Red:['red|reds'],RHTML:['Rhtml'],RST:['rst'],Ruby:['rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile'],Rust:['rs'],SASS:['sass'],SCAD:['scad'],Scala:['scala|sbt'],Scheme:['scm|sm|rkt|oak|scheme'],SCSS:['scss'],SH:['sh|bash|^.bashrc'],SJS:['sjs'],Slim:['slim|skim'],Smarty:['smarty|tpl'],snippets:['snippets'],Soy_Template:['soy'],Space:['space'],SQL:['sql'],SQLServer:['sqlserver'],Stylus:['styl|stylus'],SVG:['svg'],Swift:['swift'],Tcl:['tcl'],Terraform:['tf','tfvars','terragrunt'],Tex:['tex'],Text:['txt'],Textile:['textile'],Toml:['toml'],TSX:['tsx'],Twig:['latte|twig|swig'],Typescript:['ts|typescript|str'],Vala:['vala'],VBScript:['vbs|vb'],Velocity:['vm'],Verilog:['v|vh|sv|svh'],VHDL:['vhd|vhdl'],Visualforce:['vfp|component|page'],Wollok:['wlk|wpgm|wtest'],XML:['xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml'],XQuery:['xq'],YAML:['yaml|yml'],Zeek:['zeek|bro'],Django:['html']},s={ObjectiveC:'Objective-C',CSharp:'C#',golang:'Go',C_Cpp:'C and C++',Csound_Document:'Csound Document',Csound_Orchestra:'Csound',Csound_Score:'Csound Score',coffee:'CoffeeScript',HTML_Ruby:'HTML (Ruby)',HTML_Elixir:'HTML (Elixir)',FTL:'FreeMarker',PHP_Laravel_blade:'PHP (Blade Template)',Perl6:'Perl 6',AutoHotKey:'AutoHotkey / AutoIt'},l={};for(var c in n){var u=n[c],p=(s[c]||c).replace(/_/g,' '),d=c.toLowerCase(),m=new i(d,p,u[0]);l[d]=m,a.push(m)}o.exports={getModeForPath:r,modes:a,modesByName:l}})),ace.define('ace/ext/themelist',['require','exports','module'],(function(e,t,o){'use strict';var a=[['Chrome'],['Clouds'],['Crimson Editor'],['Dawn'],['Dreamweaver'],['Eclipse'],['GitHub'],['IPlastic'],['Solarized Light'],['TextMate'],['Tomorrow'],['Xcode'],['Kuroir'],['KatzenMilch'],['SQL Server','sqlserver','light'],['Ambiance','ambiance','dark'],['Chaos','chaos','dark'],['Clouds Midnight','clouds_midnight','dark'],['Dracula','','dark'],['Cobalt','cobalt','dark'],['Gruvbox','gruvbox','dark'],['Green on Black','gob','dark'],['idle Fingers','idle_fingers','dark'],['krTheme','kr_theme','dark'],['Merbivore','merbivore','dark'],['Merbivore Soft','merbivore_soft','dark'],['Mono Industrial','mono_industrial','dark'],['Monokai','monokai','dark'],['Nord Dark','nord_dark','dark'],['Pastel on dark','pastel_on_dark','dark'],['Solarized Dark','solarized_dark','dark'],['Terminal','terminal','dark'],['Tomorrow Night','tomorrow_night','dark'],['Tomorrow Night Blue','tomorrow_night_blue','dark'],['Tomorrow Night Bright','tomorrow_night_bright','dark'],['Tomorrow Night 80s','tomorrow_night_eighties','dark'],['Twilight','twilight','dark'],['Vibrant Ink','vibrant_ink','dark']];t.themesByName={},t.themes=a.map((function(e){var o=e[1]||e[0].replace(/ /g,'_').toLowerCase(),a={caption:e[0],theme:'ace/theme/'+o,isDark:'dark'==e[2],name:o};return t.themesByName[o]=a,a}))})),ace.define('ace/ext/options',['require','exports','module','ace/ext/menu_tools/overlay_page','ace/lib/dom','ace/lib/oop','ace/config','ace/lib/event_emitter','ace/ext/modelist','ace/ext/themelist'],(function(e,t,o){'use strict';e('./menu_tools/overlay_page');var a=e('../lib/dom'),r=e('../lib/oop'),i=e('../config'),n=e('../lib/event_emitter').EventEmitter,s=a.buildDom,l=e('./modelist'),c=e('./themelist'),u={Bright:[],Dark:[]};c.themes.forEach((function(e){u[e.isDark?'Dark':'Bright'].push({caption:e.caption,value:e.theme})}));var p=l.modes.map((function(e){return{caption:e.caption,value:e.mode}})),d={Main:{Mode:{path:'mode',type:'select',items:p},Theme:{path:'theme',type:'select',items:u},Keybinding:{type:'buttonBar',path:'keyboardHandler',items:[{caption:'Ace',value:null},{caption:'Vim',value:'ace/keyboard/vim'},{caption:'Emacs',value:'ace/keyboard/emacs'},{caption:'Sublime',value:'ace/keyboard/sublime'},{caption:'VSCode',value:'ace/keyboard/vscode'}]},'Font Size':{path:'fontSize',type:'number',defaultValue:12,defaults:[{caption:'12px',value:12},{caption:'24px',value:24}]},'Soft Wrap':{type:'buttonBar',path:'wrap',items:[{caption:'Off',value:'off'},{caption:'View',value:'free'},{caption:'margin',value:'printMargin'},{caption:'40',value:'40'}]},'Cursor Style':{path:'cursorStyle',items:[{caption:'Ace',value:'ace'},{caption:'Slim',value:'slim'},{caption:'Smooth',value:'smooth'},{caption:'Smooth And Slim',value:'smooth slim'},{caption:'Wide',value:'wide'}]},Folding:{path:'foldStyle',items:[{caption:'Manual',value:'manual'},{caption:'Mark begin',value:'markbegin'},{caption:'Mark begin and end',value:'markbeginend'}]},'Soft Tabs':[{path:'useSoftTabs'},{ariaLabel:'Tab Size',path:'tabSize',type:'number',values:[2,3,4,8,16]}],Overscroll:{type:'buttonBar',path:'scrollPastEnd',items:[{caption:'None',value:0},{caption:'Half',value:.5},{caption:'Full',value:1}]}},More:{'Atomic soft tabs':{path:'navigateWithinSoftTabs'},'Enable Behaviours':{path:'behavioursEnabled'},'Wrap with quotes':{path:'wrapBehavioursEnabled'},'Enable Auto Indent':{path:'enableAutoIndent'},'Full Line Selection':{type:'checkbox',values:'text|line',path:'selectionStyle'},'Highlight Active Line':{path:'highlightActiveLine'},'Show Invisibles':{path:'showInvisibles'},'Show Indent Guides':{path:'displayIndentGuides'},'Persistent HScrollbar':{path:'hScrollBarAlwaysVisible'},'Persistent VScrollbar':{path:'vScrollBarAlwaysVisible'},'Animate scrolling':{path:'animatedScroll'},'Show Gutter':{path:'showGutter'},'Show Line Numbers':{path:'showLineNumbers'},'Relative Line Numbers':{path:'relativeLineNumbers'},'Fixed Gutter Width':{path:'fixedWidthGutter'},'Show Print Margin':[{path:'showPrintMargin'},{ariaLabel:'Print Margin',type:'number',path:'printMarginColumn'}],'Indented Soft Wrap':{path:'indentedSoftWrap'},'Highlight selected word':{path:'highlightSelectedWord'},'Fade Fold Widgets':{path:'fadeFoldWidgets'},'Use textarea for IME':{path:'useTextareaForIME'},'Merge Undo Deltas':{path:'mergeUndoDeltas',items:[{caption:'Always',value:'always'},{caption:'Never',value:'false'},{caption:'Timed',value:'true'}]},'Elastic Tabstops':{path:'useElasticTabstops'},'Incremental Search':{path:'useIncrementalSearch'},'Read-only':{path:'readOnly'},'Copy without selection':{path:'copyWithEmptySelection'},'Live Autocompletion':{path:'enableLiveAutocompletion'}}},m=function(e,t){this.editor=e,this.container=t||document.createElement('div'),this.groups=[],this.options={}};(function(){r.implement(this,n),this.add=function(e){e.Main&&r.mixin(d.Main,e.Main),e.More&&r.mixin(d.More,e.More)},this.render=function(){this.container.innerHTML='',s(['table',{role:'presentation',id:'controls'},this.renderOptionGroup(d.Main),['tr',null,['td',{colspan:2},['table',{role:'presentation',id:'more-controls'},this.renderOptionGroup(d.More)]]],['tr',null,['td',{colspan:2},'version '+i.version]]],this.container)},this.renderOptionGroup=function(e){return Object.keys(e).map((function(t,o){var a=e[t];return a.position||(a.position=o/1e4),a.label||(a.label=t),a})).sort((function(e,t){return e.position-t.position})).map((function(e){return this.renderOption(e.label,e)}),this)},this.renderOptionControl=function(e,t){var o,a=this;if(Array.isArray(t))return t.map((function(t){return a.renderOptionControl(e,t)}));var r=a.getOption(t);if(t.values&&'checkbox'!=t.type&&('string'==typeof t.values&&(t.values=t.values.split('|')),t.items=t.values.map((function(e){return{value:e,name:e}}))),'buttonBar'==t.type)o=['div',{role:'group','aria-labelledby':t.path+'-label'},t.items.map((function(e){return['button',{value:e.value,ace_selected_button:r==e.value,'aria-pressed':r==e.value,onclick:function(){a.setOption(t,e.value);for(var o=this.parentNode.querySelectorAll('[ace_selected_button]'),r=0;r<o.length;r++)o[r].removeAttribute('ace_selected_button'),o[r].setAttribute('aria-pressed',!1);this.setAttribute('ace_selected_button',!0),this.setAttribute('aria-pressed',!0)}},e.desc||e.caption||e.name]}))];else if('number'==t.type)o=['input',{type:'number',value:r||t.defaultValue,style:'width:3em',oninput:function(){a.setOption(t,parseInt(this.value))}}],t.ariaLabel?o[1]['aria-label']=t.ariaLabel:o[1].id=e,t.defaults&&(o=[o,t.defaults.map((function(e){return['button',{onclick:function(){var t=this.parentNode.firstChild;t.value=e.value,t.oninput()}},e.caption]}))]);else if(t.items){var i=function(e){return e.map((function(e){return['option',{value:e.value||e.name},e.desc||e.caption||e.name]}))},n=Array.isArray(t.items)?i(t.items):Object.keys(t.items).map((function(e){return['optgroup',{label:e},i(t.items[e])]}));o=['select',{id:e,value:r,onchange:function(){a.setOption(t,this.value)}},n]}else'string'==typeof t.values&&(t.values=t.values.split('|')),t.values&&(r=r==t.values[1]),o=['input',{type:'checkbox',id:e,checked:r||null,onchange:function(){var e=this.checked;t.values&&(e=t.values[e?1:0]),a.setOption(t,e)}}],'checkedNumber'==t.type&&(o=[o,[]]);return o},this.renderOption=function(e,t){if(!t.path||t.onchange||this.editor.$options[t.path]){var o=Array.isArray(t)?t[0].path:t.path;this.options[o]=t;var a='-'+o,r=o+'-label',i=this.renderOptionControl(a,t);return['tr',{class:'ace_optionsMenuEntry'},['td',['label',{for:a,id:r},e]],['td',i]]}},this.setOption=function(e,t){'string'==typeof e&&(e=this.options[e]),'false'==t&&(t=!1),'true'==t&&(t=!0),'null'==t&&(t=null),'undefined'==t&&(t=void 0),'string'==typeof t&&parseFloat(t).toString()==t&&(t=parseFloat(t)),e.onchange?e.onchange(t):e.path&&this.editor.setOption(e.path,t),this._signal('setOption',{name:e.path,value:t})},this.getOption=function(e){return e.getValue?e.getValue():this.editor.getOption(e.path)}}).call(m.prototype),t.OptionPanel=m})),ace.define('ace/ext/settings_menu',['require','exports','module','ace/ext/options','ace/ext/menu_tools/overlay_page','ace/editor'],(function(e,t,o){'use strict';var a=e('./options').OptionPanel,r=e('./menu_tools/overlay_page').overlayPage;function i(e){if(!document.getElementById('ace_settingsmenu')){var t=new a(e);t.render(),t.container.id='ace_settingsmenu',r(e,t.container),t.container.querySelector('select,input,button,checkbox').focus()}}o.exports.init=function(){var t=e('../editor').Editor;t.prototype.showSettingsMenu=function(){i(this)}}})),function(){ace.require(['ace/ext/settings_menu'],(function(e){'object'==('undefined'===typeof module?'undefined':_typeof(module))&&'object'==('undefined'===typeof exports?'undefined':_typeof(exports))&&module&&(module.exports=e)}))}();