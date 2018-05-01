const _ = require('lodash');
const fs = require('fs');
const log = require('rf-log').start(`[rf-install-update]`);
const shell = require('shelljs');
const git = require('git-state');
const readPkg = require('read-pkg');
const getExternalDeps = require('./lib/externalDeps.js');
const configChoose = require('./lib/configChoose.js');

// options: function parameter options over config file options over initOptions
var initOptions = {
   // environment options
   'branch': 'master',
   'compress': false, // minifie html, js, css
   'environment': 'enviroment',
   'mailTemplates': 'mail',

   // update options
   'forcePull': true, // overwrite local changes
   'refreshConfig': false, // overwrite enviroment config with fresh one from git
   'refreshMailTemplates': false, //  overwrite mail templates with fresh one from git
   'refreshDatabase': false //  NOTE: critical - for local dev or on system install; overwrite database samples
};
var defaulOptions = {};
var packageJson = {};
var config = {};
var projectPath = '';
var activeConfigPath = '';
var defaultConfigPath = '';

module.exports.start = function (projPath, confPath) {

   projectPath = projPath;
   activeConfigPath = projectPath + '/config/conf/config.js';
   defaultConfigPath = projectPath + '/config/enviroment/default.js';

   // try to get config options from project config
   if (fs.existsSync(activeConfigPath)) {
      config = require(activeConfigPath);
   } else if (fs.existsSync(defaultConfigPath)) {
      log.info(`file ${activeConfigPath} not existent, using default Options`);
      config = require(defaultConfigPath);
   } else {
      log.info(`file ${activeConfigPath} not existent, using initOptions`);
   }

   if (config.update) {
      defaulOptions = _.merge(initOptions, config.update);
   } else {
      defaulOptions = initOptions;
   }

   var packageJsonPath = projectPath + '/package.json';
   if (!fs.existsSync(packageJsonPath)) {
      log.critical(`file ${packageJsonPath} not existent, aborting ...`);
   }
   packageJson = readPkg.sync(packageJsonPath);



   return {
      chooseEnvirnonment, // this function is async
      checkExternalDependencies,
      ifPullIsNeededThen,
      pull,
      npmInstall,
      build,
      configure,
      printInstallationHeader,
      pm2Startup,
      pm2ResartAll
   };
};

function chooseEnvirnonment () {
   logSectionInfo('choose enviromnent');
   return configChoose(activeConfigPath, defaulOptions);
}

function checkExternalDependencies (options, dbInstall) {
   var customShellScript = projectPath + '/shell/getCustomExternalDeps.sh';
   logSectionInfo('installing external dependencies ... ');
   log.info('checking custom external dependencies script under ');
   log.info(customShellScript);
   if (fs.existsSync(customShellScript)) {
      log.info('custom script found, executing it');
      sh('.' + projectPath);
   } else {
      log.info('no custom script foun, continuing ... ');
   }

   return getExternalDeps(dbInstall);
}

function ifPullIsNeededThen (options, callback) {

   var opts = _.merge(defaulOptions, options);

   logSectionInfo('checking git status');

   if (!git.isGitSync(projectPath)) {
      return log.error(projectPath + 'is no git repo, aborting');
   }

   var gitState = git.checkSync(projectPath);
   // console.log(gitState)
   // {
   //   branch: 'master',
   //   ahead: 0,
   //   dirty: 9,
   //   untracked: 1,
   //   stashes: 0
   // }

   if (gitState.dirty) {
      log.warning('git: modified files found ...');
      if (opts.forcePull) {
         log.info('git: resetting repo');
         sh('git reset --hard');
      } else {
         return log.error('aborting');
      }
   }

   if (gitState.branch && gitState.branch !== opts.branch) {
      log.warning('git: wrong branch ' + gitState.branch + ' , switching to branch ' + opts.branch);
      sh('git checkout ' + opts.branch);
   }

   if (gitState.ahead > 0) { // pull is needed
      callback();
   }
}

function pull (options) {
   var opts = _.merge(defaulOptions, options);
   logSectionInfo('get latest code');
   var pullCmd = 'git pull' + (opts.branch ? 'origin ' + opts.branch : '');
   if (opts.forcePull) pullCmd += ' --force';
   sh(pullCmd);
}


function npmInstall (options) {
   logSectionInfo('get npm packages');
   sh('npm install');
}

function build (options) {
   var opts = _.merge(defaulOptions, options);
   logSectionInfo('build the app');
   sh('grunt buildDev');
   if (opts.compress) sh('grunt compress');
}

function configure (options, force) {
   logSectionInfo('configuring project');
   var opts = _.merge(defaulOptions, options);
   if (opts.environment && opts.refreshConfig) sh('grunt copy:' + opts.environment);
   if (force || opts.refreshMailTemplates) sh('grunt copy:' + opts.mailTemplates);
}

function printInstallationHeader (path) {
   console.log('\n');
   var rfBig = '   _______   ___    _   ___ ___ ___  ___  _   ___ _____ _   _ ___ ___\n  /       / | _ \\  /_\\ | _ \\_ _|   \\| __|/_\\ / __|_   _| | | | _ \\ __|\n /  ( )  /  |   / / _ \\|  _/| || |) | _|/ _ \\ (__  | | | |_| |   / _| \n/_______/   |_|_\\/_/ \\_\\_| |___|___/|_|/_/ \\_\\___| |_|  \\___/|_|_\\___|';
   // var rfSmall = '   _______    _  _  _ ___ _   __ _  __ ___    _  __\n  /       /  |_)|_||_) | | \\ |_ |_|/    | | ||_)|_ \n /  ( )  /   | \\| ||  _|_|_/ |  | |\\__  | |_|| \\|__ \n/______ /';
   console.log(rfBig);
   logSectionInfo(packageJson.name + ' Installation');
   log.info(packageJson.description);
   log.info('starting installation ...');
}

function pm2Startup () {
   logSectionInfo('starting up with pm2');
   sh(`pm2 start ${projectPath}/server.js --name ` + packageJson.name);
   sh('pm2 startup');
   sh('sudo su -c "env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER"', 'Make startup script execute on system start');
   sh('pm2 save', 'save current process list');
   log.info('Installation finished \n\n For further Infos about running pm2 see \n http://pm2.keymetrics.io/docs/usage/quick-start/ \n\n');
}

function pm2ResartAll () {
   sh('pm2 restart all');
}


/* ------------  helper functions  -------------- */

function sh (cmd, infomessage) {
   if (infomessage) log.info(infomessage);
   log.info('executing ', cmd);
   shell.exec(cmd);
}

function logSectionInfo (message) {
   log.info(`\n`);
   log.info(message);
   log.info('--------------------------------------------');
}
