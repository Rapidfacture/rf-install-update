// get project folder path
var path = require('path');
var projectPath = path.join(__dirname, '../.');

// import utils
const {
   checkExternalDependencies,
   // ifPullIsNeededThen,
   // pull,
   build,
   configure,
   printInstallationHeader
   // pm2Startup
} = require('rf-install-update').start(projectPath);


// do the installation
printInstallationHeader();
checkExternalDependencies();
build();
configure({}, 'force');


// log
console.log('Installation finished. \nRun "grunt" in terminal of the project folder to start development. \nThis will build the application and run it on a webserver which will restart on your code changes.');
