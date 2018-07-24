(function(e){function t(t){for(var a,o,s=t[0],l=t[1],c=t[2],d=0,p=[];d<s.length;d++)o=s[d],i[o]&&p.push(i[o][0]),i[o]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);u&&u(t);while(p.length)p.shift()();return r.push.apply(r,c||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],a=!0,s=1;s<n.length;s++){var l=n[s];0!==i[l]&&(a=!1)}a&&(r.splice(t--,1),e=o(o.s=n[0]))}return e}var a={},i={0:0},r=[];function o(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=a,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(n,a,function(t){return e[t]}.bind(null,a));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var c=0;c<s.length;c++)t(s[c]);var u=l;r.push([0,1]),n()})({0:function(e,t,n){e.exports=n("zUnb")},"A0++":function(e,t,n){"use strict";var a=n("BPUQ"),i=n.n(a);i.a},BPUQ:function(e,t,n){},It4N:function(e,t,n){"use strict";var a=n("wuti"),i=n.n(a);i.a},wuti:function(e,t,n){},zUnb:function(e,t,n){"use strict";n.r(t);n("yt8O"),n("VRzm");var a=n("Kw5r"),i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{staticStyle:{position:"fixed",left:"0px",top:"0px","z-index":"-1000"}},[n("transition",{attrs:{name:"fade-canvas"}},[n("canvas",{class:{focused:!e.textVisible},attrs:{id:"canvas",width:"800",height:"600"}})])],1),n("small",{staticClass:"fadein",staticStyle:{position:"fixed",right:"40px",top:"20px"}},[n("button",{attrs:{id:"hide-button"},on:{click:function(t){e.hideContent()}}},[e._v("Click here to hide/show the text")])]),n("transition",{attrs:{name:"fade"}},[n("router-view",{directives:[{name:"show",rawName:"v-show",value:e.textVisible,expression:"textVisible"}]})],1)],1)},r=[],o=n("xmWZ"),s=n("3Aqn"),l=n("qpph"),c=n("0yhX"),u=n("EdlT"),d=n("mrSG"),p=n("YKMj"),m=function(e,t){var n=function n(){e()||setTimeout(n,1e3*t)};n()},h=function(e){function t(){var e;return Object(o["a"])(this,t),e=Object(c["a"])(this,Object(u["a"])(t).apply(this,arguments)),e.textVisible=!1,e}return Object(l["a"])(t,[{key:"created",value:function(){m(function(){var e=window.TriangleOptions;return!!e&&(e.interactivity=!1,!0)},.5)}},{key:"mounted",value:function(){this.textVisible=!0}},{key:"hideContent",value:function(){this.textVisible=!this.textVisible}}]),Object(s["a"])(t,e),t}(p["b"]);h=d["a"]([Object(p["a"])({})],h);var f,v,g,b,y,_,w=h,k=w,x=(n("A0++"),n("KHd+")),j=Object(x["a"])(k,i,r,!1,null,null,null),S=j.exports,C=n("jE9Z"),O=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"about"},[n("h2",[e._v("Contact")]),n("p",[e._v("You may contact me either by navigating to "),n("a",{attrs:{href:"https://www.linkedin.com/in/sergey-g/",target:"_blank"}},[e._v("my LinkedIn page")]),e._v(" or by "),n("a",{attrs:{href:e.generateMailLink()}},[e._v("sending me an email")]),e._v(".")]),n("br"),n("h2",[e._v("About Me")]),n("p",[e._v("I am a problem solver who takes big complex tasks and breaks them down into small executable pieces. Whether working with other engineers or taking the task on myself, I get things done in a maintainable and efficient way. I clarify project specifications by noticing ambiguities and asking the right questions to resolve them.")]),n("p",[e._v("In my "),n("span",[e._v(e._s(e.computeExperience()))]),e._v(" of experience, I have worked everywhere in the stack. I am as comfortable writing backend C as I am writing frontend JavaScript and laying out HTML. I pride myself in being a quick learner and enjoy working in new fields, languages, and frameworks.\n  ")]),n("p",[e._v("Especially interested in compilers, parsers, programming languages, artificial intelligence, game development, computer graphics, audio generation and processing, visualization, and computational geometry.")]),n("br"),n("h2",[e._v("Technical Skills")]),e._m(0)])},A=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("table",{staticClass:"table"},[n("thead",[n("tr",[n("th",{staticStyle:{width:"25%"}},[e._v("Category")]),n("th",[e._v("Skills (sorted by approximate proficiency in descending order)")])])]),n("tbody",[n("tr",[n("td",[e._v("Programming Languages")]),n("td",[e._v("Python, JavaScript, Java, SQL, TypeScript, Haxe, C/C++/C++14, Perl, Scheme, Ruby")])]),n("tr",[n("td",[e._v("Operating Systems")]),n("td",[e._v("OS X, Linux (Ubuntu, Gentoo, Red Hat), Windows")])]),n("tr",[n("td",[e._v("Databases")]),n("td",[e._v("PostgreSQL, MySQL, BigTable")])]),n("tr",[n("td",[e._v("Frameworks and Tools")]),n("td",[e._v("Angular 1 & 2, AWS, Bazel, Django, Flask, jQuery, Google Closure, GWT, Hibernate, HTML5 Canvas, Node.js, OpenGL, SQLAlchemy, SVG, Three.js")])]),n("tr",[n("td",[e._v("Source Control")]),n("td",[e._v("Git/GitHub, Subversion, Perforce")])])])])}];n("rE2o"),n("ioFf"),n("rGqo"),n("SRfc");function M(e){return e}(function(e){e.January="January",e.February="February",e.March="March",e.April="April",e.May="May",e.June="June",e.July="July",e.August="August",e.September="September",e.October="October",e.November="November",e.December="December",e.Months=[e.January,e.February,e.March,e.April,e.May,e.June,e.July,e.August,e.September,e.October,e.November,e.December]})(f||(f={})),function(e){function t(e,t){if(null==e)return new Date;var n=f.Months.indexOf(e.month);return new Date(e.year,n+(t?1:0),1)}e.toDate=t}(v||(v={})),function(e){function t(e,t){var n=!0,a=!1,i=void 0;try{for(var r,o=t[Symbol.iterator]();!(n=(r=o.next()).done);n=!0){var s=r.value;if("exact"===s.type){if(s.match===e)return s.format(e)}else if("between"===s.type){if(s.start<=e&&e<s.end)return s.format(e)}else if("else"===s.type)return s.format(e)}}catch(e){a=!0,i=e}finally{try{n||null==o.return||o.return()}finally{if(a)throw i}}throw"Incomplete ruleset"}(function(e){function t(e,t,n){return{type:"between",start:e,end:t,format:n}}function n(e,t){return{type:"exact",match:e,format:t}}function a(e){return{type:"else",format:e}}e.between=t,e.exact=n,e.otherwise=a})(e.Rule||(e.Rule={})),e.localize=t}(g||(g={})),function(e){var t={english:[g.Rule.exact(1,function(e){return[String(e),"year"].join(" ")}),g.Rule.otherwise(function(e){return[String(e),"years"].join(" ")})],russian:[g.Rule.exact(1,function(e){return[String(e),"год"].join(" ")}),g.Rule.between(1,5,function(e){return[String(e),"года"].join(" ")}),g.Rule.otherwise(function(e){return[String(e),"лет"].join(" ")})]},n={english:[g.Rule.exact(1,function(e){return[String(e),"month"].join(" ")}),g.Rule.otherwise(function(e){return[String(e),"months"].join(" ")})],russian:[g.Rule.exact(1,function(e){return[String(e),"месяц"].join(" ")}),g.Rule.between(1,5,function(e){return[String(e),"месяца"].join(" ")}),g.Rule.otherwise(function(e){return[String(e),"месяцев"].join(" ")})]};function a(e,t){return g.localize(e,n[t])}function i(e,n){return g.localize(e,t[n])}e.months=a,e.years=i}(b||(b={})),function(e){function t(e,t,n){var a=n||"english";return"years"===t?b.years(e,a):"months"===t?b.months(e,a):M(t)}e.localize=t}(y||(y={})),function(e){function t(e,t){if(null==e)return new Date;var n=f.Months.indexOf(e.month);return new Date(e.year,n+(t?1:0),1)}function n(e,n){var a=t(n,!0),i=t(e),r=0;while(a.getFullYear()>i.getFullYear()||a.getMonth()>i.getMonth())a.setMonth(a.getMonth()-1),r++;return r}function a(e,t){return n(e,t)/12}function i(e,t){var a=n(e,t),i=a%12,r=(a-i)/12,o=[];return r>0&&o.push(y.localize(r,"years")),i>0&&o.push(y.localize(i,"months")),o.join(" ")}e.dateFromComponents=t,e.monthsDuration=n,e.yearsDuration=a,e.durationString=i}(_||(_={}));var J;n("Vd3H");(function(e){e.Internship="internship",e.Coop="co-op",e.FullTime="fulltime"})(J||(J={}));var P={hidden:!0,type:J.FullTime,company:"Hopper",title:"Senior Software Engineer",location:"Cambridge, MA",start:{month:"May",year:2017,day:8},end:null,languages:["Swift","Objective-C","Scala"],skills:["Jenkins","AngularJS","Angular","AWS"],achievements:[]},G={type:J.FullTime,company:"Shotput",title:"VP of Engineering",location:"San Francisco, CA (remote)",start:{month:"April",year:2016},end:{month:"March",year:2017},languages:["JavaScript","Python"],skills:["AWS","SQLAlchemy","Flask","AngularJS","npm","Jenkins"],achievements:["Defined and set priorities for the sales and operations team based on the tech roadmap.","Scaled the logistics system to a peak of almost 3,000 orders a day.","Set example of code style and testing as a culture, raising code coverage from 0% to 74%.","Set up a Jenkins integration server to ensure all tests pass before merging into master.","Created a repository for test data to minimize boilerplate setup code and later optimized it to create the data lazily, bringing the total runtime of the test suite from 13 minutes to 3.5.","Specced and implemented a secure and robust webhook notification infrastructure.","Designed and implemented an automated, self-correcting inventory management system to track inventory throughout the logistics pipeline.","Architected, designed and implemented a user permissions system on top of an existing complex architecture to allow fine-grained control over what users can do."]},T={type:J.FullTime,company:"Google",title:"Software Engineer",location:"Cambridge, MA",start:{month:"June",year:2011},end:{month:"April",year:2016},languages:["Java","JavaScript",["C","C++","C++14"],"Python"],skills:["Google Closure","Bazel","Guice","FlumeJava","GWT","SVG","OpenGL","HTML5 Canvas"],achievements:["Cowrote a patent application for efficient proximity detection.","Wrote an efficient implementation of the Bentley-Ottmann line-set intersection algorithm, while dealing with floating point precision issues.","Revised variable-width drawing algorithm for Drawings in Google Keep that reduced bugs, visual artifacts and overall improved appearance of rendered strokes.","Communicated regularly with internal and external users of Google Charts via Google Groups and later GitHub Issues, helping them with bugs, workarounds, and implementations.","Architected, designed and implemented a graph-based data pipeline framework using GWT that would run in browsers, iOS, Android, and desktop Java that supports asynchronous execution across all platforms.","Owned and managed the MapReduce map data processing pipeline, and rewrote it in FlumeJava which resulted better-tested, more maintainable, and more efficient pipeline.","Owned and developed many features of the Google Charts GeoChart, such as text markers, map projections, and many bug fixes.","Helped launch Google+ Web Badges.","Developed and maintained a new generation of Google Charts, including a new column chart, scatter chart, and line chart.","Developed critical features in existing Google Charts, like trendlines, better interactivity and customization features, as well as low-level rendering features and fixed an uncountable number of bugs.","Refactored the +1 button into reusable widget components."]},E={type:J.Coop,company:"Amazon.com",title:"Software Development Co-op",location:"Seattle, WA",start:{month:"January",year:2009},end:{month:"June",year:2009},languages:["Java","JavaScript","Perl"],skills:["Hibernate","Mechanical Turk"],achievements:["Organized and developed a project to improve product classification using Amazon’s Mechanical Turk in Java using Hibernate.","Organized and developed a project to help the sales team with locating websites to contact using the Mechanical Turk in Java.","Streamlined the registration pipeline for Product Ads in Perl Mason."]},I={type:J.FullTime,company:"AmpIdea",title:"Co-Founder",location:"Boston, MA",start:{month:"September",year:2007},end:{month:"June",year:2009},languages:["Python"],skills:["PyGame"],achievements:["Architected and implemented a general widget system in Python for touchscreen-based devices, complete with momentum scrolling, transitions and animations to mimic the then-new iPhone interface, which included managing text rendering and touched upon line breaking and typesetting.","Used our custom built widget system to create a smooth and beautiful interface for a touchscreen-based device meant to display relevant information in the back of a taxicab.","Designed and developed a module to interface with various outdated taximeters in Python, which required using serial ports and understanding the protocols they used."]},R={type:J.Coop,company:"EMC",title:"Software Development Co-op",location:"Southborough, MA",start:{month:"January",year:2008},end:{month:"June",year:2008},languages:["Java","C","Perl"],skills:[],achievements:["Wrote a Java application to parse a single text help file and produce and view a searchable and organized data set.","Fixed bugs in the driver for large server racks in a monolithic C codebase.","Tested the performance of large collections of fast 15,000 RPM fiberoptic hard drives.","Wrote Perl scripts to help with development and consolidate testing data."]},D={type:J.Internship,company:"Rue La La",title:"Software Development Intern",location:"Boston, MA",start:{month:"June",year:2010},end:{month:"August",year:2010},languages:["JavaScript","Java"],skills:["jQuery","SmartGWT"],achievements:["Fixed a number of bugs and added features to an internal tool written in GWT.","Ported a number of features on the website from the Prototype javascript framework to jQuery."]},z=[P,G,T,E,I,R,D];z.sort(function(e,t){return null==e.end?-1:null==t.end?1:e.end.year>t.end.year?-1:e.end.year<t.end.year?1:0});var F=function(e){function t(){return Object(o["a"])(this,t),Object(c["a"])(this,Object(u["a"])(t).apply(this,arguments))}return Object(l["a"])(t,[{key:"generateMailLink",value:function(){var e="contact",t="sergey",n="g",a="mail";return[a,"to:",e,"@",t,n,".com"].join("")}},{key:"computeExperience",value:function(){var e=z.filter(function(e){return e.type===J.FullTime}),t=0,n=!0,a=!1,i=void 0;try{for(var r,o=e[Symbol.iterator]();!(n=(r=o.next()).done);n=!0){var s=r.value;t+=_.yearsDuration(s.start,s.end)}}catch(e){a=!0,i=e}finally{try{n||null==o.return||o.return()}finally{if(a)throw i}}var l=Math.floor(t),c=t%1;return c>=.85?["almost",l+1,"years"].join(" "):.4<c&&c<.85?[l+.5,"years"].join(" "):[l,"years"].join(" ")}}]),Object(s["a"])(t,e),t}(p["b"]);F=d["a"]([Object(p["a"])({})],F);var L,H=F,W=H,$=Object(x["a"])(W,O,A,!1,null,null,null),N=$.exports,V=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"main-content"},[n("Header"),n("Navigation"),n("transition",{attrs:{name:e.transitionName}},[n("router-view",{staticClass:"content child-view"})],1)],1)},B=[],Q=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},U=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"page-header"},[n("h1",[e._v("\n      "),n("img",{staticClass:"img-circle",attrs:{src:"img/photo.jpg",width:"64px",height:"64px"}}),e._v("\n     Sergey Grabkovsky\n  ")])])}],q={},K=Object(x["a"])(q,Q,U,!1,null,null,null),Y=K.exports,X=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("nav",[n("ul",{staticClass:"nav nav-pills nav-stacked"},[e._l(e.routes,function(t){return n("router-link",{attrs:{tag:"li",role:"presentation",to:t.url,"active-class":"active"}},[n("a",[e._v(e._s(t.text))])])}),e._m(0),e._m(1),e._m(2)],2),n("br"),e._m(3),n("p",{staticClass:"text-muted"},[e._v("© Sergey Grabkovsky 2017")])])},Z=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("li",{attrs:{role:"presentation"}},[n("a",{attrs:{href:"files/sergey-grabkovsky-resume.pdf",target:"_blank"}},[e._v("\n      Resume  "),n("i",{staticClass:"glyphicon glyphicon-new-window"})])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("li",{attrs:{role:"presentation"}},[n("a",{attrs:{href:"https://www.linkedin.com/in/sergey-g/",target:"_blank"}},[e._v("\n      LinkedIn  "),n("i",{staticClass:"glyphicon glyphicon-new-window"})])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("li",{attrs:{role:"presentation"}},[n("a",{attrs:{href:"https://github.com/blindmonkey",target:"_blank"}},[e._v("\n      GitHub  "),n("i",{staticClass:"glyphicon glyphicon-new-window"})])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("p",{staticClass:"text-muted"},[e._v("This web site was built with love using "),n("a",{attrs:{href:"https://vuejs.org/"}},[e._v("Vue.js")]),e._v(" and "),n("a",{attrs:{href:"http://getbootstrap.com/"}},[e._v("Bootstrap")]),e._v(".")])}],ee=L=function(e){function t(){var e;return Object(o["a"])(this,t),e=Object(c["a"])(this,Object(u["a"])(t).apply(this,arguments)),e.routes=L.Routes,e}return Object(s["a"])(t,e),t}(p["b"]);ee.Routes=[{url:"/about",text:"About Me"},{url:"/experience",text:"Experience & Education"},{url:"/projects",text:"Projects"}],ee=L=d["a"]([Object(p["a"])({})],ee);var te=ee,ne=te,ae=Object(x["a"])(ne,X,Z,!1,null,null,null),ie=ae.exports;p["a"].registerHooks(["beforeRouteUpdate"]);var re=function(e){function t(){var e;return Object(o["a"])(this,t),e=Object(c["a"])(this,Object(u["a"])(t).apply(this,arguments)),e.transitionName="slide-left",e}return Object(l["a"])(t,[{key:"beforeRouteUpdate",value:function(e,t,n){var a=ie.Routes.map(function(e){return e.url}),i=a.indexOf(t.path),r=a.indexOf(e.path);this.transitionName=i<r?"slide-down":"slide-up",n()}}]),Object(s["a"])(t,e),t}(p["b"]);re=d["a"]([Object(p["a"])({components:{Navigation:ie,Header:Y}})],re);var oe=re,se=oe,le=(n("It4N"),Object(x["a"])(se,V,B,!1,null,null,null)),ce=le.exports,ue=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h2",[e._v("Work Experience")]),e._l(e.filteredJobs,function(t){return n("div",[n("div",{staticClass:"experience-item"},[n("div",{staticClass:"inline"},[n("div",[n("span",{staticClass:"company"},[e._v(e._s(t.company))]),e._v(",\n          "),n("span",{staticClass:"title"},[e._v(e._s(t.title))])]),n("div",[n("span",{staticClass:"location"},[e._v(e._s(t.location))])])]),n("span",{staticClass:"pull-right"},[n("div",[n("span",[e._v(e._s(t.start.month))]),n("span",[e._v(" ")]),n("span",[e._v(e._s(t.start.year))]),e._v("\n          –\n          "),t.end?e._e():n("span",[e._v("Present")]),t.end?n("span",[n("span",[e._v(e._s(t.end.month))]),n("span",[e._v(" ")]),n("span",[e._v(e._s(t.end.year))])]):e._e()]),n("div",{staticStyle:{"text-align":"right"}},[n("small",{staticClass:"text-muted"},[n("span",[e._v(e._s(e.computeDurationWorked(t)))])])])]),n("div",[e._l(t.languages,function(t){return n("span",[n("span",{staticClass:"label label-primary"},[e._v(e._s(e.formatLanguage(t)))]),n("span",[e._v(" ")])])}),e._l(t.skills,function(t){return n("span",[n("span",{staticClass:"label label-success"},[e._v(e._s(t))]),n("span",[e._v(" ")])])})],2),n("ul",e._l(t.achievements,function(t){return n("li",[e._v(e._s(t))])}))])])}),n("br"),n("h2",[e._v("Education")]),e._m(0)],2)},de=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"experience-item"},[n("div",{staticClass:"inline"},[n("div",[n("span",{staticClass:"bold"},[e._v("Northeastern University")]),e._v(", Boston, MA")]),n("div",{staticClass:"italic"},[e._v("College of Computer and Information Science")])]),n("div",{staticClass:"inline pull-right"},[n("div",{staticClass:"text-right"},[e._v("Graduated May 2011")]),n("div",{staticClass:"text-right"},[e._v("Dean’s List")])]),n("div",[e._v("Bachelor of Science in Computer Science, Cum Laude")]),n("div",[e._v("Master of Science in Computer Science")]),n("div",{staticClass:"indented"},[e._v("\n      Relevant courses: Fundamentals of Computer Science, Discrete Structures, Symbolic Logic, Theory of Computation, Computer Organization, Systems and Networks, Object-Oriented Design, Advanced Writing for Technical Professions, Algorithms (Graduate), Programming Languages (Graduate), Machine Learning (Graduate)\n    ")])])}],pe=function(e){function t(){var e;return Object(o["a"])(this,t),e=Object(c["a"])(this,Object(u["a"])(t).apply(this,arguments)),e.data="test",e}return Object(l["a"])(t,[{key:"computeDurationWorked",value:function(e){return _.durationString(e.start,e.end)}},{key:"formatLanguage",value:function(e){return"string"===typeof e?e:e.join("/")}},{key:"filteredJobs",get:function(){return z.filter(function(e){return!e.hidden})}}]),Object(s["a"])(t,e),t}(p["b"]);pe=d["a"]([Object(p["a"])({})],pe);var me=pe,he=me,fe=Object(x["a"])(he,ue,de,!1,null,null,null),ve=fe.exports,ge=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h2",[e._v("Projects")]),n("p",[e._v("Here you can find a list of projects I've done, either professionally or simply for myself. A lot of these projects were prototypes and proof of concepts. At this time, I either no longer have or am unable to share the source code for some of them.")]),e._l(e.projects,function(t){return n("div",[n("div",{staticClass:"page-header"},[n("h3",[n("span",[e._v(e._s(t.title))]),n("span",[e._v(" ")]),n("span",{staticClass:"label label-primary"},[e._v(e._s(t.language))])])]),e._l(t.description,function(t){return n("div",[n("p",[e._v(e._s(t))])])}),t.source?n("div",{staticClass:"text-muted"},[e._v("\n      Source:\n      "),null==t.source.link?n("span",[n("span",[e._v(e._s(t.source.title))])]):e._e(),null!=t.source.link?n("span",[n("a",{attrs:{href:t.source.link,target:"_blank"}},[e._v(e._s(t.source.title))])]):e._e()]):e._e(),t.demo?n("div",{staticClass:"text-muted"},[e._v("\n      Demo:\n      "),null==t.demo.link?n("span",[n("span",[e._v(e._s(t.demo.title))])]):e._e(),null!=t.demo.link?n("span",[n("a",{attrs:{href:t.demo.link,target:"_blank"}},[e._v(e._s(t.demo.title))])]):e._e()]):e._e()],2)})],2)},be=[],ye=[{language:"TypeScript",title:"Triangle Visualization",description:["A small visualization I built for fun. It can be seen running in the background of this website. Please be warned that it requires some patience."],source:{title:"view on GitHub",link:"https://github.com/blindmonkey/blindmonkey.github.io/tree/master/triangles"},demo:{title:"view standalone",link:"https://blindmonkey.github.io/triangles.html"}},{language:"Haxe",title:"Tail Recursion Eliminating Macro",description:["For fun, I built a proof of concept for a Haxe macro that can take a tail-recursive function  and flatten it into a while loop form."],source:{title:"view on GitHub",link:"https://github.com/blindmonkey/haxe-tail-recursion"},demo:null},{language:"Python",title:"PyGame Widgets and PySignature",description:["As a part of the taxicab advertisement platform we developed at AmpIdea, we wanted users to have a smooth experience using it. This was around the time the first iPhone was being announced, so we made a platform that had a similar smooth experience, momentum scrolling, and animated transitions.","In order to catch more errors I also wrote PySignature, which is a runtime typechecking system for Python. This allowed us to catch a lot more potential runtime errors and give users a much smoother experience. Given more development, this decorator-based system could be extended into a much more rigorous static typechecking, akin to something like MyPy."],source:{title:"coming soon",link:null},demo:{title:"Watch a short video demonstrating the AmpIdea platform",link:"https://www.youtube.com/watch?v=oozFrEOwO5c"}},{language:"Java",title:"Scheme Interpreter",description:["For a school project, I wrote an interpreter for a version of the Scheme language as part of a text-based adventure game."],source:null,demo:null}],_e=function(e){function t(){var e;return Object(o["a"])(this,t),e=Object(c["a"])(this,Object(u["a"])(t).apply(this,arguments)),e.projects=ye,e}return Object(s["a"])(t,e),t}(p["b"]);_e=d["a"]([Object(p["a"])({})],_e);var we=_e,ke=we,xe=Object(x["a"])(ke,ge,be,!1,null,null,null),je=xe.exports;a["default"].use(C["a"]);var Se=new C["a"]({routes:[{path:"/",name:"main",component:ce,redirect:"/about",children:[{path:"about",component:N},{path:"experience",component:ve},{path:"projects",component:je}]}]}),Ce=n("L2JU");a["default"].use(Ce["a"]);var Oe=new Ce["a"].Store({state:{},mutations:{},actions:{}});a["default"].config.productionTip=!1,new a["default"]({router:Se,store:Oe,render:function(e){return e(S)}}).$mount("#app")}});
//# sourceMappingURL=app.b02d7a9b.js.map