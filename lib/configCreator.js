var log = require('rf-log');
const { prompt } = require('prompts');

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


function createConfig () {
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


(async function () {

   var updateObj = await getEnvirnonmentOptions();
   showConfiuration(updateObj);

   // custom => create config
   // from config as template
   // else => copy specific config

   const answers = await createConfig();
   answers.environment = 'custom';

   console.log(answers);

})();

// install node
// npm install
// start install script
// start configurationdefault
  // use default config => install
  // custom


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

function showConfiuration (config) {
   [
      'environment',
      'pm2',
      'compress',
      'mailTemplates',
      'branch',
      'forcePull',
      'refreshConfig',
      'refreshMailTemplates',
      'refreshDatabase'
   ].forEach(function (key) {
      if (key in config) { console.log(key + ': ', config[key]); }
   });
}
