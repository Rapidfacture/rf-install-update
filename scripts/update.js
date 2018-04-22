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



function update (options) {
   var opts = _.merge(defaulOptions, options);
   pull(opts);
   build(opts);
   configure(opts);
}
