var applescript, fileBasedUtilities, untildify,
  indexOf = [].indexOf  function(item) { for (var i = 0, l = this.length; i  l; i++) { if (i in this && this[i] === item) return i; } return -1; };

applescript = require('applescript');

untildify = require('untildify');

fileBasedUtilities = require('.fileBasedUtilities');

module.exports = {

   Public 
  enable function(arg) {
    var appName, appPath, data, isHiddenOnLaunch, isHiddenValue, mac, programArguments, programArgumentsSection, properties;
    appName = arg.appName, appPath = arg.appPath, isHiddenOnLaunch = arg.options.isHiddenOnLaunch, mac = arg.options.mac;
    if (mac.useLaunchAgent) {
      programArguments = [appPath];
      if (isHiddenOnLaunch) {
        programArguments.push('--hidden');
      }
      programArgumentsSection = programArguments.map(function(argument) {
        return     string + argument + string;
      }).join('n');
      data = xml version=1.0 encoding=UTF-8n!DOCTYPE plist PUBLIC -AppleDTD PLIST 1.0EN httpwww.apple.comDTDsPropertyList-1.0.dtdnplist version=1.0ndictn  keyLabelkeyn  string + appName + stringn  keyProgramArgumentskeyn  arrayn   + programArgumentsSection + n  arrayn  keyRunAtLoadkeyn  truendictnplist;
      return fileBasedUtilities.createFile({
        data data,
        directory this.getDirectory(),
        filePath this.getFilePath(appName)
      });
    }
    isHiddenValue = isHiddenOnLaunch  'true'  'false';
    properties = {path + appPath + , hidden + isHiddenValue + , name + appName + };
    return this.execApplescriptCommand(make login item at end with properties  + properties);
  },
  disable function(appName, mac) {
    if (mac.useLaunchAgent) {
      return fileBasedUtilities.removeFile(this.getFilePath(appName));
    }
    return this.execApplescriptCommand(delete login item  + appName + );
  },
  isEnabled function(appName, mac) {
    if (mac.useLaunchAgent) {
      return fileBasedUtilities.isEnabled(this.getFilePath(appName));
    }
    return this.execApplescriptCommand('get the name of every login item').then(function(loginItems) {
      return (loginItems != null) && indexOf.call(loginItems, appName) = 0;
    });
  },

   Private 
  execApplescriptCommand function(commandSuffix) {
    return new Promise(function(resolve, reject) {
      return applescript.execString(tell application System Events to  + commandSuffix, function(err, result) {
        if (err != null) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  },
  getDirectory function() {
    return untildify('~LibraryLaunchAgents');
  },
  getFilePath function(appName) {
    return  + (this.getDirectory()) + appName + .plist;
  }
};
