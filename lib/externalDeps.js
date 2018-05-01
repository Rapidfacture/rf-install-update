const commandExistsSync = require('command-exists').sync;
const confirm = require('inquirer-confirm');
const shell = require('shelljs');
const log = require('rf-log');


function checkExternalDependencies (dbInstall) {

   checkAndInstall('grunt', function () {
      log.warning('installing ...');
      shell.cmd('sudo npm install -g grunt-cli');
   });

   checkAndInstall('pm2', function () {
      log.warning('installing ...');
      shell.cmd('sudo npm install -g pm2');
   });

   // default: do not ask for installing db, because it can be somewhere else in network
   // this should be done on install, but not on update
   if (dbInstall) {
      checkAndInstall('mongo', function () {
         confirm('do you want to install MongoDB?')
            .then(function confirmed () {
               log.info('installing ...');
               shell.cmd('sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6');
               shell.cmd('echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list');
               shell.cmd('sudo apt-get update');
               shell.cmd('sudo apt-get install -y mongodb-org');

               // needed on ubuntu, otherwise daemon is not started
               shell.cmd('sudo systemctl enable mongod.service');
               shell.cmd('sudo service mongod restart');
               return 'ready';
            }, function cancelled () {
               log.info('cancelled, continuing installation ...');
               return 'ready';
            });
      });
   } else {
      return 'ready';
   }
}



function checkAndInstall (cmd, installFunction) {
   if (commandExistsSync(cmd)) {
      log.info(cmd + ' was found on the local machine, continuing ...');
   } else {
      log.warning(cmd + ' was not found on your local machine');
      installFunction();
   }
}

module.exports = checkExternalDependencies;
