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
   printInstallationHeader,
   pm2Startup
   // pm2ResartAll
} = require('rf-install-update').start(projectPath);


// do the installation
(async function install () {
   printInstallationHeader();
   checkExternalDependencies();
   console.log('await chooseEnvirnonment');
   var config = await chooseEnvirnonment();
   console.log('after chooseEnvirnonment', config);
   build(config);
   configure(config, 'force');
   pm2Startup();
   console.log('Installation finished.');
})();
