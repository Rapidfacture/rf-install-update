/**
 * updater for rf projects
 * get fresh application code via git from corresponding branch
 * optionas: according to update options in config file
 *
 */
/* eslint no-unused-vars: off */

// get project folder path
var path = require('path');
var projectPath = path.join(__dirname, '../.');

// import utils
const {
   chooseEnvirnonment, // this function is async
   checkExternalDependencies,
   ifPullIsNeededThen,
   pull,
   npmInstall,
   build,
   updateEnvironmentConfig,
   updateMailConfig,
   printInstallationHeader,
   pm2Startup,
   pm2ResartAll
} = require('rf-install-update').start(projectPath);


// do the installation
ifPullIsNeededThen(null, function () {
   pull();
   npmInstall();
   checkExternalDependencies();
   build();
   updateEnvironmentConfig();
   updateMailConfig();
   pm2ResartAll();
});
