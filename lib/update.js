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
      checkExternalDependencies, // this function is async
      checkCustomInstallScript, // this function is async
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
      checkCustomInstallScript();
      pm2ResartAll();
   });

};
