/* Installs the offline helper and loads a new version of the guide as soon as one is published. */
if("serviceWorker" in navigator && /^https?:$/.test(location.protocol)){
  var hadController=!!navigator.serviceWorker.controller, reloaded=false;
  navigator.serviceWorker.addEventListener("controllerchange",function(){ if(hadController && !reloaded){ reloaded=true; location.reload(); } });
  window.addEventListener("load",function(){
    navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(function(r){ try{ r.update(); }catch(e){} }).catch(function(){});
  });
}
