/**
 * updater for rf projects
 * get fresh application code via git from corresponding branch
 * optionas: according to update options in config file
 *
 */

// get project folder path
var path = require('path');
var projectPath = path.join(__dirname, '../.');

// import utils
const {
   // chooseEnvirnonment, // this function is async
   // checkExternalDependencies,
   ifPullIsNeededThen,
   pull,
   build,
   configure,
   // printInstallationHeader,
   // pm2Startup
   pm2ResartAll
} = require('rf-install-update').start(projectPath);


// do the installation
ifPullIsNeededThen(function () {
   pull();
   build();
   configure();
   pm2ResartAll();
});
