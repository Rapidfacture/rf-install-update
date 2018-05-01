/**
 * updater for rf projects
 * get fresh application code via git from corresponding branch
 * optionas: according to update options in config file
 *
 */
/* eslint no-unused-vars: off */

// console.log(process.argv)
if (!process.argv[2]) throw new Error('no projectPath was defined as parameter for the script!');
const projectPath = process.argv[2];

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
