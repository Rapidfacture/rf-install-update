/**
 * updater for rf projects
 * get fresh application code via git from corresponding branch
 * update according to update options in config file
 *
 */
/* eslint no-unused-vars: off */


module.exports.start = function (projectPath) {

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
   } = require('./utils.js').start(projectPath);


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

};
