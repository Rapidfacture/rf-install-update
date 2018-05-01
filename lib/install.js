/* eslint no-unused-vars: off */
const confirm = require('inquirer-confirm');

module.exports.start = function (projectPath) {

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
   (async function install () {
      printInstallationHeader();
      var externalDepsready = await checkExternalDependencies(null, `askIfDbIsNotInstalled`);
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
