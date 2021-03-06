/**
 * installer for rf projects
 * installation: according to options of config files or custom install
 *
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


   const confirm = require('inquirer-confirm');

   // do the installation
   (async function install () {
      printInstallationHeader();
      var externalDepsready = await checkExternalDependencies({dbInstall: true});
      var config = await chooseEnvirnonment();
      // no update of environment needed here, as it is created before with "chooseEnvirnonment"
      build(config);
      updateMailConfig(config, 'force');
      var customInstallScript = await checkCustomInstallScript();

      confirm('Do you want to start the app with pm2 (recommended for server)')
         .then(function confirmed () {
            pm2Startup();
            console.log('Installation finished.');
            process.exit(0);
         }, function cancelled () {
            console.log('Installation finished.');
            process.exit(0);
         });

   })();

};
