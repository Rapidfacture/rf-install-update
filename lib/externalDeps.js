const checkAndInstall = require('./checkAndInstall.js');
const confirm = require('inquirer-confirm');
const log = require('rf-log');


async function checkExternalDependencies (options) {

   options = options || {};

   checkAndInstall('grunt', 'sudo npm install -g grunt-cli');
   checkAndInstall('pm2', 'sudo npm install -g pm2');

   // default: do not ask for installing db, because it can be somewhere else in network
   // this should be done on install, but not on update
   if (options.dbInstall) {
      return checkAndInstall('mongo', function (shell) {
         return confirm('do you want to install MongoDB?')
            .then(function confirmed () {
               log.info('installing ...');
               shell.exec('sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4');
               shell.exec('echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list');
               shell.exec('sudo apt-get update');
               // version 4.0.9 is the latest one with support for ubuntu 14.04
               shell.exec('sudo apt-get install -y mongodb-org=4.0.10 mongodb-org-server=4.0.10 mongodb-org-shell=4.0.10 mongodb-org-mongos=4.0.10 mongodb-org-tools=4.0.10');

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
