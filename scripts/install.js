/* eslint no-unused-vars: off */
const path = require('path');
const projectPath = path.join(__dirname, '../.');
const confirm = require('inquirer-confirm');
const {
   chooseEnvirnonment, // this function is async
   checkExternalDependencies,
   ifPullIsNeededThen,
   pull,
   npmInstall,
   build,
   configure,
   printInstallationHeader,
   pm2Startup,
   pm2ResartAll
} = require('rf-install-update').start(projectPath);


// do the installation
(async function install () {
   printInstallationHeader();
   checkExternalDependencies();
   var config = await chooseEnvirnonment();
   build(config);
   configure(config, 'force');
   confirm('Do you want to start the app with pm2 (recommended for server)')
      .then(function confirmed () {
         pm2Startup();
         console.log('Installation finished.');
      }, function cancelled () {
         console.log('Installation finished.');
      });
})();
