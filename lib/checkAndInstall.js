// packages are installed via rf-install-update and do not need to be present in package.json of project
const commandExistsSync = require('command-exists').sync;
const shell = require('shelljs');
const log = require('rf-log');


/** example usage
 *
 * const checkAndInstall = require('rf-install-update').checkAndInstall;
 * checkAndInstall('inkscape', 'sudo apt-get install inkscape');
 * checkAndInstall('programme XY', function(){ console.log('now installing');});
 *
 */

function checkAndInstall (cmd, install) {

   if (!cmd) return log.erro('no parameter "cmd" defined!');
   if (!install) return log.erro('no parameter "install" defined for command ', cmd);

   if (commandExistsSync(cmd)) {
      log.info(cmd + ' was found on the local machine, continuing ...');
   } else {
      log.warning(cmd + ' was not found on your local machine, installing ...');
      if (typeof install === 'string') {
         shell.exec(install);
      } else {
         install(shell, cmd);
      }
   }
}

module.exports = checkAndInstall;
