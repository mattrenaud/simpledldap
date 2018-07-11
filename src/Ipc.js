const { ipcRenderer } = window.require('electron');
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log('pong', arg); // prints "pong"
});

ipcRenderer.send('asynchronous-message', 'ping');
