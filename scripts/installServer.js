// get project folder path
var path = require('path');
var projectPath = path.join(__dirname, '../.');

// import utils
const {
   chooseEnvirnonment, // this function is async
   checkExternalDependencies,
   // ifPullIsNeededThen,
   // pull,
   // npmInstall
   build,
   configure,
   printInstallationHeader,
   pm2Startup
   // pm2ResartAll
} = require('rf-install-update').start(projectPath);


// do the installation
(async function install () {
   printInstallationHeader();
   checkExternalDependencies();
   var config = await chooseEnvirnonment();
   build(config);
   configure(config, 'force');
   pm2Startup();
   console.log('Installation finished.');
})();
