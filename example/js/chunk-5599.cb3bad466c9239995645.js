(self['webpackChunk']=self['webpackChunk']||[]).push([[5599],{41009:function(e){e.exports={container:'container-scc24',bg:'bg-o7f40'}},54365:function(e,n,t){e.exports=t.p+'assets/img/avatar_default.cd5e81c724e2.png'},66040:function(e,n,t){e.exports=t.p+'assets/img/logo.81cc72c63caf.png'},35599:function(e,n,t){'use strict';t.r(n),t.d(n,{default:function(){return j}});var r=t(62212),a=t(76345),i=t(94856),u=t(66040),s=t.n(u),l={class:'tw-flex tw-justify-center tw-mb-4'},o={class:'tw-mb-4 tw-text-center tw-text-xl'};function c(e,n,t,u,c,d){var p=(0,r.up)('AAlert'),m=(0,r.up)('AInput'),f=(0,r.up)('VeeField'),w=(0,r.up)('VeeErrorMessage'),g=(0,r.up)('AFormItem'),v=(0,r.up)('InputPassword'),h=(0,r.up)('SlideCaptcha'),Z=(0,r.up)('XButton'),b=(0,r.up)('AForm'),C=(0,r.up)('VeeForm');return(0,r.wg)(),(0,r.j4)('div',{class:['tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-pt-12 tw-pr-4 tw-pb-12 tw-pl-4',e.$style.bg]},[(0,r.Wm)('div',{class:['tw-min-w',e.$style.container]},[(0,r.Wm)('div',l,[(0,r.Wm)('img',{width:'80',height:'80',src:s(),alt:e.title,title:e.title},null,8,['alt','title'])]),(0,r.Wm)('div',o,(0,a.zw)(e.title),1),e.error?((0,r.wg)(),(0,r.j4)(p,{key:0,type:'error',closable:'',onClose:e.closeError},{description:(0,r.w5)((function(){return[(0,r.Uk)((0,a.zw)(e.error),1)]})),_:1},8,['onClose'])):(0,r.kq)('',!0),(0,r.Wm)(C,{initialValues:e.form.state,'validation-schema':e.form.schema},{default:(0,r.w5)((function(t){var u=t.handleSubmit,s=t.isSubmitting;return[(0,r.Wm)(b,{layout:'vertical'},{default:(0,r.w5)((function(){return[(0,r.Wm)(g,null,{default:(0,r.w5)((function(){return[(0,r.Wm)(f,{name:'username'},{default:(0,r.w5)((function(e){var n=e.field,t=e.handleChange;return[(0,r.Wm)(m,{type:'text',size:'large',value:n.value,onChange:t,placeholder:'Enter user name'},null,8,['value','onChange'])]})),_:1}),(0,r.Wm)(w,{class:'invalid-message',name:'username'})]})),_:1}),(0,r.Wm)(g,null,{default:(0,r.w5)((function(){return[(0,r.Wm)(f,{name:'password'},{default:(0,r.w5)((function(n){var t=n.field,a=n.handleChange;return[(0,r.Wm)(v,{type:'password',size:'large',visibilityToggle:'',value:t.value,onChange:a,onKeyup:(0,i.D2)((function(n){return u(e.onSubmit)}),['enter']),placeholder:'Enter user password'},null,8,['value','onChange','onKeyup'])]})),_:2},1024),(0,r.Wm)(w,{class:'invalid-message',name:'password'})]})),_:2},1024),(0,r.Wm)(g,null,{default:(0,r.w5)((function(){return[(0,r.Wm)(h,{presented:e.captcha.presented,'onUpdate:presented':[n[1]||(n[1]=function(n){return e.captcha.presented=n}),e.onSlideCaptchaChange],valid:e.captcha.valid,'onUpdate:valid':n[2]||(n[2]=function(n){return e.captcha.valid=n})},null,8,['presented','valid','onUpdate:presented'])]})),_:1}),(0,r.Wm)(g,null,{default:(0,r.w5)((function(){return[(0,r.Wm)(Z,{ref:'submitBtnRef',block:'',size:'large',type:'primary',loading:s,onClick:function(n){return u(e.onSubmit)}},{default:(0,r.w5)((function(){return[(0,r.Uk)((0,a.zw)(e.$t(e.i18nMessages.app.login.logIn)),1)]})),_:2},1032,['loading','onClick'])]})),_:2},1024)]})),_:2},1024)]})),_:1},8,['initialValues','validation-schema'])],2)],2)}var d,p=t(39486),m=t(46858),f=t(90304),w=(t(12099),t(83352),t(61013),t(52077),t(911),t(9572)),g=t(92220),v=t(29342),h=t(73190),Z=t(31110),b=t(35882),C=t(89080),k=t(38940),y=t(95692),W=t(14992),x=t(38451),P=t(87970),_=t(4169),S=t(8364),E=t(89184),I=(0,r.aZ)({components:(d={XButton:v.XButton,SlideCaptcha:v.SlideCaptcha},(0,f.Z)(d,b.ZP.name,b.ZP),(0,f.Z)(d,b.ZP.name,b.ZP),(0,f.Z)(d,C.Z.name,C.Z),(0,f.Z)(d,k.Z.name,k.Z),(0,f.Z)(d,y.ZP.name,y.ZP),(0,f.Z)(d,y.ZP.Item.name,y.ZP.Item),(0,f.Z)(d,'InputPassword',b.ZP.Password),d),setup:function(){var e=(0,g.QT)(),n=e.t,a=(0,h.yj)(),i=(0,h.tv)(),u=(0,Z.iH)(),s=P.O.APP_TITLE,l=(0,r.Fl)((function(){return a.params.error})),o=(0,Z.qj)({valid:!1,presented:!1}),c={state:{username:'admin',password:'12345678'},schema:{username:'required',password:'required'}},d=null,f=function(e){var n,t;e||(null===u||void 0===u||null===(n=u.value)||void 0===n||null===(t=n.$el)||void 0===t||t.click())},v=function(){var e,n,r,u=null!==(e=null===(n=d)||void 0===n||null===(r=n.roles)||void 0===r?void 0:r.map((function(e){return e.RoleCode})))&&void 0!==e?e:['admin'],s=d.privileges;return s=E.ON.getAuthorizedMenus(s,u),E.Fc.login({username:c.state.username,password:c.state.password,userid:c.state.username,realname:c.state.username,avatar:t(54365),tokenExpirationTime:(new Date).getTime()+864e5,accessToken:'Bearer '+(d.Token||''),roles:u,menus:s,permissions:[]}),E.ON.config.redirectEnable&&a.query.redirect?i.replace({path:a.query.redirect}):i.replace({name:E.ON.config.homePage})},b=function(){var e=(0,m.Z)(regeneratorRuntime.mark((function e(t){var r,a,i,u;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(o.valid){e.next=3;break}return o.presented=!0,e.abrupt('return');case 3:return e.next=5,(0,w.Z)(_.V.login(t));case 5:if(r=e.sent,a=(0,p.Z)(r,2),i=a[0],u=a[1],!i){e.next=13;break}W.Z.error({message:'',description:i.message,duration:1}),e.next=17;break;case 13:return d=u,e.next=16,v();case 16:x.Z.success(n(S.Q1.app.notification.login));case 17:case'end':return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),C=function(){a.params.error=null};return(0,r.se)((function(){o.valid=!1})),{submitBtnRef:u,i18nMessages:S.Q1,captcha:o,title:s,error:l,form:c,onSlideCaptchaChange:f,login:v,onSubmit:b,closeError:C}}}),T=t(41009),z=t.n(T);const A=I.__cssModules={};A['$style']=z(),I.render=c;var j=I}}]);