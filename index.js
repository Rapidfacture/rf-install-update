var log = require('rf-log');
var shell = require('shelljs');
var _ = require('lodash');
const readPkg = require('read-pkg');
var repoPath = '/path/to/git/repo';
var updateConfig = require(repoPath + '/config/conf/config.js').update;
var initOptions = {
   // environment options
   'branch': 'master',
   'compress': false, // minifie html, js, css
   'environment': 'default',
   'mailTemplates': 'mail',

   // update options
   'forcePull': true, // overwrite local changes
   'refreshConfig': false, // overwrite enviroment config with fresh one from git
   'refreshMailTemplates': false, //  overwrite mail templates with fresh one from git
   'refreshDatabase': false //  NOTE: critical - for local dev or on system install; overwrite database samples
};
var defaulOptions = _.merge(initOptions, updateConfig);
// options: function parameter options over config file options over initOptions


module.exports = {
   pull,
   build,
   configure,
   printInstallationHeader,
   pm2Startup
};


function pull (options) {
   var opts = _.merge(defaulOptions, options);
   var pullCmd = 'git pull origin ' + opts.branch;
   if (opts.forcePull) pullCmd += ' --force';
   sh(pullCmd);
}

function build (options) {
   var opts = _.merge(defaulOptions, options);
   sh('npm install');
   sh('grunt');
   if (opts.compress) sh('grunt compress');
}

function configure (options, force) {
   var opts = _.merge(defaulOptions, options);
   if (force || opts.refreshConfig) sh('grunt copy:' + opts.environment);
   if (force || opts.refreshMailTemplates) sh('grunt copy:' + opts.mailTemplates);
}

function printInstallationHeader (path) {
   const packageJson = readPkg.sync(path);
   console.log('\n');
   log.info('RAPIDFACTURE');
   log.info('-----------------------------------------');
   log.info(packageJson.name + ' Installation');
   console.log('\n');
   log.info(packageJson.description);
}

function pm2Startup () {
   sh('pm2 startup');
   sh('sudo su -c "env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER"', 'Make startup script execute on system start');
   sh('pm2 save', 'save current process list');
   log.info('Installation finished \n\n For further Infos about running pm2 see \n http://pm2.keymetrics.io/docs/usage/quick-start/ \n\n');
}


/* ------------  helper functions  -------------- */

function sh (cmd, infomessage) {
   if (infomessage) log.info(infomessage);
   log.info('executing ', cmd);
   shell.exec(cmd);
}
