// get project folder path
var path = require('path');
var projectPath = path.join(__dirname, '../.');

// import utils
const {
   chooseEnvirnonment, // this function is async
   checkExternalDependencies,
   // ifPullIsNeededThen,
   // pull,
   build,
   configure,
   printInstallationHeader
   // pm2Startup
   // pm2ResartAll
} = require('rf-install-update').start(projectPath);


// do the installation
(async function install () {
   printInstallationHeader();
   checkExternalDependencies();
   var config = await chooseEnvirnonment();
   build(config);
   configure(config, 'force');
   console.log('Installation finished. \nRun "grunt" in terminal of the project folder to start development. \nThis will build the application and run it on a webserver which will restart on your code changes.');
})();
