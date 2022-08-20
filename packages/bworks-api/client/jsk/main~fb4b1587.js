(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{672:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),n=a(0),l=f(n),o=f(a(4)),u=a(28),i=a(38),c=a(23),s=a(22),d=a(88);function f(e){return e&&e.__esModule?e:{default:e}}var p=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,n.Component),r(t,[{key:"getStatusColor",value:function(e,t){return t&&e.status[t]?e.status[t]:e.status.normal}},{key:"render",value:function(){var e=this,t=this.props,a=t.classes,r=t.icon,o=t.iconStyle,u=t.theme,s=t.title,d=t.subTitle,f=t.data,p=Object.keys(f);return l.default.createElement("div",{className:a.root},l.default.createElement(c.Card,null,l.default.createElement(c.CardHeader,{className:a.header,avatar:l.default.createElement(c.Avatar,{className:a.avatar,style:o},r),title:l.default.createElement("b",null,s),subheader:d}),l.default.createElement(c.CardContent,{className:a.content},l.default.createElement(c.List,{dense:!0},p.map(function(t,a){var r=f[t];return l.default.createElement(n.Fragment,{key:t},l.default.createElement(c.ListItem,null,l.default.createElement(c.ListItemText,{primary:l.default.createElement("span",null,r.label)}),l.default.createElement(c.ListItemSecondaryAction,null,"number"==typeof r.value?l.default.createElement(i.NumberField,{source:"value",record:r,style:{color:e.getStatusColor(u,r.status)}}):"...",r.postLabel&&" "+r.postLabel)),a<p.length-1&&l.default.createElement(c.Divider,null))})))))}}]),t}();p.propTypes={icon:o.default.element,iconStyle:o.default.object,classes:o.default.object.isRequired,title:o.default.any,subTitle:o.default.any,data:o.default.object,theme:o.default.object},p.defaultProps={icon:l.default.createElement(d.Assignment,null)};var m=(0,u.compose)((0,s.withStyles)(function(e){return{avatar:{backgroundColor:e.palette.primary.main},header:{margin:0},root:{flexGrow:1},content:{padding:"0px "+e.spacing(1)+"px 0px 0px"}}}),s.withTheme);t.default=m(p)},8299:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=function(e){return e&&e.__esModule?e:{default:e}}(a(8311));t.default={name:"Dashboard",label:"generic.pages.dashboard",icon:r.DashboardIcon,url:"",screens:{main:{component:n.default,exact:!0}},access:{read:[],write:[]}}},8311:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),n=f(a(0)),l=f(a(4)),o=a(28),u=a(38),i=a(23),c=f(a(8312)),s=f(a(8317)),d=f(a(8318));function f(e){return e&&e.__esModule?e:{default:e}}function p(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var m=function(e){function t(){var e,a,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var n=arguments.length,l=Array(n),o=0;o<n;o++)l[o]=arguments[o];return a=r=p(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),r.state={currentStatus:[],baseOnFlowLogger:!1},r.loadStatus=function(){},r.onChangeDisPlay=function(e,t){r.setState({baseOnFlowLogger:t},r.loadStatus)},p(r,a)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,n.default.Component),r(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){this.props.theme;var e=this.state,t=e.currentStatus,a=e.baseOnFlowLogger;return n.default.createElement(u.CustomPage,{title:"generic.pages.dashboard"},n.default.createElement(i.Grid,{container:!0,spacing:2},n.default.createElement(i.Grid,{item:!0,xs:12},n.default.createElement(c.default,null)),n.default.createElement(i.Grid,{item:!0,xs:12,md:9,style:{display:"flex"}},n.default.createElement(s.default,null)),n.default.createElement(i.Grid,{item:!0,xs:12,md:3,style:{display:"flex"}},n.default.createElement(d.default,{currentStatus:t,baseOnFlowLogger:a,onChangeDisPlay:this.onChangeDisPlay}))))}}]),t}();m.propTypes={dataProvider:l.default.func.isRequired,theme:l.default.object};var b=(0,o.compose)(u.withDataProvider,i.withTheme);t.default=b(m)},8312:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),n=a(0),l=m(n),o=m(a(4)),u=a(23),i=a(38),c=a(28),s=m(a(8313)),d=m(a(8314)),f=m(a(8315)),p=m(a(8316));function m(e){return e&&e.__esModule?e:{default:e}}var b=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,n.Component),r(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){this.props.theme;return l.default.createElement(u.Grid,{container:!0,spacing:2},l.default.createElement(u.Grid,{item:!0,sm:6,md:3,xs:12},l.default.createElement(s.default,null)),l.default.createElement(u.Grid,{item:!0,sm:6,md:3,xs:12},l.default.createElement(d.default,null)),l.default.createElement(u.Grid,{item:!0,sm:6,md:3,xs:12},l.default.createElement(p.default,null)),l.default.createElement(u.Grid,{item:!0,sm:6,md:3,xs:12},l.default.createElement(f.default,null)))}}]),t}();b.propTypes={dataProvider:o.default.func,theme:o.default.object};var y=(0,c.compose)(u.withTheme,i.withDataProvider);t.default=y(b)},8313:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),l=a(0),o=p(l),u=p(a(4)),i=a(28),c=a(38),s=p(a(1487)),d=a(129),f=p(a(672));function p(e){return e&&e.__esModule?e:{default:e}}var m=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));a.dashboardData=function(){a.props.dataProvider(c.CUSTOM,"WaterSources",{subUrl:"dashboard",method:"get",query:{mode:"widget"}}).then(function(e){var t=e.data.filter(function(e){return"totalDailyCapacity"==e.id})[0].value,r=e.data.filter(function(e){return"totalMonthlyCapacity"==e.id})[0].value,n=e.data.filter(function(e){return"totalYearlyCapacity"==e.id})[0].value,l=Object.assign({},a.state.data);l.day.value=t,l.month.value=r,l.year.value=n,a.setState(l)})};var r=e.translate;return a.state={title:r("generic.emp.widget.matchedJob"),data:{day:{label:r("generic.emp.widget.today"),value:2,status:"ok"},month:{label:r("generic.emp.widget.thisMonth"),value:8,status:"low"},year:{label:r("generic.emp.widget.thisYear"),value:40,status:"ok"}}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.Component),n(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return o.default.createElement(f.default,r({iconStyle:{backgroundColor:s.default[500]},icon:o.default.createElement(d.QuantityIcon,null)},this.state))}}]),t}();m.propTypes={translate:u.default.func,dataProvider:u.default.any};var b=(0,i.compose)(c.translate,c.withDataProvider);t.default=b(m)},8314:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),l=a(0),o=f(l),u=f(a(4)),i=a(28),c=a(38),s=a(129),d=f(a(672));function f(e){return e&&e.__esModule?e:{default:e}}var p=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));a.dashboardData=function(){a.props.dataProvider(c.CUSTOM,"WaterSources",{subUrl:"dashboard",method:"get",query:{mode:"widget"}}).then(function(e){var t=e.data.filter(function(e){return"totalBackupSource"==e.id})[0].value,r=e.data.filter(function(e){return"totalInOperationSource"==e.id})[0].value,n=e.data.filter(function(e){return"totalInMaintainSource"==e.id})[0].value,l=Object.assign({},a.state.data);l.totalInService.value=r,l.totalInMaintain.value=n,l.totalInBackup.value=t,a.setState(l)})};var r=e.translate;return a.state={title:r("generic.emp.widget.bidJob"),data:{totalInService:{label:r("generic.emp.widget.total"),value:10,status:"critical"},totalInMaintain:{label:r("generic.emp.widget.biddingJob"),value:4,status:"low"},totalInBackup:{label:r("generic.emp.widget.offeredJob"),value:6,status:"ok"}}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.Component),n(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return o.default.createElement(d.default,r({icon:o.default.createElement(s.WaterSourceIcon,null)},this.state))}}]),t}();p.propTypes={translate:u.default.func,dataProvider:u.default.any};var m=(0,i.compose)(c.translate,c.withDataProvider);t.default=m(p)},8315:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),l=a(0),o=p(l),u=p(a(4)),i=a(28),c=a(38),s=p(a(913)),d=a(129),f=p(a(672));function p(e){return e&&e.__esModule?e:{default:e}}var m=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));a.dashboardData=function(){a.props.dataProvider(c.CUSTOM,"WaterSources",{subUrl:"dashboard",method:"get",query:{mode:"widget"}}).then(function(e){var t=e.data.filter(function(e){return"totalFactory"==e.id})[0].value,r=e.data.filter(function(e){return"totalCurrentDailyVolumeFactory"==e.id})[0].value,n=e.data.filter(function(e){return"totalDailyCapacityFactory"==e.id})[0].value,l=Object.assign({},a.state.data);l.count.value=t,l.currentQuantity.value=r,l.designCapacity.value=n,a.setState(l)})};var r=e.translate;return a.state={title:r("generic.emp.widget.fund"),data:{count:{label:r("generic.emp.widget.current"),value:15e4,status:"normal"},currentQuantity:{label:r("generic.emp.widget.withdraw"),value:8e4,status:"normal"},designCapacity:{label:r("generic.emp.widget.deposit"),value:23e4,status:"normal"}}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.Component),n(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return o.default.createElement(f.default,r({iconStyle:{backgroundColor:s.default[500]},icon:o.default.createElement(d.FactoryIcon,null)},this.state))}}]),t}();m.propTypes={translate:u.default.func,dataProvider:u.default.any};var b=(0,i.compose)(c.translate,c.withDataProvider);t.default=b(m)},8316:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),l=a(0),o=p(l),u=p(a(4)),i=a(28),c=a(38),s=a(23),d=a(129),f=p(a(672));function p(e){return e&&e.__esModule?e:{default:e}}var m=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));a.dashboardData=function(){a.props.dataProvider(c.CUSTOM,"WaterSources",{subUrl:"dashboard",method:"get",query:{mode:"widget"}}).then(function(e){var t=e.data.filter(function(e){return"today"==e.id})[0].value,r=e.data.filter(function(e){return"lastMonth"==e.id})[0].value,n=e.data.filter(function(e){return"thisYear"==e.id})[0].value,l=Object.assign({},a.state.data);l.today.value=t,l.lastMonth.value=r,l.thisYear.value=n,a.setState(l)})};var r=e.translate;return a.state={title:r("generic.emp.widget.smartContract"),data:{today:{label:r("generic.emp.widget.total"),value:6,status:"normal"},lastMonth:{label:r("generic.emp.widget.pendingContract"),value:4,status:"normal"},thisYear:{label:r("generic.emp.widget.completedContract"),value:2,status:"normal"}}},a}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.Component),n(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return o.default.createElement(f.default,r({iconStyle:{backgroundColor:this.props.theme.palette.error.main},icon:o.default.createElement(d.ReportVolumeIcon,null)},this.state))}}]),t}();m.propTypes={translate:u.default.func,theme:u.default.object,dataProvider:u.default.any};var b=(0,i.compose)(c.translate,s.withTheme,c.withDataProvider);t.default=b(m)},8317:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return r.createElement(u.default,{component:s.default},r.createElement(n.default,{sx:{minWidth:650},"aria-label":"simple table"},r.createElement(i.default,null,r.createElement(c.default,null,r.createElement(o.default,null,"JOB NAME "),r.createElement(o.default,{align:"right"},"BUDGET (ADA)"),r.createElement(o.default,{align:"right"},"REQUIRED FOR BID (ADA)"),r.createElement(o.default,{align:"right"},"EXPIRED DATE"),r.createElement(o.default,{align:"right"},"CURRENT BIDs"))),r.createElement(l.default,null,m.map(function(e){return r.createElement(c.default,{key:e.name,sx:{"&:last-child td, &:last-child th":{border:0}}},r.createElement(o.default,{component:"th",scope:"row"},e.name),r.createElement(o.default,{align:"right"},e.calories),r.createElement(o.default,{align:"right"},e.fat),r.createElement(o.default,{align:"right"},e.carbs),r.createElement(o.default,{align:"right"},e.protein),r.createElement(o.default,{align:"right"}," ",r.createElement(d.default,{variant:"outlined",color:"success"},"Place bid")," "))}))))};var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(a(0)),n=f(a(549)),l=f(a(551)),o=f(a(268)),u=f(a(673)),i=f(a(550)),c=f(a(427)),s=f(a(128)),d=f(a(92));function f(e){return e&&e.__esModule?e:{default:e}}function p(e,t,a,r,n){return{name:e,calories:t,fat:a,carbs:r,protein:n}}var m=[p("Write Cardano ESROW smart contract",7500,6,"Mar 24 2022",4),p("Create Cardano Native and NFT token",3600,9,"April 02 2022",2),p("Build Cardano testNet node",1500,16,"Mar 13 2022",0),p("Develop android/IOS walllet",15e3,3.7,"Mar 05 2022",10),p("OffChain and onchain functions",11e3,16,"April 05 2022",6),p("Develop utils to query Cardano wallet",8210,6,"Mar 11 2022",1),p("Develop smartphone apps",13e3,9,"Mar 21 2022",2),p("Create tool to manage stake pool",6300,16,"June 24 2022",3),p("Create NFT store on Amazon s3",9400,3.7,"June 07 2022",4.3),p("Develop cross chain function to swap ETH/ADA",18e3,16,"Mar 09 2022",8)]},8318:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),n=a(0),l=p(n),o=a(28),u=p(a(4)),i=a(23),c=a(38),s=a(129),d=p(a(8319)),f=p(a(8320));function p(e){return e&&e.__esModule?e:{default:e}}function m(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var b=function(e){function t(){var e,a,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var n=arguments.length,l=Array(n),o=0;o<n;o++)l[o]=arguments[o];return a=r=m(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),r.getDmaPadding=function(e){return(2*e.level-2)*r.props.theme.spacing(1)},m(r,a)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,n.Component),r(t,[{key:"render",value:function(){var e=this.props,t=e.classes,a=e.theme,r=e.currentStatus,n=e.baseOnFlowLogger,o=e.onChangeDisPlay,u=e.translate;return l.default.createElement(i.Card,{style:{width:"100%"}},l.default.createElement(i.CardHeader,{avatar:l.default.createElement(i.Avatar,{className:t.statusIcon},l.default.createElement(s.StatusIcon,null)),title:u("generic.topMatchingJobs"),subheader:l.default.createElement(i.FormControlLabel,{label:u("generic.yourOffers"),control:l.default.createElement(i.Checkbox,{onChange:o,checked:n})})}),l.default.createElement(i.CardContent,{className:t.dmaItem},l.default.createElement(i.Divider,null),n?l.default.createElement(f.default,{currentStatus:r,classes:t,theme:a,getDmaPadding:this.getDmaPadding}):l.default.createElement(d.default,{currentStatus:r,classes:t,theme:a,getDmaPadding:this.getDmaPadding})))}}]),t}();b.propTypes={dataProvider:u.default.func,theme:u.default.object,classes:u.default.object,currentStatus:u.default.array,baseOnFlowLogger:u.default.bool,onChangeDisPlay:u.default.func,translate:u.default.func};var y=(0,o.compose)((0,i.withStyles)(function(e){return{header:{backgroundColor:e.palette.primary.main,color:e.palette.primary.contrastText+" !important"},subheader:{color:e.palette.grey[400]},nested:{margin:8},chip:{height:"18px"},chipIcon:{backgroundColor:e.palette.grey[300],color:e.palette.primary.main,height:"18px",width:"18px"},left:{float:"left"},statusIcon:{backgroundColor:e.palette.primary.main},iconMeno:{width:24,height:24},dmaItem:{paddingLeft:e.spacing(1),paddingRight:e.spacing(1)}}}),i.withTheme,c.withDataProvider,c.translate);t.default=y(b)},8319:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(0),n=f(r),l=f(a(4)),o=a(28),u=f(a(165)),i=a(23),c=a(38),s=f(a(61)),d=a(129);function f(e){return e&&e.__esModule?e:{default:e}}var p=function(e){switch(e){case 1:return s.default.color.status.criticalAlert;case 2:return s.default.color.status.alert;case 3:return s.default.color.status.normal}},m=function(e){e.currentStatus;var t=e.classes,a=e.translate,l=e.theme,o=e.getDmaPadding;return n.default.createElement(i.List,{component:"div",disablePadding:!0},[{jobName:"Write Cardano ESROW smart contract",employer:"Employer name/wallet address: Peter",bidValue:"Bid at value (ADA): 120"},{jobName:"Create Cardano Native and NFT token",employer:"Employer name/wallet address: addr_test1qrtzr4zdlc3kw7mv4mtg2v3f3q592za2psnpmvsm4x9t0t43ge73vmf7xvkn23tkyq30gd2jtlgztf3rw0mtvkjzv4vqcv0ejv",bidValue:"Bid value (ADA): 120"},{jobName:"Build Cardano testNet node",employer:"Employer name/wallet address: Jenny",bidValue:"Bid at value (ADA): 120"},{jobName:"Develop android/IOS walllet",employer:"Employer name/wallet address: Jackson",bidValue:"Bid at value (ADA): 120"}].map(function(e){return n.default.createElement(r.Fragment,{key:e.jobName},n.default.createElement(i.ListItem,{button:!0,style:{paddingLeft:o({level:1})},key:e.jobName},n.default.createElement(i.ListItemIcon,null,n.default.createElement(d.WaterSourceIcon,null)),n.default.createElement(i.ListItemText,{style:{paddingLeft:l.spacing(1)},primary:n.default.createElement("b",null,e.jobName)}),n.default.createElement(i.ListItemSecondaryAction,null,n.default.createElement(i.Tooltip,{title:a("generic.emp.widget.bidDate")},n.default.createElement(i.Chip,{avatar:0==e.totalAlert?n.default.createElement(i.Avatar,{className:t.chipIcon},n.default.createElement(d.NormalWaterSourceIcon,{style:{color:p(3)}})):n.default.createElement(i.Avatar,{className:t.chipIcon},n.default.createElement(d.AlertWaterSourceIcon,{style:{color:p(2)}})),className:t.chip,label:e.totalAlert})))),n.default.createElement(i.Divider,{style:{marginLeft:o({level:2})+l.spacing(1)}}),n.default.createElement(i.ListItem,{button:!0,onClick:function(){return(void 0).showStatistic(e.jobName)},className:t.nested,style:{paddingLeft:o({level:2})+l.spacing(1)},key:e.logTime},n.default.createElement(i.ListItemSecondaryAction,null,n.default.createElement(r.Fragment,{key:e.jobName},n.default.createElement(i.Tooltip,{title:a("generic.emp.widget.bidDate")},n.default.createElement(i.Chip,{avatar:n.default.createElement(i.Avatar,{className:t.chipIcon},n.default.createElement(d.LogTimeIcon,null)),className:t.chip,label:(0,u.default)().format("YYYY-MM-DD HH:mm"),style:{color:p(e.alert)}}))))),n.default.createElement(i.ListItem,{button:!0,onClick:function(){return(void 0).showStatistic(e.jobName)},className:t.nested,style:{paddingLeft:o({level:2})+l.spacing(1)},key:e.jobName},n.default.createElement(i.ListItemSecondaryAction,null,n.default.createElement(r.Fragment,{key:e.jobName},n.default.createElement(i.Tooltip,{title:a("generic.emp.widget.employer")},n.default.createElement(i.Chip,{className:t.chip,label:e.employer,style:{color:p(e.alert)}}))))),n.default.createElement(i.ListItem,{button:!0,onClick:function(){return(void 0).showStatistic(e.jobName)},className:t.nested,style:{paddingLeft:o({level:2})+l.spacing(1)},key:e.avgNtu},n.default.createElement(i.ListItemSecondaryAction,null,n.default.createElement(r.Fragment,{key:e.jobName},n.default.createElement(i.Tooltip,{title:a("generic.emp.widget.bidValue")},n.default.createElement(i.Chip,{className:t.chip,label:e.bidValue,style:{color:p(e.alert)}}))))))}))};m.propTypes={getDmaPadding:l.default.func,currentStatus:l.default.array,classes:l.default.object,theme:l.default.object,translate:l.default.func};var b=(0,o.compose)(c.translate);t.default=b(m)},8320:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),n=a(0),l=b(n),o=b(a(4)),u=a(23),i=b(a(165)),c=a(38),s=a(28),d=a(36),f=a(229),p=a(129),m=b(a(61));function b(e){return e&&e.__esModule?e:{default:e}}function y(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var g=function(e){function t(){var e,a,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var n=arguments.length,l=Array(n),o=0;o<n;o++)l[o]=arguments[o];return a=r=y(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),r.showStatistic=function(e){},y(r,a)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,n.Component),r(t,[{key:"translateColor",value:function(e){switch(e){case 1:return m.default.color.status.criticalAlert;case 2:return m.default.color.status.alert;case 3:return m.default.color.status.normal}}},{key:"render",value:function(){var e=this,t=this.props,a=t.currentStatus,r=t.classes,o=t.theme,c=t.getDmaPadding,s=t.translate;return console.log(a),l.default.createElement(u.List,{component:"div",disablePadding:!0},a.map(function(t,d){return l.default.createElement(n.Fragment,{key:t.waterSourceName},l.default.createElement(u.ListItem,{button:!0,style:{paddingLeft:c({level:1})},key:t.waterSourceName},l.default.createElement(u.ListItemIcon,null,l.default.createElement(p.WaterSourceIcon,null)),l.default.createElement(u.ListItemText,{style:{paddingLeft:o.spacing(1)},primary:l.default.createElement("b",null,t.waterSourceName)}),l.default.createElement(u.ListItemSecondaryAction,null,l.default.createElement(u.Tooltip,{title:s("generic.totalDataLogger")},l.default.createElement(u.Chip,{avatar:l.default.createElement(u.Avatar,{className:r.chipIcon},l.default.createElement(p.FlowLoggerIcon,null)),className:r.chip,label:Array.isArray(t.dataLoggers)?t.dataLoggers.length:""})))),Array.isArray(t.dataLoggers)&&t.dataLoggers.length>0&&l.default.createElement(u.List,{component:"div",disablePadding:!0},t.dataLoggers.map(function(t){return l.default.createElement(n.Fragment,{key:t._id},l.default.createElement(u.Divider,{style:{marginLeft:c({level:2})+o.spacing(1)}}),l.default.createElement(u.ListItem,{button:!0,onClick:function(){return e.showStatistic(t._id)},className:r.nested,style:{paddingLeft:c({level:2})+o.spacing(1)},key:t._id},l.default.createElement(u.ListItemText,{component:"div",style:{paddingLeft:o.spacing(1)},primary:t.dataLoggerName||s("generic.noNaming")}),l.default.createElement(u.ListItemSecondaryAction,null,t.logTime?l.default.createElement(n.Fragment,null,l.default.createElement(u.Tooltip,{title:s("generic.lastSignal")},l.default.createElement(u.Chip,{avatar:l.default.createElement(u.Avatar,{className:r.chipIcon},l.default.createElement(p.LogTimeIcon,null)),className:r.chip,label:(0,i.default)(t.logTime).format("YYYY-MM-DD HH:mm"),style:{color:e.translateColor(t.alert)}}))):l.default.createElement(u.Tooltip,{title:s("generic.lastSignal")},l.default.createElement(u.Chip,{avatar:l.default.createElement(u.Avatar,{className:r.chipIcon},l.default.createElement(p.LogTimeIcon,null)),className:r.chip,style:{color:o.status.critical},label:s("generic.noLogData")})))),l.default.createElement(u.ListItem,{button:!0,onClick:function(){return e.showStatistic(t._id)},className:r.nested,style:{paddingLeft:c({level:2})+o.spacing(1)},key:t._id},l.default.createElement(u.ListItemSecondaryAction,null,t.ntu?l.default.createElement(n.Fragment,null,l.default.createElement(u.Tooltip,{title:s("generic.turbidity")},l.default.createElement(u.Chip,{className:r.chip,label:s("generic.turbidity")+": "+t.ntu,style:{color:e.translateColor(t.alert)}}))):l.default.createElement(u.Tooltip,{title:s("generic.turbidity")},l.default.createElement(u.Chip,{className:r.chip,style:{color:o.status.critical},label:s("generic.noLogData")})))),l.default.createElement(u.ListItem,{button:!0,onClick:function(){return e.showStatistic(t._id)},className:r.nested,style:{paddingLeft:c({level:2})+o.spacing(1)},key:t._id},l.default.createElement(u.ListItemSecondaryAction,null,t.ph?l.default.createElement(n.Fragment,null,l.default.createElement(u.Tooltip,{title:s("generic.ph")},l.default.createElement(u.Chip,{className:r.chip,label:s("generic.ph")+": "+t.ph,style:{color:e.translateColor(t.alert)}}))):l.default.createElement(u.Tooltip,{title:s("generic.ph")},l.default.createElement(u.Chip,{className:r.chip,style:{color:o.status.critical},label:s("generic.noLogData")})))),l.default.createElement(u.ListItem,{button:!0,onClick:function(){return e.showStatistic(t._id)},className:r.nested,style:{paddingLeft:c({level:2})+o.spacing(1)},key:t._id},l.default.createElement(u.ListItemSecondaryAction,null,t.flowRate?l.default.createElement(n.Fragment,null,l.default.createElement(u.Tooltip,{title:s("generic.flowRate")},l.default.createElement(u.Chip,{className:r.chip,label:s("generic.flowRate")+": "+t.flowRate,style:{color:e.translateColor(t.alert)}}))):l.default.createElement(u.Tooltip,{title:s("generic.flowRate")},l.default.createElement(u.Chip,{className:r.chip,style:{color:o.status.critical},label:s("generic.noLogData")})))))})),d<Array.isArray(a)&&a.length-1&&l.default.createElement(u.Divider,{style:{marginLeft:c({level:1})}}))}))}}]),t}();g.propTypes={translate:o.default.func,getDmaPadding:o.default.func,currentStatus:o.default.array,classes:o.default.object,theme:o.default.object,push:o.default.func};var h=(0,s.compose)(c.translate,(0,d.connect)(null,{push:f.push}));t.default=h(g)},8321:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=i(a(8322)),l=i(a(8323)),o=i(a(8324)),u=i(a(8325));function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"reportFund",label:"generic.pages.reportFund",icon:r.RevenueIcon,url:"reportFund",screens:{list:n.default,create:l.default,edit:o.default,show:u.default},resources:["jsreportfunds"],active:!0,access:{read:[],write:[]}}},8326:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=i(a(8327)),l=i(a(8328)),o=i(a(8329)),u=i(a(8330));function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"reportPostedJob",label:"generic.pages.reportBidJobs",icon:r.reportPostedJobIcon,url:"reportPostedJob",screens:{list:n.default,create:l.default,edit:o.default,show:u.default},resources:["postjobs"],active:!0,access:{read:[],write:[]}}},8331:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=i(a(8332)),l=i(a(8333)),o=i(a(8334)),u=i(a(8335));function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"reportSmartContract",label:"generic.pages.reportSmartContract",icon:r.InvoiceLockIcon,url:"reportSmartContract",screens:{list:n.default,create:l.default,edit:o.default,show:u.default},resources:["postjobs"],active:!0,access:{read:[],write:[]}}},8336:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=u(a(8337)),l=u(a(8338)),o=u(a(8339));function u(e){return e&&e.__esModule?e:{default:e}}t.default={name:"Setting",label:"generic.pages.configuration",icon:r.ConfigurationIcon,url:"setting",screens:{list:n.default,create:l.default,edit:o.default},resources:["settings"],active:!0,access:{read:[],write:[]}}},8340:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=i(a(8341)),l=i(a(8342)),o=i(a(8343)),u=i(a(8344));function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"deposit",label:"generic.pages.deposit",icon:r.RevenueIcon,url:"deposit",screens:{list:n.default,create:l.default,edit:o.default,show:u.default},resources:["jsdeposits"],active:!0,access:{read:[],write:[]}}},8345:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=i(a(8346)),l=i(a(8347)),o=i(a(8348)),u=i(a(8349));function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"withdraw",label:"generic.pages.withdraw",icon:r.FormulaIcon,url:"withdraw",screens:{list:n.default,create:l.default,edit:o.default,show:u.default},resources:["jswithdraws"],active:!0,access:{read:[],write:[]}}},8350:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=i(a(8351)),l=i(a(8352)),o=i(a(8353)),u=i(a(8354));function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"PostJob",label:"generic.pages.matchedJob",icon:r.MatDetailTypeIcon,url:"postjob",screens:{list:n.default,create:l.default,edit:o.default,show:u.default},resources:["tests"],active:!0,access:{read:[],write:[]}}},8355:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=i(a(8356)),l=i(a(8357)),o=i(a(8358)),u=i(a(8359));function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"bidjobs",label:"generic.pages.bidjobs",icon:r.StatusIcon,url:"bidjobs",screens:{list:n.default,create:l.default,edit:o.default,show:u.default},resources:["tests"],active:!0,access:{read:[],write:[]}}},8360:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=i(a(8361)),l=i(a(8362)),o=i(a(8363)),u=i(a(8364));function i(e){return e&&e.__esModule?e:{default:e}}t.default={name:"contractedjobs",label:"generic.pages.contractedjobs",icon:r.InvoiceLockIcon,url:"contractedjobs",screens:{list:n.default,create:l.default,edit:o.default,show:u.default},resources:["tests"],active:!0,access:{read:[],write:[]}}},8365:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(129),n=function(e){return e&&e.__esModule?e:{default:e}}(a(8366));t.default={name:"ChangePassword",label:"generic.pages.changePassword",icon:r.SourceTemplateIcon,url:"changepassword",screens:{main:n.default},resources:["changepasswords"],active:!0,access:{read:[],write:[]}}}}]);