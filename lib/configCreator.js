var log = require('rf-log');
const { prompt } = require('prompts');
var confirm = require('inquirer-confirm');

function getEnvirnonmentOptions () {
   return prompt([{
      type: 'select',
      name: 'environment',
      message: 'Use config environment:',
      initial: 0,
      choices: [
         { title: 'default', value: 'enviroment' },
         { title: 'development', value: 'enviroment-dev' },
         { title: 'production', value: 'enviroment-prod' },
         { title: 'custom', value: false }
      ]}]);
};

async function getNetworkConfigPort (config) {
   config = config || {db: {}};
   var dbUrl = 'localhost';
   var dbPort = '27017';

   var questions = [{
      type: 'number',
      name: 'port',
      message: 'Webserver port?',
      initial: config.port || 3000
   }, {
      type: 'text',
      name: 'dbUrl',
      message: 'Server Url of the db Server?',
      initial: dbUrl
   }, {
      type: 'number',
      name: 'dbPort',
      message: 'Database port?',
      initial: dbPort
   }];

   var answer = await prompt(questions);

   config.port = answer.port;

   for (var key in config.db) {
      config.db[key] = 'mongodb:// ' + dbUrl + (':' + answer.dbPort) + '/' + key;
   }

   return config;
}



function updateConfig () {
   return prompt([{
      type: 'select',
      name: 'pm2',
      message: 'Start app with pm2?',
      hint: 'recommended on server',
      initial: 1,
      choices: [
         { title: 'yes', value: true },
         { title: 'no', value: false }
      ]
   }, {
      type: 'select',
      name: 'mailTemplates',
      message: 'Use mail config:',
      initial: 0,
      choices: [
         { title: 'default', value: 'default' },
         { title: 'rf-prod', value: 'rf-prod' }
      ]}, {
      type: 'select',
      name: 'compress',
      message: 'Minify Frontend Code?',
      hint: 'Usefull to speed aup pages and limit server load: Minifiy HTML, CSS, JS',
      initial: 1,
      choices: [
         { title: 'yes', value: true },
         { title: 'no', value: false }
      ]
   }, {
      type: 'select',
      name: 'branch',
      message: 'Select a branch to pull updates from:',
      initial: 0,
      choices: [
         { title: 'master', value: 'master' },
         { title: 'stable', value: 'stable' }
      ]}, {
      type: 'select',
      name: 'forcePull',
      message: 'Force git pull?',
      hint: 'overwrites local changes, recommended for server auto update',
      initial: 1,
      choices: [
         { title: 'yes', value: true },
         { title: 'no', value: false }
      ]
   }, {
      type: 'select',
      name: 'refreshConfig',
      message: 'Auto update environment configuration?',
      hint: 'Warning: Overwrites custom config that needs manual update',
      initial: 1,
      choices: [
         { title: 'yes', value: true },
         { title: 'no', value: false }
      ]
   }, {
      type: 'select',
      name: 'refreshMailTemplates',
      message: 'Auto update mail configuration?',
      hint: 'Warning: Overwrites custom config that needs manual update',
      initial: 1,
      choices: [
         { title: 'yes', value: true },
         { title: 'no', value: false }
      ]
   }]);
}

async function createConfig (config) {
   config = await getNetworkConfigPort();
   config.update = await updateConfig();
   return config;
}

//
async function isConfigOkLoop (config) {
   return confirm('Are your options fine? Type "y" to continue, "n" for another try')
      .then(function confirmed () {
         return config;
      }, async function cancelled () {
         console.log('\n');
         config = await createConfig(config);
         const loopPromise = await isConfigOkLoop(config);
         return loopPromise;
      });
}


(async function () {

   var environment = await getEnvirnonmentOptions();
   console.log(environment);

   const config = await createConfig();
   const newConfig = await isConfigOkLoop(config);
   console.log('newConfig', newConfig);
})();



// install node
// npm install
// start install script

// start configuration
//    use default config
//       => read from config file
//       => custom network config
//    custom => create config file
// install


// 'update': {
//
//    // default environment' file?
//    'environment': 'enviroment-prod',
//
//    // building options
//    'pm2': false
//    'compress': false, // minifie html, js, css
//    'mailTemplates': 'mail-prod',
//
//    // update options
//    'branch': 'stable',
//    'forcePull': true, // overwrite local changes
//    'refreshConfig': true, // overwrite enviroment config with fresh one from git
//    'refreshMailTemplates': true, //  overwrite mail templates with fresh one from git
//    'refreshDatabase': false //  NOTE: critical - for local dev or on system install; overwrite database samples
// }
