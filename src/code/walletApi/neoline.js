let initResult;

function init() {
  return new Promise((resovle, reject) => {
    function onReady() {
      if (!(window).NEOLine || !(window).NEOLineN3) return;
      const neoDapi = new (window).NEOLine.Init();
      const neo3Dapi = new (window).NEOLineN3.Init();
      return resovle({ neoDapi, neo3Dapi });
    }
    onReady();
    window.addEventListener('NEOLine.NEO.EVENT.READY', onReady);
    window.addEventListener('NEOLine.N3.EVENT.READY', onReady);
    setTimeout(() => reject(new Error('neoline not installed!')), 3000);
  });
}

export function getNeoDapiInstances() {
  if (!initResult) {
    initResult = init();
  }
  return initResult;
}
