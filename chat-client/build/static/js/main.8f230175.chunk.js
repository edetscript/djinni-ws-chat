(this["webpackJsonpdjinni-ws-chat-client"]=this["webpackJsonpdjinni-ws-chat-client"]||[]).push([[0],{11:function(e,t,a){"use strict";a.r(t);var c=a(1),s=a.n(c),n=a(3),l=a.n(n),r=(a(8),a(9),a(0));var i=()=>{const[e,t]=Object(c.useState)([]),[a,s]=Object(c.useState)(""),[n,l]=Object(c.useState)(null),[i,o]=Object(c.useState)(localStorage.getItem("username")||""),[j,d]=Object(c.useState)(!!localStorage.getItem("username")),h=Object(c.useRef)(null);Object(c.useEffect)((()=>(h.current=new WebSocket("wss://djinni-ws-chat.onrender.com"),h.current.onmessage=e=>{const a=JSON.parse(e.data);"pastMessages"===a.type?t(a.data):t((e=>[...e,a]))},()=>{h.current.close()})),[]);const u=()=>{localStorage.setItem("username",i),d(!0)};return j?Object(r.jsx)("div",{className:"App",children:Object(r.jsxs)("div",{className:"chat-container",children:[Object(r.jsx)("div",{className:"chat-header",children:Object(r.jsx)("h1",{children:"Group Chat"})}),console.log(e),Object(r.jsx)("div",{className:"chat-window",children:e.map(((e,t)=>Object(r.jsxs)("div",{className:"chat-message ".concat(e.username===i?"own-message":""),children:[Object(r.jsx)("strong",{children:Object(r.jsx)("small",{children:e.username})}),Object(r.jsx)("br",{}),e.message,e.fileUrl&&Object(r.jsx)("div",{children:Object(r.jsx)("a",{href:e.fileUrl,target:"_blank",rel:"noopener noreferrer",children:e.fileName})})]},t)))}),Object(r.jsxs)("div",{className:"chat-input",children:[Object(r.jsx)("textarea",{placeholder:"Type your message",value:a,onChange:e=>s(e.target.value)}),Object(r.jsx)("input",{type:"file",onChange:e=>l(e.target.files[0])}),Object(r.jsx)("button",{onClick:async()=>{let e="",t="";if(n){const a=new FormData;a.append("file",n);const c=await fetch("https://djinni-ws-chat.onrender.com/upload",{method:"POST",body:a}),s=await c.json();e=s.file,t="".concat("https://djinni-ws-chat.onrender.com","/").concat(s.file)}const c={username:i,message:a,fileUrl:t,fileName:e};h.current.send(JSON.stringify(c)),s(""),l(null)},disabled:!a&&!n,children:"Send"})]})]})}):Object(r.jsxs)("div",{className:"username-container",children:[Object(r.jsx)("h4",{children:"Pick a username"}),Object(r.jsx)("input",{type:"text",placeholder:"Username",value:i,onChange:e=>o(e.target.value)}),Object(r.jsx)("button",{onClick:u,disabled:!i,children:"Join Chat"})]})};l.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(i,{})}),document.getElementById("root"))},8:function(e,t,a){},9:function(e,t,a){}},[[11,1,2]]]);
//# sourceMappingURL=main.8f230175.chunk.js.map