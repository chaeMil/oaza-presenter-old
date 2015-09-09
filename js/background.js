/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */

var globalData = {};
globalData.presenterAspectRatio = 0;
var settings = {};
settings['bgFolders'] = [];

function returnSettings() {
  return settings;
}

chrome.app.runtime.onLaunched.addListener(function(launchData) {
      
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      frame: 'none',
      innerBounds: {
        minHeight: 550,
        minWidth: 1110
      }
    }, 
    function(win) {
      
      win.onClosed.addListener(function() {
        console.log('closed main window');
        chrome.app.window.get('presenter').close();
      });
    }
  );
  
  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.type == 'setSettings') {
      
      //addBgFolder
      if (request.name === 'addBgFolder') {
        settings['bgFolders'].push(request.value);
        console.log(settings);
        callback(returnSettings());
      }
      
      //removeBgFolder
      if (request.name === 'removeBgFolder') {
        var index = settings['bgFolders'].indexOf(request.value);
        if (index >= 0) {
          settings['bgFolders'].splice(index, 1);
        }
        console.log(settings);
        callback(returnSettings());
      }
    }
    
    if (request.type == 'getSettings') {
      if (request.name == 'all') {
        callback(returnSettings());
      }
    }
  });
    
});