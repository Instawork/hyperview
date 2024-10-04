(()=>{var e={47140:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>L});var n=r(81232),s=r(4942),o=r(4396),a=r.n(o);function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){(0,s.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var u=function(e,t){return a()(e).format(t)},c=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{headers:{}};return fetch(e,l(l({},t),{},{headers:l({"Cache-Control":"no-cache, no-store, must-revalidate",Expires:"0",Pragma:"no-cache"},t.headers),mode:"cors"}))};const j=[];var f=r(70885),d=r(34873),m=r(95004),p=r(2629);function b(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function h(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?b(Object(r),!0).forEach((function(t){(0,s.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):b(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var v=(0,m.createContext)({elementsProps:void 0,setElementProps:void 0});function g(e){var t=(0,m.useState)({}),r=(0,f.default)(t,2),n=r[0],o=r[1];return(0,p.jsx)(v.Provider,{value:{elementsProps:n,setElementProps:function(e,t){o(h(h({},n),{},(0,s.default)({},e,t)))}},children:e.children})}var y=r(22819),O=function(e){var t,r,n,s=e.id,o=null==(t=(0,m.useContext)(v).elementsProps)?void 0:t[s],a=Array.from((null==o||null==(r=o.element)?void 0:r.childNodes)||[]).find((function(e){return e.nodeType===y.NODE_TYPE.ELEMENT_NODE})),i=(0,m.useState)(a),l=(0,f.default)(i,2),u=l[0],c=l[1];if((0,m.useEffect)((function(){c(a)}),[a]),!o||!a)return null;return d.renderElement(u,o.stylesheets,(function(e,t,r,n){setTimeout((function(){return o.onUpdate(e,t,o.element,n)}),0),"swap"===t&&n.newElement&&c(n.newElement)}),{componentRegistry:null==(n=o.options)?void 0:n.componentRegistry})},w="https://instawork.com/hyperview-navigation",E=function(e){var t=(0,m.useContext)(v),r=e.element.getAttributeNS(w,"navigator");return(0,m.useEffect)((function(){r?null==t.setElementProps||t.setElementProps(r,e):console.warn("<navigation:bottom-tab-bar> element is missing `navigator` attribute")}),[r,e]),null};E.namespaceURI=w,E.localName="bottom-tab-bar",E.localNameAliases=[];var N=r(42982),k=r(66295),P="https://hyperview.org/filter",x=function e(t,r){return t.nodeType!==y.NODE_TYPE.ELEMENT_NODE?[]:r.reduce((function(e,r){return e||!!t.getAttributeNS(P,r)}),!1)?[t]:Array.from(t.childNodes).filter((function(e){return null!==e&&e.nodeType===y.NODE_TYPE.ELEMENT_NODE})).reduce((function(t,n){return t.push.apply(t,(0,N.default)(e(n,r))),t}),[])},S=function(e){var t=function(t){if((e.element.getAttributeNS(P,"on-event")||"")===t){var r=e.element.getAttributeNS(P,"on-param");if(r){var n=(e.element.getAttributeNS(P,"transform")||"").split(",").includes("lowercase"),s=e.options.componentRegistry?e.options.componentRegistry.getFormData(e.element):null,o=null==s?void 0:s.getParts().find((function(e){return e.fieldName===r})),a=o?o.string:"",i=n?a.toLowerCase():a;x(e.element,["terms","regex"]).forEach((function(e){var t=e.getAttributeNS(P,"terms")||"",r=e.getAttributeNS(P,"regex")||null,s=t.split(",").map((function(e){return n?e.toLowerCase():e}));e.setAttribute("hide",String(!(r?new RegExp(r).test(a):s.some((function(e){return e.startsWith(i)})))))}));var l=e.element.cloneNode(!0);e.onUpdate(null,"swap",e.element,{newElement:l}),x(l,["role"]).forEach((function(t){if("filter-terms"===t.getAttributeNS(P,"role")){if(t.namespaceURI===y.Namespaces.HYPERVIEW&&t.localName!==y.LOCAL_NAME.TEXT)return void k.error('Element with attribute `role="filter-terms"` should be a <text> element or a custom element');var r=t.cloneNode(!0);r.textContent=a,e.onUpdate(null,"swap",t,{newElement:r})}}))}}};return(0,m.useEffect)((function(){return y.Events.subscribe(t),function(){y.Events.unsubscribe(t)}}),[e.element]),y.default.renderChildren(e.element,e.stylesheets,e.onUpdate,e.options)};S.namespaceURI=P,S.localName="container",S.localNameAliases=[];var z=r(22152),_=r(4710);function A(e,t){if(!e)return t;if(e.endsWith("%")){var r=parseInt(e.slice(0,-1),10);return!Number.isNaN(r)&&(s=100,0<=(n=r)&&n>=s)?r:t}var n,s,o=parseInt(e,10);return Number.isNaN(o)?t:o}var T=function(e){var t=A(e.element.getAttribute("width"),"100%"),r=A(e.element.getAttribute("height"),"100%");return"web"===z.default.OS?(0,p.jsx)("div",{dangerouslySetInnerHTML:{__html:e.element.toString()}}):(0,p.jsx)(_.SvgXml,{height:r,width:t,xml:e.element.toString()})};T.namespaceURI="http://www.w3.org/2000/svg",T.localName="svg",T.localNameAliases=[];const D=[E,S,T];var C=r(68803),U=r(75705),R=r(39385);const L=function(){return(0,p.jsx)(n.SafeAreaProvider,{children:(0,p.jsx)(n.SafeAreaInsetsContext.Consumer,{children:function(e){var t,r;return(0,p.jsx)(R.default,{style:{flex:1,paddingBottom:null==e?void 0:e.bottom,paddingLeft:null==e?void 0:e.left,paddingRight:null==e?void 0:e.right},children:(0,p.jsx)(U.default,{children:(0,p.jsx)(g,{children:(0,p.jsx)(y.default,{behaviors:j,components:D,entrypointUrl:`${null==(t=C.default.expoConfig)||null==(r=t.extra)?void 0:r.baseUrl}/hyperview/public/index.xml`,fetch:c,formatDate:u,navigationComponents:{BottomTabBar:O}})})})})}})})}},46700:(e,t,r)=>{var n={"./af":26735,"./af.js":26735,"./ar":79343,"./ar-dz":55300,"./ar-dz.js":55300,"./ar-kw":77947,"./ar-kw.js":77947,"./ar-ly":92882,"./ar-ly.js":92882,"./ar-ma":43030,"./ar-ma.js":43030,"./ar-sa":22971,"./ar-sa.js":22971,"./ar-tn":78662,"./ar-tn.js":78662,"./ar.js":79343,"./az":81672,"./az.js":81672,"./be":39027,"./be.js":39027,"./bg":19107,"./bg.js":19107,"./bm":38932,"./bm.js":38932,"./bn":76218,"./bn-bd":33617,"./bn-bd.js":33617,"./bn.js":76218,"./bo":94527,"./bo.js":94527,"./br":53345,"./br.js":53345,"./bs":67930,"./bs.js":67930,"./ca":60454,"./ca.js":60454,"./cs":13984,"./cs.js":13984,"./cv":64646,"./cv.js":64646,"./cy":71372,"./cy.js":71372,"./da":62978,"./da.js":62978,"./de":32193,"./de-at":56365,"./de-at.js":56365,"./de-ch":29737,"./de-ch.js":29737,"./de.js":32193,"./dv":10872,"./dv.js":10872,"./el":99534,"./el.js":99534,"./en-au":68450,"./en-au.js":68450,"./en-ca":56996,"./en-ca.js":56996,"./en-gb":3864,"./en-gb.js":3864,"./en-ie":39472,"./en-ie.js":39472,"./en-il":40300,"./en-il.js":40300,"./en-in":67078,"./en-in.js":67078,"./en-nz":50472,"./en-nz.js":50472,"./en-sg":28696,"./en-sg.js":28696,"./eo":33550,"./eo.js":33550,"./es":59311,"./es-do":83080,"./es-do.js":83080,"./es-mx":77334,"./es-mx.js":77334,"./es-us":64336,"./es-us.js":64336,"./es.js":59311,"./et":28067,"./et.js":28067,"./eu":88831,"./eu.js":88831,"./fa":67981,"./fa.js":67981,"./fi":17479,"./fi.js":17479,"./fil":20757,"./fil.js":20757,"./fo":9510,"./fo.js":9510,"./fr":78573,"./fr-ca":6805,"./fr-ca.js":6805,"./fr-ch":74170,"./fr-ch.js":74170,"./fr.js":78573,"./fy":80926,"./fy.js":80926,"./ga":60203,"./ga.js":60203,"./gd":92975,"./gd.js":92975,"./gl":76890,"./gl.js":76890,"./gom-deva":24234,"./gom-deva.js":24234,"./gom-latn":97577,"./gom-latn.js":97577,"./gu":55804,"./gu.js":55804,"./he":5377,"./he.js":5377,"./hi":99401,"./hi.js":99401,"./hr":12435,"./hr.js":12435,"./hu":62728,"./hu.js":62728,"./hy-am":88093,"./hy-am.js":88093,"./id":26666,"./id.js":26666,"./is":35187,"./is.js":35187,"./it":62667,"./it-ch":56334,"./it-ch.js":56334,"./it.js":62667,"./ja":62414,"./ja.js":62414,"./jv":29359,"./jv.js":29359,"./ka":78740,"./ka.js":78740,"./kk":9521,"./kk.js":9521,"./km":21679,"./km.js":21679,"./kn":58554,"./kn.js":58554,"./ko":50686,"./ko.js":50686,"./ku":75965,"./ku.js":75965,"./ky":24780,"./ky.js":24780,"./lb":56950,"./lb.js":56950,"./lo":9434,"./lo.js":9434,"./lt":43681,"./lt.js":43681,"./lv":82552,"./lv.js":82552,"./me":18473,"./me.js":18473,"./mi":862,"./mi.js":862,"./mk":18932,"./mk.js":18932,"./ml":63174,"./ml.js":63174,"./mn":66863,"./mn.js":66863,"./mr":10566,"./mr.js":10566,"./ms":42215,"./ms-my":54959,"./ms-my.js":54959,"./ms.js":42215,"./mt":38830,"./mt.js":38830,"./my":19336,"./my.js":19336,"./nb":1413,"./nb.js":1413,"./ne":94005,"./ne.js":94005,"./nl":22699,"./nl-be":2796,"./nl-be.js":2796,"./nl.js":22699,"./nn":29700,"./nn.js":29700,"./oc-lnc":39495,"./oc-lnc.js":39495,"./pa-in":11217,"./pa-in.js":11217,"./pl":98807,"./pl.js":98807,"./pt":19221,"./pt-br":39895,"./pt-br.js":39895,"./pt.js":19221,"./ro":39162,"./ro.js":39162,"./ru":37991,"./ru.js":37991,"./sd":64518,"./sd.js":64518,"./se":64197,"./se.js":64197,"./si":40056,"./si.js":40056,"./sk":17025,"./sk.js":17025,"./sl":20069,"./sl.js":20069,"./sq":1961,"./sq.js":1961,"./sr":35820,"./sr-cyrl":20250,"./sr-cyrl.js":20250,"./sr.js":35820,"./ss":97806,"./ss.js":97806,"./sv":2833,"./sv.js":2833,"./sw":29018,"./sw.js":29018,"./ta":51830,"./ta.js":51830,"./te":2102,"./te.js":2102,"./tet":58711,"./tet.js":58711,"./tg":72615,"./tg.js":72615,"./th":38373,"./th.js":38373,"./tk":43277,"./tk.js":43277,"./tl-ph":76249,"./tl-ph.js":76249,"./tlh":87413,"./tlh.js":87413,"./tr":26726,"./tr.js":26726,"./tzl":29131,"./tzl.js":29131,"./tzm":45683,"./tzm-latn":22174,"./tzm-latn.js":22174,"./tzm.js":45683,"./ug-cn":74984,"./ug-cn.js":74984,"./uk":83778,"./uk.js":83778,"./ur":22753,"./ur.js":22753,"./uz":54345,"./uz-latn":67383,"./uz-latn.js":67383,"./uz.js":54345,"./vi":8201,"./vi.js":8201,"./x-pseudo":57395,"./x-pseudo.js":57395,"./yo":99359,"./yo.js":99359,"./zh-cn":75680,"./zh-cn.js":75680,"./zh-hk":89536,"./zh-hk.js":89536,"./zh-mo":35088,"./zh-mo.js":35088,"./zh-tw":2867,"./zh-tw.js":2867};function s(e){var t=o(e);return r(t)}function o(e){if(!r.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}s.keys=function(){return Object.keys(n)},s.resolve=o,e.exports=s,s.id=46700},24654:()=>{},22745:()=>{},40475:()=>{},60877:()=>{},51691:()=>{},7994:()=>{},32225:()=>{},97004:()=>{},3906:()=>{},5128:()=>{}},t={};function r(n){var s=t[n];if(void 0!==s)return s.exports;var o=t[n]={id:n,loaded:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}r.m=e,(()=>{var e=[];r.O=(t,n,s,o)=>{if(!n){var a=1/0;for(c=0;c<e.length;c++){for(var[n,s,o]=e[c],i=!0,l=0;l<n.length;l++)(!1&o||a>=o)&&Object.keys(r.O).every((e=>r.O[e](n[l])))?n.splice(l--,1):(i=!1,o<a&&(a=o));if(i){e.splice(c--,1);var u=s();void 0!==u&&(t=u)}}return t}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[n,s,o]}})(),r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;r.t=function(n,s){if(1&s&&(n=this(n)),8&s)return n;if("object"===typeof n&&n){if(4&s&&n.__esModule)return n;if(16&s&&"function"===typeof n.then)return n}var o=Object.create(null);r.r(o);var a={};e=e||[null,t({}),t([]),t(t)];for(var i=2&s&&n;"object"==typeof i&&!~e.indexOf(i);i=t(i))Object.getOwnPropertyNames(i).forEach((e=>a[e]=()=>n[e]));return a.default=()=>n,r.d(o,a),o}})(),r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={179:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var s,o,[a,i,l]=n,u=0;if(a.some((t=>0!==e[t]))){for(s in i)r.o(i,s)&&(r.m[s]=i[s]);if(l)var c=l(r)}for(t&&t(n);u<a.length;u++)o=a[u],r.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return r.O(c)},n=self.webpackChunkweb=self.webpackChunkweb||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var n=r.O(void 0,[672],(()=>r(46271)));n=r.O(n)})();
//# sourceMappingURL=main.236f7119.js.map