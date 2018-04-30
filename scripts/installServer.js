// get project folder path
var path = require('path');
var projectPath = path.join(__dirname, '../..');

// import utils
const {
   checkExternalDependencies,
   // ifPullIsNeededThen,
   // pull,
   build,
   configure,
   printInstallationHeader,
   pm2Startup
} = require('rf-install-update').start(projectPath);


// do the installation
printInstallationHeader();
checkExternalDependencies();
build();
configure({}, 'force');
pm2Startup();


// log
console.log('Installation finished.');
