(()=>{var e={55466:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>Ke});var o=n(4942),r=n(4396),a=n.n(r);function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var l,c=function(e,t){return a()(e).format(t)},u=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{headers:{}};return fetch(e,s(s({},t),{},{headers:s({"Cache-Control":"no-cache, no-store, must-revalidate",Expires:"0",Pragma:"no-cache"},t.headers),mode:"cors"}))},f=n(43144),d=n(15671),p=function(e){return e[e.info=0]="info",e[e.log=1]="log",e[e.warn=2]="warn",e[e.error=3]="error",e}(p||{}),m=[p.info,p.log,p.warn,p.error],h=(l={},(0,o.default)(l,p.info,console.info),(0,o.default)(l,p.log,console.log),(0,o.default)(l,p.warn,console.warn),(0,o.default)(l,p.error,console.error),l),g=function(e){try{return null==e?void 0:e.toString()}catch(t){return e}},v=(0,f.default)((function e(t){var n=this;(0,d.default)(this,e),this.log=function(e){for(var t=arguments.length,o=new Array(t>1?t-1:0),r=1;r<t;r++)o[r-1]=arguments[r];n.emitter.apply(n,[p.log,e].concat(o))},this.info=function(e){for(var t=arguments.length,o=new Array(t>1?t-1:0),r=1;r<t;r++)o[r-1]=arguments[r];n.emitter.apply(n,[p.info,e].concat(o))},this.warn=function(e){for(var t=arguments.length,o=new Array(t>1?t-1:0),r=1;r<t;r++)o[r-1]=arguments[r];n.emitter.apply(n,[p.warn,e].concat(o))},this.error=function(e){for(var t=arguments.length,o=new Array(t>1?t-1:0),r=1;r<t;r++)o[r-1]=arguments[r];n.emitter.apply(n,[p.error,e].concat(o))},this.emitter=function(e,t){if(!(n.level>m.indexOf(e))){for(var o=arguments.length,r=new Array(o>2?o-2:0),a=2;a<o;a++)r[a-2]=arguments[a];h[e](g(t),r.map((function(e){return g(e)})))}},this.level=m.indexOf(t)}));v.Level=p;var y=n(81232),j=n(630),b=n(45772),O={action:"add-styles",callback:function(e,t,n,o){try{var r=j.getFirstTag(e,"styles");if(r){var a=(0,b.getAncestorByTagName)(e,"screen");if(a){var i=j.getFirstTag(a,"styles"),s=r.getElementsByTagName("style");if(i&&s)Array.from(s).forEach((function(e){i.appendChild(e)})),o((0,b.shallowCloneToRoot)(i),!0)}}var l=e.getAttribute("ran-once");if("true"===e.getAttribute("once")){if("true"===l)return;e.setAttribute("ran-once","true")}}catch(c){console.error(c)}}},S=n(15861),P=n(22152),w=n(79677),E="https://hyperview.org/share";const _=[O,{action:"share",callback:function(e){(0,S.default)((function*(){var t,n,o=e.getAttributeNS(E,"message"),r=e.getAttributeNS(E,"title"),a=e.getAttributeNS(E,"url"),i=function(e,t,n){return e?t&&n?{message:e,title:t,url:n}:t?{message:e,title:t}:n?{message:e,url:n}:{message:e}:n?t?{title:t,url:n}:{url:n}:null}("android"===P.default.OS?[o,a].filter(Boolean).join(" "):o,r,a);if(i){var s=(t=e.getAttributeNS(E,"dialog-title"),n=e.getAttributeNS(E,"subject"),t?n?{dialogTitle:t,subject:n}:{dialogTitle:t}:{});yield w.default.share(i,s)}}))()}}];var x=n(34873),N=n(70885),A=n(95004),T=n(2629);function D(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function C(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?D(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var k=(0,A.createContext)({getElementProps:void 0,setElement:void 0,setElementProps:void 0}),L={},H=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:L,t=arguments.length>1?arguments[1]:void 0,n=t.payload,r=n.element,a=n.navigator,i=n.props;switch(t.type){case"SET_ELEMENT_PROPS":return i?C(C({},e),{},(0,o.default)({},a,i)):e;case"SET_ELEMENT":return r?C(C({},e),{},(0,o.default)({},a,C(C({},e[a]||{}),{},{element:r}))):e;default:return e}};function M(e){var t=(0,A.useReducer)(H,L),n=(0,N.default)(t,2),o=n[0],r=n[1],a=(0,A.useCallback)((function(e){return o[e]}),[o]),i=(0,A.useCallback)((function(e,t){r({payload:{element:t,navigator:e},type:"SET_ELEMENT"})}),[r]),s=(0,A.useCallback)((function(e,t){r({payload:{navigator:e,props:t},type:"SET_ELEMENT_PROPS"})}),[r]);return(0,T.jsx)(k.Provider,{value:{getElementProps:a,setElement:i,setElementProps:s},children:e.children})}var I=function(){return(0,A.useContext)(k)};function R(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function Y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?R(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):R(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var U=function(e){var t=e.id,n=e.state,o=e.navigation,r=I(),a=r.getElementProps,i=r.setElement,s=null==a?void 0:a(t),l=(s||{}).onUpdate,c=(0,A.useCallback)((function(e,n,o,r){if("swap"===n&&null!=r&&r.newElement)if(o.parentNode){var a=o.parentNode;a.replaceChild(r.newElement,o),null==i||i(t,a)}else console.warn("Parent node is null. Cannot replace child element.");else null==l||l(e,n,o,r)}),[t,i,l]);return s?x.renderChildren(s.element,s.stylesheets,c,Y(Y({},s.options),{},{onSelect:function(e){e&&o.navigate(e)},targetId:n.routes[n.index].name})):null},B=n(42982),z=n(16184),F=n(61193),G=n(36676),V=n(93719),J=n(27994),X=n(21236),W=n(14584),$=n(99294),Z=n(39385),q=n(59896),K=n(46823),Q={code:"function anonymous(_stopPointLocations,screenHeight,translateY){let nextStopPoint=-1;for(let i=_stopPointLocations.length-1;i>=0;i-=1){const stopPointLocation=_stopPointLocations[i];if(stopPointLocation!==null){const stopPointY=-screenHeight*stopPointLocation;if(translateY>stopPointY){nextStopPoint=stopPointLocation;}}}if(nextStopPoint===-1){const stopPointLocation=_stopPointLocations[_stopPointLocations.length-1];if(stopPointLocation!==null){nextStopPoint=stopPointLocation;}}return nextStopPoint;}",location:"/home/circleci/project/demo/src/Components/BottomSheet/utils.ts"},ee=function(){var e=function(e,t,n){for(var o=-1,r=e.length-1;r>=0;r-=1){var a=e[r];if(null!==a)n>-t*a&&(o=a)}if(-1===o){var i=e[e.length-1];null!==i&&(o=i)}return o};return e._closure={},e.__initData=Q,e.__workletHash=3406964512397,e}(),te={code:"function anonymous(_stopPointLocations,screenHeight,translateY){let nextStopPoint=-1;for(let i=0;i<_stopPointLocations.length;i+=1){const stopPointLocation=_stopPointLocations[i];if(stopPointLocation!==null){const stopPoint=-screenHeight*stopPointLocation;if(translateY<stopPoint){nextStopPoint=stopPointLocation;}}}if(nextStopPoint===-1){const[stopPointLocation]=_stopPointLocations;if(stopPointLocation!==null){nextStopPoint=stopPointLocation;}}return nextStopPoint;}",location:"/home/circleci/project/demo/src/Components/BottomSheet/utils.ts"},ne=function(){var e=function(e,t,n){for(var o=-1,r=0;r<e.length;r+=1){var a=e[r];if(null!==a)n<-t*a&&(o=a)}if(-1===o){var i=(0,N.default)(e,1)[0];null!==i&&(o=i)}return o};return e._closure={},e.__initData=te,e.__workletHash=0xc8cac9487e1,e}(),oe="https://hyperview.org/bottom-sheet",re=(0,A.createContext)({setContentSectionHeight:void 0}),ae=function(e){var t=e.element.getAttribute("key"),n=(0,A.useContext)(re).setContentSectionHeight,o=A.useCallback((function(e){var o=e.nativeEvent.layout.height;null==n||n(t?parseInt(t,10):-1,o)}),[t,n]),r=K.default.renderChildren(e.element,e.stylesheets,e.onUpdate,e.options);return(0,T.jsx)(Z.default,{onLayout:o,children:r})};ae.namespaceURI=oe,ae.localName="content-section",ae.localNameAliases=[];var ie=function(e){var t=K.default.renderChildren(e.element,e.stylesheets,e.onUpdate,e.options);return(0,T.jsx)(Z.default,{children:t})};ie.namespaceURI=oe,ie.localName="stop-point",ie.localNameAliases=[];var se=n(97129);const le=n(72010).default.create({bottomSheetContainer:{backgroundColor:"#fff",position:"absolute",width:"100%"},container:{left:0,position:"absolute",right:0},handle:{alignSelf:"center",backgroundColor:"gray",borderRadius:25,height:4,marginVertical:15,width:75},overflow:{overflow:"hidden"},overlay:{bottom:0,left:0,position:"absolute",right:0,top:0}}),ce=function(e){return(0,T.jsx)(se.default,{onPress:e.onPress,children:(0,T.jsx)(X.default,{style:[le.overlay,e.style]})})};function ue(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function fe(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ue(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ue(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var de=W.default.get("window").height,pe={code:"function anonymous(destination){const{runOnJS,setUpcomingTranslateY,translateY,withSpring,DEFAULT_DAMPING}=this._closure;runOnJS(setUpcomingTranslateY)(destination);translateY.value=withSpring(destination,{damping:DEFAULT_DAMPING});}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},me={code:"function anonymous(){const{scrollTo,overlayOpacity,withTiming,hvProps,runOnJS,hide}=this._closure;scrollTo(0);overlayOpacity.value=withTiming(0,{duration:hvProps.animationDuration},function(finished){if(finished){runOnJS(hide)();}});}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},he={code:"function anonymous(finished){const{runOnJS,hide}=this._closure;if(finished){runOnJS(hide)();}}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},ge={code:"function anonymous(){const{translateY,velocity,SCREEN_HEIGHT,hvProps,SWIPE_TO_CLOSE_THRESHOLD,animateClose,contentSectionHeights,stopPointLocations,MIN_VELOCITY_FOR_MOVE,scrollTo,context,dragUpHelper,dragDownHelper,MAX_TRANSLATE_Y,PADDING,height}=this._closure;const changeY=translateY.value+velocity.value*SCREEN_HEIGHT;if(hvProps.swipeToClose&&-changeY<SCREEN_HEIGHT*SWIPE_TO_CLOSE_THRESHOLD){animateClose();return;}if(contentSectionHeights.length>0){let cumlHeight=0;contentSectionHeights.forEach(function(csHeight,index){cumlHeight+=csHeight;stopPointLocations[index]=Math.min(cumlHeight/SCREEN_HEIGHT,1.0);});}if(stopPointLocations.length>0){let nextStopPoint=-1;if(Math.abs(velocity.value)<MIN_VELOCITY_FOR_MOVE){scrollTo(context.value.y);}else if(velocity.value<0){nextStopPoint=dragUpHelper(stopPointLocations,SCREEN_HEIGHT,translateY.value);}else{nextStopPoint=dragDownHelper(stopPointLocations,SCREEN_HEIGHT,translateY.value);}if(nextStopPoint>-1){scrollTo(Math.max(MAX_TRANSLATE_Y,-nextStopPoint*SCREEN_HEIGHT-PADDING,-height-PADDING));}}}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},ve={code:"function anonymous(){const{context,translateY}=this._closure;context.value={startTime:Date.now(),y:translateY.value};}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},ye={code:"function anonymous(event){const{context,translateY,velocity,MAX_TRANSLATE_Y}=this._closure;const currentTime=Date.now();const timeDiff=currentTime-context.value.startTime;const yDiff=event.translationY+context.value.y-translateY.value;velocity.value=yDiff/timeDiff;translateY.value=event.translationY+context.value.y;translateY.value=Math.max(translateY.value,MAX_TRANSLATE_Y);}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},je={code:"function anonymous(){const{findBottomSheetEndPoint}=this._closure;findBottomSheetEndPoint();}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},be={code:"function anonymous(){const{overlayOpacity}=this._closure;return{opacity:overlayOpacity.value};}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},Oe={code:"function anonymous(){const{contentOpacity,translateY}=this._closure;return{opacity:contentOpacity.value,transform:[{translateY:translateY.value}]};}",location:"/home/circleci/project/demo/src/Components/BottomSheet/BottomSheet.tsx"},Se=function(e){var t,n,o=(0,y.useSafeAreaInsets)(),r=P.default.select({default:o.top,ios:o.bottom}),a=P.default.select({default:0,ios:o.top}),i=-(de-a),s=e.element.getAttributeNS(oe,"animation-duration"),l={animationDuration:s?parseInt(s,10):250,contentSections:e.element.getElementsByTagNameNS(oe,ae.localName),dismissible:"false"!==e.element.getAttributeNS(oe,"dismissible"),stopPoints:e.element.getElementsByTagNameNS(oe,ie.localName),swipeToClose:"true"===e.element.getAttributeNS(oe,"swipe-to-close"),toggleEventName:e.element.getAttributeNS(oe,"toggle-event-name"),visible:"true"===e.element.getAttributeNS(oe,"visible")},c=e.element.prefix,u={container:K.default.createStyleProp(e.element,e.stylesheets,fe(fe({},e.options),{},{styleAttr:`${c}:container-style`})),handle:K.default.createStyleProp(e.element,e.stylesheets,fe(fe({},e.options),{},{styleAttr:`${c}:handle-style`})),overlay:K.default.createStyleProp(e.element,e.stylesheets,fe(fe({},e.options),{},{styleAttr:`${c}:overlay-style`}))},f=(0,A.useState)(new Array(l.contentSections.length)),d=(0,N.default)(f,2),p=d[0],m=d[1],h=A.useMemo((function(){return Array.from(l.stopPoints).map((function(e){var t=e.getAttributeNS(oe,"location");return"string"!==typeof e&&e&&t&&"string"===typeof t?parseFloat(t):null}),[]).sort((function(e,t){return null!==e&&null!==t?e-t:0}))}),[l.stopPoints]),g=(0,A.useState)(l.visible),v=(0,N.default)(g,2),j=v[0],b=v[1],O=(0,A.useState)(0),S=(0,N.default)(O,2),w=S[0],E=S[1],_=(0,z.useSharedValue)(0),x=(0,z.useSharedValue)(0),D=(0,z.useSharedValue)({startTime:Date.now(),y:0}),C=(0,z.useSharedValue)(0),k=(0,A.useState)(0),L=(0,N.default)(k,2),H=L[0],M=L[1],I=(0,z.useSharedValue)(0),R=null!=(t=null==(n=u.overlay[0])?void 0:n.opacity)?t:1,Y=function(){b(!1)},U=(0,A.useCallback)(function(){var e=function(e){(0,F.runOnJS)(M)(e),C.value=(0,G.withSpring)(e,{damping:50})};return e._closure={runOnJS:F.runOnJS,setUpcomingTranslateY:M,translateY:C,withSpring:G.withSpring,DEFAULT_DAMPING:50},e.__initData=pe,e.__workletHash=2105334607199,e}(),[C]);(0,A.useEffect)((function(){void 0!==p[0]&&U(-p[0]-r)}),[p,U,r]);var W=(0,A.useCallback)((function(){if(b(!0),l.contentSections.length>0)void 0!==p[0]&&U(-p[0]-r);else if(l.stopPoints.length>0){var e=(0,N.default)(h,1)[0];null!==e&&U(-de*e)}else U(-w-r);_.value=(0,V.withTiming)(R,{duration:l.animationDuration}),x.value=(0,V.withTiming)(1,{duration:1})}),[w,p,h,l.animationDuration,R,x,_,l.contentSections.length,l.stopPoints.length,U,r]),Q=(0,A.useCallback)(function(){var e=function(){U(0),_.value=(0,V.withTiming)(0,{duration:l.animationDuration},function(){var e=function(e){e&&(0,F.runOnJS)(Y)()};return e._closure={runOnJS:F.runOnJS,hide:Y},e.__initData=he,e.__workletHash=3213557872493,e}())};return e._closure={scrollTo:U,overlayOpacity:_,withTiming:V.withTiming,hvProps:l,runOnJS:F.runOnJS,hide:Y},e.__initData=me,e.__workletHash=5319102576404,e}(),[U,l.animationDuration,_]);(0,A.useEffect)((function(){b(l.visible)}),[l.visible]);var te=(0,A.useCallback)((function(e){l.toggleEventName&&e===l.toggleEventName&&(j?Q():W())}),[l.toggleEventName,W,Q,j]);(0,A.useEffect)((function(){return K.Events.subscribe(te),function(){K.Events.unsubscribe(te)}}),[te,j]);var se=Array.from(e.element.childNodes).filter((function(e){return"bottom-sheet:stop-point"!==e.tagName})),ue=K.default.renderChildNodes(se,e.stylesheets,e.onUpdate,e.options),Se=function(){var e=function(){var e=C.value+I.value*de;if(l.swipeToClose&&-e<.1*de)Q();else{if(p.length>0){var t=0;p.forEach((function(e,n){t+=e,h[n]=Math.min(t/de,1)}))}if(h.length>0){var n=-1;Math.abs(I.value)<.01?U(D.value.y):n=I.value<0?ee(h,de,C.value):ne(h,de,C.value),n>-1&&U(Math.max(i,-n*de-r,-w-r))}}};return e._closure={translateY:C,velocity:I,SCREEN_HEIGHT:de,hvProps:l,SWIPE_TO_CLOSE_THRESHOLD:.1,animateClose:Q,contentSectionHeights:p,stopPointLocations:h,MIN_VELOCITY_FOR_MOVE:.01,scrollTo:U,context:D,dragUpHelper:ee,dragDownHelper:ne,MAX_TRANSLATE_Y:i,PADDING:r,height:w},e.__initData=ge,e.__workletHash=0xf736f0eb028,e}(),Pe=l.stopPoints.length>0||l.contentSections.length>0,we=q.Gesture.Pan().enabled(Pe).onStart(function(){var e=function(){D.value={startTime:Date.now(),y:C.value}};return e._closure={context:D,translateY:C},e.__initData=ve,e.__workletHash=0xf85a9b1b0d3,e}()).onUpdate(function(){var e=function(e){var t=Date.now()-D.value.startTime,n=e.translationY+D.value.y-C.value;I.value=n/t,C.value=e.translationY+D.value.y,C.value=Math.max(C.value,i)};return e._closure={context:D,translateY:C,velocity:I,MAX_TRANSLATE_Y:i},e.__initData=ye,e.__workletHash=0xdbb05c451d6,e}()).onEnd(function(){var e=function(){Se()};return e._closure={findBottomSheetEndPoint:Se},e.__initData=je,e.__workletHash=3015972737288,e}()),Ee=(0,J.useAnimatedStyle)(function(){var e=function(){return{opacity:_.value}};return e._closure={overlayOpacity:_},e.__initData=be,e.__workletHash=7579274237283,e}()),_e=(0,J.useAnimatedStyle)(function(){var e=function(){return{opacity:x.value,transform:[{translateY:C.value}]}};return e._closure={contentOpacity:x,translateY:C},e.__initData=Oe,e.__workletHash=0xee7545a8055,e}()),xe=(0,A.useMemo)((function(){var e=function(e){var t=e.nativeEvent.layout.height;E(t)};return"ios"===P.default.OS?(0,T.jsx)(Z.default,{onLayout:e,onStartShouldSetResponder:function(){return H>i},children:(0,T.jsx)(T.Fragment,{children:ue})}):(0,T.jsx)(Z.default,{onLayout:e,children:(0,T.jsx)(q.ScrollView,{nestedScrollEnabled:!0,scrollEnabled:H<=i,children:ue})})}),[H,ue,i]),Ne=(0,T.jsx)(q.GestureDetector,{gesture:we,children:(0,T.jsxs)(X.default,{style:[le.bottomSheetContainer,_e,u.container,{height:de,top:de}],children:[Pe&&(0,T.jsx)(Z.default,{style:[le.handle,u.handle]}),xe]})});if(0===w)return Ne;return(0,T.jsx)(re.Provider,{value:{setContentSectionHeight:function(e,t){var n=(0,B.default)(p);n[e]=t,m(n)}},children:(0,T.jsx)($.default,{onShow:W,transparent:!0,visible:j,children:(0,T.jsxs)(q.GestureHandlerRootView,{style:{flex:1},children:[(0,T.jsx)(ce,{onPress:function(){return l.dismissible&&Q()},style:[le.overlay,u.overlay,Ee]}),Ne]})})})};Se.localName="bottom-sheet",Se.localNameAliases=[],Se.namespaceURI=oe;var Pe="https://hyperview.org/navigation",we=function(e){var t=I().setElementProps,n=e.element.getAttributeNS(Pe,"navigator");return(0,A.useEffect)((function(){n?"true"!==e.element.getAttribute("registered")&&(e.element.setAttribute("registered","true"),null==t||t(n,e)):console.warn("<navigation:bottom-tab-bar> element is missing `navigator` attribute")}),[n,e,t]),null};we.namespaceURI=Pe,we.localName="bottom-tab-bar",we.localNameAliases=[];var Ee=n(63121);function _e(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function xe(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_e(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_e(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Ne=function(e){var t,n=e.element.getAttributeNS(Pe,"route"),o=n===(null==(t=e.options)?void 0:t.targetId),r=(0,A.useState)(!1),a=(0,N.default)(r,2),i=a[0],s=a[1],l=xe(xe({},e.options),{},{pressed:i,pressedSelected:i&&o,selected:o}),c=(0,b.createProps)(e.element,e.stylesheets,l),u={onPress:(0,Ee.createEventHandler)((function(){var t;null==(t=e.options)||null==t.onSelect||t.onSelect(n)}),!0),onPressIn:(0,Ee.createEventHandler)((function(){return s(!0)})),onPressOut:(0,Ee.createEventHandler)((function(){return s(!1)})),style:{}};c.style&&c.style.flex&&(u.style={flex:c.style.flex});var f=A.createElement.apply(void 0,[Z.default,c].concat((0,B.default)(x.renderChildren(e.element,e.stylesheets,e.onUpdate,l))));return(0,A.createElement)(se.default,u,f)};Ne.namespaceURI=Pe,Ne.localName="bottom-tab-bar-item",Ne.localNameAliases=[];var Ae=n(33262),Te=n(82770),De=n(95260),Ce="https://hyperview.org/map",ke=function(e){var t,n=K.default.createStyleProp(e.element,e.stylesheets,e.options),o=(0,A.useCallback)((function(t){return e.element.getAttributeNS(Ce,t)}),[e.element]),r={animated:"false"!==o("animated"),autoZoomToMarkers:null!=(t=o("auto-zoom-to-markers"))?t:"on",padding:parseInt(o("padding")||"0",10),region:{latitude:parseFloat(o("latitude")||"0"),latitudeDelta:parseFloat(o("latitude-delta")||"0"),longitude:parseFloat(o("longitude")||"0"),longitudeDelta:parseFloat(o("longitude-delta")||"0")}},a=(0,A.useRef)(null),i=Array.from(e.element.childNodes).filter((function(e){return"map:map-marker"===e.tagName})).map((function(e){return{latitude:parseFloat(e.getAttribute("latitude")||"0"),longitude:parseFloat(e.getAttribute("longitude")||"0")}})),s=K.default.renderChildren(e.element,e.stylesheets,e.onUpdate,e.options);return(0,T.jsx)(De.default,{ref:a,cacheEnabled:!1,initialRegion:r.region,liteMode:!0,moveOnMarkerPress:!1,onLayout:function(){if("off"!==r.autoZoomToMarkers&&a.current&&!(i.length<=1)){if("out-only"===r.autoZoomToMarkers){var e=Math.min.apply(Math,(0,B.default)(i.map((function(e){return e.latitude})))),t=Math.max.apply(Math,(0,B.default)(i.map((function(e){return e.latitude})))),n=Math.min.apply(Math,(0,B.default)(i.map((function(e){return e.longitude})))),o=Math.max.apply(Math,(0,B.default)(i.map((function(e){return e.longitude}))));if(e>=r.region.latitude-r.region.latitudeDelta&&t<=r.region.latitude+r.region.latitudeDelta&&n>=r.region.longitude-r.region.longitudeDelta&&o<=r.region.longitude+r.region.longitudeDelta)return}a.current.fitToCoordinates(i,{animated:r.animated,edgePadding:{bottom:r.padding,left:r.padding,right:r.padding,top:r.padding}})}},pitchEnabled:!1,scrollEnabled:!1,showsBuildings:!1,showsCompass:!1,showsIndoors:!1,showsMyLocationButton:!1,showsPointsOfInterest:!0,showsScale:!1,showsTraffic:!1,showsUserLocation:!1,style:n,toolbarEnabled:!1,zoomEnabled:!1,children:s})};ke.namespaceURI=Ce,ke.localName="map",ke.localNameAliases=[];var Le=function(e){var t=(0,A.useCallback)((function(t){return e.element.getAttributeNS(Ce,t)}),[e.element]),n={latitude:parseFloat(t("latitude")||"0"),longitude:parseFloat(t("longitude")||"0")},o=K.default.renderChildren(e.element,e.stylesheets,e.onUpdate,e.options);return"web"===P.default.OS?(0,T.jsx)(De.default.Marker,{coordinate:n,children:o}):(0,T.jsx)(De.MapMarker,{coordinate:n,children:o})};function He(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}Le.namespaceURI=Ce,Le.localName="map-marker",Le.localNameAliases=[];var Me=function(e){var t=(0,A.useState)(!0),n=(0,N.default)(t,2),r=n[0],a=n[1];return(0,A.useEffect)((function(){var e=function(){var e=(0,S.default)((function*(){var e,t,n=new Te.Loader({apiKey:null==(e=Ae.default.expoConfig)||null==(t=e.extra)?void 0:t.googleMapsApiKey,version:"weekly"});yield n.load(),a(!1)}));return function(){return e.apply(this,arguments)}}();e()}),[]),r?(0,T.jsx)("div",{children:"Loading..."}):(0,T.jsx)(ke,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?He(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):He(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e))};Me.namespaceURI=ke.namespaceURI,Me.localName=ke.localName,Me.localNameAliases=ke.localNameAliases;var Ie=n(66295),Re="https://hyperview.org/filter",Ye=function e(t,n){return t.nodeType!==K.NODE_TYPE.ELEMENT_NODE?[]:n.reduce((function(e,n){return e||!!t.getAttributeNS(Re,n)}),!1)?[t]:Array.from(t.childNodes).filter((function(e){return null!==e&&e.nodeType===K.NODE_TYPE.ELEMENT_NODE})).reduce((function(t,o){return t.push.apply(t,(0,B.default)(e(o,n))),t}),[])},Ue=function(e){var t=function(t){if((e.element.getAttributeNS(Re,"on-event")||"")===t){var n=e.element.getAttributeNS(Re,"on-param");if(n){var o=(e.element.getAttributeNS(Re,"transform")||"").split(",").includes("lowercase"),r=e.options.componentRegistry?e.options.componentRegistry.getFormData(e.element):null,a=null==r?void 0:r.getParts().find((function(e){return e.fieldName===n})),i=a?a.string:"",s=o?i.toLowerCase():i;Ye(e.element,["terms","regex"]).forEach((function(e){var t=e.getAttributeNS(Re,"terms")||"",n=e.getAttributeNS(Re,"regex")||null,r=t.split(",").map((function(e){return o?e.toLowerCase():e}));e.setAttribute("hide",String(!(n?new RegExp(n).test(i):r.some((function(e){return e.startsWith(s)})))))}));var l=e.element.cloneNode(!0);e.onUpdate(null,"swap",e.element,{newElement:l}),Ye(l,["role"]).forEach((function(t){if("filter-terms"===t.getAttributeNS(Re,"role")){if(t.namespaceURI===K.Namespaces.HYPERVIEW&&t.localName!==K.LOCAL_NAME.TEXT)return void Ie.error('Element with attribute `role="filter-terms"` should be a <text> element or a custom element');var n=t.cloneNode(!0);n.textContent=i,e.onUpdate(null,"swap",t,{newElement:n})}}))}}};return(0,A.useEffect)((function(){return K.Events.subscribe(t),function(){K.Events.unsubscribe(t)}}),[e.element]),K.default.renderChildren(e.element,e.stylesheets,e.onUpdate,e.options)};Ue.namespaceURI=Re,Ue.localName="container",Ue.localNameAliases=[];var Be=n(43737);function ze(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function Fe(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ze(Object(n),!0).forEach((function(t){(0,o.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ze(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Ge="https://hyperview.org/progress-bar",Ve=function(e,t,n){var o=t.getAttributeNS(Ge,e);return o?parseFloat(o):n},Je=function(e){var t=Ve("value",e.element,0),n=Ve("max-value",e.element,1),o=Ve("duration",e.element,200),r=(0,A.useState)(t),a=(0,N.default)(r,1)[0],i=(0,A.useRef)(new Be.default.Value(t)).current,s={width:i.interpolate({inputRange:[0,n],outputRange:["0%","100%"]})},l=K.default.createProps(e.element,e.stylesheets,e.options),c=K.default.createStyleProp(e.element,e.stylesheets,Fe(Fe({},e.options),{},{styleAttr:`${e.element.prefix}:bar-style`}));return(0,A.useEffect)((function(){a!==t&&Be.default.timing(i,{duration:o,toValue:t,useNativeDriver:!1}).start()}),[a,i,o,t]),(0,T.jsx)(Z.default,Fe(Fe({},l),{},{children:(0,T.jsx)(Be.default.View,{style:[].concat((0,B.default)(c),[s])})}))};Je.namespaceURI=Ge,Je.localName="progress-bar",Je.localNameAliases=[];var Xe=n(79857);function We(e,t){if(!e)return t;if(e.endsWith("%")){var n=parseInt(e.slice(0,-1),10);return!Number.isNaN(n)&&(r=100,0<=(o=n)&&o>=r)?n:t}var o,r,a=parseInt(e,10);return Number.isNaN(a)?t:a}var $e=function(e){var t=We(e.element.getAttribute("width"),"100%"),n=We(e.element.getAttribute("height"),"100%");return"web"===P.default.OS?(0,T.jsx)("div",{dangerouslySetInnerHTML:{__html:e.element.toString()}}):(0,T.jsx)(Xe.SvgXml,{height:n,width:t,xml:e.element.toString()})};$e.namespaceURI="http://www.w3.org/2000/svg",$e.localName="svg",$e.localNameAliases=[];const Ze=[Se,ae,ie,we,Ne,Ue,Me,Le,Je,$e];var qe=n(75705);const Ke=function(){return(0,T.jsx)(y.SafeAreaProvider,{children:(0,T.jsx)(y.SafeAreaInsetsContext.Consumer,{children:function(e){var t,n;return(0,T.jsx)(Z.default,{style:{flex:1,paddingBottom:null==e?void 0:e.bottom,paddingLeft:null==e?void 0:e.left,paddingRight:null==e?void 0:e.right},children:(0,T.jsx)(qe.default,{children:(0,T.jsx)(M,{children:(0,T.jsx)(K.default,{behaviors:_,components:Ze,entrypointUrl:`${null==(t=Ae.default.expoConfig)||null==(n=t.extra)?void 0:n.baseUrl}/hyperview/public/index.xml`,fetch:u,formatDate:c,logger:new v(v.Level.log),navigationComponents:{BottomTabBar:U}})})})})}})})}},46700:(e,t,n)=>{var o={"./af":26735,"./af.js":26735,"./ar":79343,"./ar-dz":55300,"./ar-dz.js":55300,"./ar-kw":77947,"./ar-kw.js":77947,"./ar-ly":92882,"./ar-ly.js":92882,"./ar-ma":43030,"./ar-ma.js":43030,"./ar-sa":22971,"./ar-sa.js":22971,"./ar-tn":78662,"./ar-tn.js":78662,"./ar.js":79343,"./az":81672,"./az.js":81672,"./be":39027,"./be.js":39027,"./bg":19107,"./bg.js":19107,"./bm":38932,"./bm.js":38932,"./bn":76218,"./bn-bd":33617,"./bn-bd.js":33617,"./bn.js":76218,"./bo":94527,"./bo.js":94527,"./br":53345,"./br.js":53345,"./bs":67930,"./bs.js":67930,"./ca":60454,"./ca.js":60454,"./cs":13984,"./cs.js":13984,"./cv":64646,"./cv.js":64646,"./cy":71372,"./cy.js":71372,"./da":62978,"./da.js":62978,"./de":32193,"./de-at":56365,"./de-at.js":56365,"./de-ch":29737,"./de-ch.js":29737,"./de.js":32193,"./dv":10872,"./dv.js":10872,"./el":99534,"./el.js":99534,"./en-au":68450,"./en-au.js":68450,"./en-ca":56996,"./en-ca.js":56996,"./en-gb":3864,"./en-gb.js":3864,"./en-ie":39472,"./en-ie.js":39472,"./en-il":40300,"./en-il.js":40300,"./en-in":67078,"./en-in.js":67078,"./en-nz":50472,"./en-nz.js":50472,"./en-sg":28696,"./en-sg.js":28696,"./eo":33550,"./eo.js":33550,"./es":59311,"./es-do":83080,"./es-do.js":83080,"./es-mx":77334,"./es-mx.js":77334,"./es-us":64336,"./es-us.js":64336,"./es.js":59311,"./et":28067,"./et.js":28067,"./eu":88831,"./eu.js":88831,"./fa":67981,"./fa.js":67981,"./fi":17479,"./fi.js":17479,"./fil":20757,"./fil.js":20757,"./fo":9510,"./fo.js":9510,"./fr":78573,"./fr-ca":6805,"./fr-ca.js":6805,"./fr-ch":74170,"./fr-ch.js":74170,"./fr.js":78573,"./fy":80926,"./fy.js":80926,"./ga":60203,"./ga.js":60203,"./gd":92975,"./gd.js":92975,"./gl":76890,"./gl.js":76890,"./gom-deva":24234,"./gom-deva.js":24234,"./gom-latn":97577,"./gom-latn.js":97577,"./gu":55804,"./gu.js":55804,"./he":5377,"./he.js":5377,"./hi":99401,"./hi.js":99401,"./hr":12435,"./hr.js":12435,"./hu":62728,"./hu.js":62728,"./hy-am":88093,"./hy-am.js":88093,"./id":26666,"./id.js":26666,"./is":35187,"./is.js":35187,"./it":62667,"./it-ch":56334,"./it-ch.js":56334,"./it.js":62667,"./ja":62414,"./ja.js":62414,"./jv":29359,"./jv.js":29359,"./ka":78740,"./ka.js":78740,"./kk":9521,"./kk.js":9521,"./km":21679,"./km.js":21679,"./kn":58554,"./kn.js":58554,"./ko":50686,"./ko.js":50686,"./ku":75965,"./ku.js":75965,"./ky":24780,"./ky.js":24780,"./lb":56950,"./lb.js":56950,"./lo":9434,"./lo.js":9434,"./lt":43681,"./lt.js":43681,"./lv":82552,"./lv.js":82552,"./me":18473,"./me.js":18473,"./mi":862,"./mi.js":862,"./mk":18932,"./mk.js":18932,"./ml":63174,"./ml.js":63174,"./mn":66863,"./mn.js":66863,"./mr":10566,"./mr.js":10566,"./ms":42215,"./ms-my":54959,"./ms-my.js":54959,"./ms.js":42215,"./mt":38830,"./mt.js":38830,"./my":19336,"./my.js":19336,"./nb":1413,"./nb.js":1413,"./ne":94005,"./ne.js":94005,"./nl":22699,"./nl-be":2796,"./nl-be.js":2796,"./nl.js":22699,"./nn":29700,"./nn.js":29700,"./oc-lnc":39495,"./oc-lnc.js":39495,"./pa-in":11217,"./pa-in.js":11217,"./pl":98807,"./pl.js":98807,"./pt":19221,"./pt-br":39895,"./pt-br.js":39895,"./pt.js":19221,"./ro":39162,"./ro.js":39162,"./ru":37991,"./ru.js":37991,"./sd":64518,"./sd.js":64518,"./se":64197,"./se.js":64197,"./si":40056,"./si.js":40056,"./sk":17025,"./sk.js":17025,"./sl":20069,"./sl.js":20069,"./sq":1961,"./sq.js":1961,"./sr":35820,"./sr-cyrl":20250,"./sr-cyrl.js":20250,"./sr.js":35820,"./ss":97806,"./ss.js":97806,"./sv":2833,"./sv.js":2833,"./sw":29018,"./sw.js":29018,"./ta":51830,"./ta.js":51830,"./te":2102,"./te.js":2102,"./tet":58711,"./tet.js":58711,"./tg":72615,"./tg.js":72615,"./th":38373,"./th.js":38373,"./tk":43277,"./tk.js":43277,"./tl-ph":76249,"./tl-ph.js":76249,"./tlh":87413,"./tlh.js":87413,"./tr":26726,"./tr.js":26726,"./tzl":29131,"./tzl.js":29131,"./tzm":45683,"./tzm-latn":22174,"./tzm-latn.js":22174,"./tzm.js":45683,"./ug-cn":74984,"./ug-cn.js":74984,"./uk":83778,"./uk.js":83778,"./ur":22753,"./ur.js":22753,"./uz":54345,"./uz-latn":67383,"./uz-latn.js":67383,"./uz.js":54345,"./vi":8201,"./vi.js":8201,"./x-pseudo":57395,"./x-pseudo.js":57395,"./yo":99359,"./yo.js":99359,"./zh-cn":75680,"./zh-cn.js":75680,"./zh-hk":89536,"./zh-hk.js":89536,"./zh-mo":35088,"./zh-mo.js":35088,"./zh-tw":2867,"./zh-tw.js":2867};function r(e){var t=a(e);return n(t)}function a(e){if(!n.o(o,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return o[e]}r.keys=function(){return Object.keys(o)},r.resolve=a,e.exports=r,r.id=46700},24654:()=>{},22745:()=>{},40475:()=>{},60877:()=>{},51691:()=>{},7994:()=>{},32225:()=>{},97004:()=>{},3906:()=>{},5128:()=>{}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={id:o,loaded:!1,exports:{}};return e[o].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}n.m=e,(()=>{var e=[];n.O=(t,o,r,a)=>{if(!o){var i=1/0;for(u=0;u<e.length;u++){for(var[o,r,a]=e[u],s=!0,l=0;l<o.length;l++)(!1&a||i>=a)&&Object.keys(n.O).every((e=>n.O[e](o[l])))?o.splice(l--,1):(s=!1,a<i&&(i=a));if(s){e.splice(u--,1);var c=r();void 0!==c&&(t=c)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[o,r,a]}})(),n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;n.t=function(o,r){if(1&r&&(o=this(o)),8&r)return o;if("object"===typeof o&&o){if(4&r&&o.__esModule)return o;if(16&r&&"function"===typeof o.then)return o}var a=Object.create(null);n.r(a);var i={};e=e||[null,t({}),t([]),t(t)];for(var s=2&r&&o;"object"==typeof s&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach((e=>i[e]=()=>o[e]));return i.default=()=>o,n.d(a,i),a}})(),n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),n.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={179:0};n.O.j=t=>0===e[t];var t=(t,o)=>{var r,a,[i,s,l]=o,c=0;if(i.some((t=>0!==e[t]))){for(r in s)n.o(s,r)&&(n.m[r]=s[r]);if(l)var u=l(n)}for(t&&t(o);c<i.length;c++)a=i[c],n.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return n.O(u)},o=self.webpackChunkweb=self.webpackChunkweb||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})();var o=n.O(void 0,[895],(()=>n(15530)));o=n.O(o)})();
//# sourceMappingURL=main.9bc2c928.js.map