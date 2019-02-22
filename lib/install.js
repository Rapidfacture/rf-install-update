/**
 * updater for rf projects
 * get fresh application code via git from corresponding branch
 * optionas: according to update options in config file
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


   const confirm = require('inquirer-confirm');

   // do the installation
   (async function install () {
      printInstallationHeader();
      var externalDepsready = await checkExternalDependencies({dbInstall: true});
      var config = await chooseEnvirnonment();
      build(config);
      // no update of environment needed here, as it is created before with "chooseEnvirnonment"
      updateMailConfig(config, 'force');
      confirm('Do you want to start the app with pm2 (recommended for server)')
         .then(function confirmed () {
            pm2Startup();
            console.log('Installation finished.');
         }, function cancelled () {
            console.log('Installation finished.');
         });
   })();

};
