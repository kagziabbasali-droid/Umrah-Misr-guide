/* installs the offline helper; the guide then opens without internet after one online visit */
if("serviceWorker" in navigator && /^https?:$/.test(location.protocol)){ window.addEventListener("load",function(){ navigator.serviceWorker.register("sw.js").catch(function(){}); }); }
