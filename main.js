const menubar = require('menubar')
const path = require('path');
const mb = menubar({
    index:`file://${__dirname}/src/menubar.html`,
    height:180,
    width:200,
    resizable: true,
    icon: path.join(__dirname, 'images', 'clock24px.png')
})

mb.on('ready', function ready () {
  console.log('app is ready')
  // your app code here
})