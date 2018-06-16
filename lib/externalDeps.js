const checkAndInstall = require('./checkAndInstall.js').sync;
const confirm = require('inquirer-confirm');
const log = require('rf-log');


function checkExternalDependencies (dbInstall) {

   checkAndInstall('grunt', 'sudo npm install -g grunt-cli');
   checkAndInstall('pm2', 'sudo npm install -g pm2');

   // default: do not ask for installing db, because it can be somewhere else in network
   // this should be done on install, but not on update
   if (dbInstall) {
      checkAndInstall('mongo', function (shell) {
         confirm('do you want to install MongoDB?')
            .then(function confirmed () {
               log.info('installing ...');
               shell.exec('sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6');
               shell.exec('echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list');
               shell.exec('sudo apt-get update');
               shell.exec('sudo apt-get install -y mongodb-org');

               // needed on ubuntu, otherwise daemon is not started
               shell.exec('sudo systemctl enable mongod.service');
               shell.exec('sudo service mongod restart');
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

module.exports = checkExternalDependencies;
