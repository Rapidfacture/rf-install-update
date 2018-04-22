/**
 * updater for rf projects
 * get fresh application code via git from corresponding branch
 * optional: force git pull and overwrite old modules
 *
 * update node modules
 * rebuild app code
 * optional: minifie frontend code
 * optional: reconfigure network config
 * optional: reconfigure mail templates
 * update database settings
 *
 *
 * the migration of the database is done seperate
 *
 */


// https://www.npmjs.com/package/git-state


var git = require('git-state');
var log = require('rf-log');
var shell = require('shelljs');
var update = require('../lib/conf/config.js');


var repoPath = '/path/to/git/repo';
var updateConfig = require(repoPath + '/config/conf/config.js').update;



git.isGit(repoPath, function (exists) {
   if (!exists) return;
   checkRepo();
});

function checkRepo () {
   git.check(repoPath, function (err, gitState) {
      if (err) throw err;
      // console.log(result)
      // {
      //   branch: 'master',
      //   ahead: 0,
      //   dirty: 9,
      //   untracked: 1,
      //   stashes: 0
      // }

      if (gitState.dirty) {
         log.warning('git: modified files found ...');
         if (updateConfig.forcePull) {
            log.info('git: resetting repo');
            shell.exec('git reset --hard');
         } else {
            return log.error('aborting');
         }
      }

      if (gitState.branch !== updateConfig.branch) {
         log.warning('git: wrong branch ' + gitState.branch + ' , switching to branch ' + updateConfig.branch);
         shell.exec('git checkout ' + updateConfig.branch);
      }

      if (gitState.ahead > 0) { // pull is needed
         update();
      }


   });
}

function update (options) {
   var opts = _.merge(defaulOptions, options);
   pull(opts);
   build(opts);
   configure(opts);
}
