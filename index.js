const _ = require('lodash');
const fs = require('fs');
const log = require('rf-log').start(`[rf-install-update]`);
const shell = require('shelljs');
const git = require('git-state');
const readPkg = require('read-pkg');
const getExternalDeps = require('./lib/externalDeps.js');


// options: function parameter options over config file options over initOptions
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
var defaulOptions = {};
var packageJson = {};
var config = {};
var projectPath = '';


module.exports.start = function (projPath, confPath) {

   projectPath = projPath;

   // try to get config options from project config
   var configPath = projectPath + '/config/conf/config.js';
   if (fs.existsSync(configPath)) {
      config = readPkg.sync(configPath);
      defaulOptions = _.merge(initOptions, config);
   } else {
      log.info(`file ${configPath} not existent, using initOptions`);
   }
   defaulOptions = _.merge(initOptions, config);


   var packageJsonPath = projectPath + '/package.json';
   if (!fs.existsSync(packageJsonPath)) {
      log.critical(`file ${packageJsonPath} not existent, aborting ...`);
   }
   packageJson = readPkg.sync(packageJsonPath);



   return {
      checkExternalDependencies,
      ifPullIsNeededThen,
      pull,
      build,
      configure,
      printInstallationHeader,
      pm2Startup,
      pm2ResartAll
   };
};

function checkExternalDependencies (options) {
   var customShellScript = projectPath + '/shell/getCustomExternalDeps.sh';
   if (fs.existsSync(customShellScript)) sh('.' + projectPath);
   getExternalDeps();
}

function ifPullIsNeededThen (options, callback) {

   var opts = _.merge(defaulOptions, options);

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

   if (gitState.branch !== opts.branch) {
      log.warning('git: wrong branch ' + gitState.branch + ' , switching to branch ' + opts.branch);
      sh('git checkout ' + opts.branch);
   }

   if (gitState.ahead > 0) { // pull is needed
      callback();
   }
}

function pull (options) {
   var opts = _.merge(defaulOptions, options);
   var pullCmd = 'git pull origin ' + opts.branch;
   if (opts.forcePull) pullCmd += ' --force';
   sh(pullCmd);
}

function build (options) {
   var opts = _.merge(defaulOptions, options);
   sh('npm install');
   sh('grunt buildDev');
   if (opts.compress) sh('grunt compress');
}

function configure (options, force) {
   var opts = _.merge(defaulOptions, options);
   if (force || opts.refreshConfig) sh('grunt copy:' + opts.environment);
   if (force || opts.refreshMailTemplates) sh('grunt copy:' + opts.mailTemplates);
}

function printInstallationHeader (path) {
   console.log('\n');
   log.info('RAPIDFACTURE');
   log.info('-----------------------------------------');
   log.info(packageJson.name + ' Installation');
   console.log('\n');
   log.info(packageJson.description);
}

function pm2Startup () {
   sh('pm2 start server.js --name ' + packageJson.name);
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
