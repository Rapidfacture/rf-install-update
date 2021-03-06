const _ = require('lodash');
const fs = require('fs');
const log = require('rf-log').start(`[rf-install-update]`);
const shell = require('shelljs');
const git = require('git-state');
const readPkg = require('read-pkg');
const getExternalDeps = require('./externalDeps.js');
const configChoose = require('./configChoose.js');
const needsPull = require('git-needs-pull');


// options: function parameter options over config file options over initOptions
var initOptions = {
   // environment options
   'branch': 'master',
   'compress': false, // minifie html, js, css
   'environment': 'environment',
   'mailTemplates': false,

   // update options
   'forcePull': false, // overwrite local changes
   'refreshConfig': false, // overwrite environment config with fresh one from git
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
   defaultConfigPath = projectPath + '/config/environment/default.js';

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
      checkCustomInstallScript,
      ifPullIsNeededThen,
      pull,
      npmInstall,
      build,
      updateEnvironmentConfig,
      updateMailConfig,
      printInstallationHeader,
      pm2Startup,
      pm2ResartAll
   };
};

function chooseEnvirnonment () {
   logSectionInfo('choose enviromnent');
   return configChoose(activeConfigPath, config);
}

async function checkExternalDependencies (options) {
   return getExternalDeps(options);
}

async function checkCustomInstallScript (options) {
   var customScriptPath = projectPath + '/shell/getCustomExternalDeps.js';
   logSectionInfo('installing external dependencies ... ');
   log.info('checking custom external dependencies script under ');
   log.info(customScriptPath);
   if (fs.existsSync(customScriptPath)) {
      log.info('custom script found, executing it');
      let customScript = require(customScriptPath);
      if (customScript.start) {
         return new Promise(function (resolve, reject) {
            customScript.start(function () {
               resolve(true);
            });
         });
      } else {
         return true;
      }
   } else {
      log.info('no custom script found, continuing ... ');
      return true;
   }
}

function ifPullIsNeededThen (options, callback) {

   var opts = _.merge(defaulOptions, options);

   logSectionInfo('checking git status');

   sh('git fetch');

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

   if (opts.branch && gitState.branch !== opts.branch) {
      log.warning('git: wrong branch ' + gitState.branch + ' , switching to branch ' + opts.branch);
      sh('git checkout ' + opts.branch);
   }


   if (needsPull(projectPath)) {
      log.info(`git: repo is behind and needs update`);
      callback();
   } else {
      log.info(`git: repo up to date, aborting ...`);
   }
}

function pull (options) {
   var opts = _.merge(defaulOptions, options);
   logSectionInfo('get latest code');

   var currentBranch = opts.branch;

   if (!currentBranch) {
      var gitState = git.checkSync(projectPath);
      currentBranch = gitState.branch;
   }

   var pullCmd = 'git pull origin ' + currentBranch;
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

function updateEnvironmentConfig (options, force) {
   logSectionInfo('update environment config');
   var opts = _.merge(defaulOptions, options);
   if (opts.environment && (opts.refreshConfig || force)) {
      sh('grunt copy:' + opts.environment);
   }
}

function updateMailConfig (options, force) {
   logSectionInfo('update mail config');
   var opts = _.merge(defaulOptions, options);
   if (opts.mailTemplates && (opts.refreshMailTemplates || force)) {
      sh('grunt copy:' + opts.mailTemplates);
   }
}

function printInstallationHeader (path) {
   console.log('\n');
   var rfBig = '   _______   ___    _   ___ ___ ___  ___  _   ___ _____ _   _ ___ ___\n  /       / | _ \\  /_\\ | _ \\_ _|   \\| __|/_\\ / __|_   _| | | | _ \\ __|\n /  ( )  /  |   / / _ \\|  _/| || |) | _|/ _ \\ (__  | | | |_| |   / _| \n/_______/   |_|_\\/_/ \\_\\_| |___|___/|_|/_/ \\_\\___| |_|  \\___/|_|_\\___|';
   // var rfSmall = '   _______    _  _  _ ___ _   __ _  __ ___    _  __\n  /       /  |_)|_||_) | | \\ |_ |_|/    | | ||_)|_ \n /  ( )  /   | \\| ||  _|_|_/ |  | |\\__  | |_|| \\|__ \n/______ /';
   console.log(rfBig);
   console.log('\n');
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
