const { prompt } = require('prompts');
const confirm = require('inquirer-confirm');
const shell = require('shelljs');
const log = require('rf-log');
const fs = require('fs');


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
   dbUrl = answer.dbUrl || dbUrl;
   dbUrl = answer.dbPort || dbPort;

   for (var key in config.db) {
      config.db[key] = 'mongodb://' + dbUrl + (':' + dbPort) + '/' + key;
   }
   return config;
}


function updateConfig (config) {
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
         { title: 'default', value: 'mail' },
         { title: 'rf-prod', value: 'mail-rf-prod' }
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
      message: 'Specific update branch:',
      initial: 0,
      choices: [
         { title: 'none (for developers - ignore current brach)', value: false },
         { title: 'master (ensure only master)', value: 'master' },
         { title: 'stable (ensure only stable)', value: 'stable' }
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

async function createConfigJson (config) {
   config = config || {};
   var environment = config.environment || false;
   config = await getNetworkConfigPort(config);
   config.update = await updateConfig(config);
   config.update.environment = environment;
   return config;
}

// loop for user to return, when he picked a wrong option
async function isConfigOkLoop (config) {
   return confirm('Are your options fine? Type "y" to continue, "n" for another try')
      .then(function confirmed () {
         return config;
      }, async function cancelled () {
         console.log('\n');
         config = await createConfigJson(config);
         const loopPromise = await isConfigOkLoop(config);
         return loopPromise;
      });
}


// createFileContet: this is really ugly; the file might be better a json file which is eas to create
// however, this is a quick workaround
// TODO: think aout the structure of environment + variables file, rf-config and rf-db-settings

// maybe better to have three modules, that hold variables in them?
//    rf-enviromnent-vars => enviromnent file
//    rf-db-settings
//    rf-config => package.json, paths and other variables that should not be edited by user
// those modules might all work like rf-config does now
function createFileContet (config) {
   var configFileContent = 'var config = ' + JSON.stringify(config, null, 3) + ';\n';
   configFileContent += "var variables = require('../variables.js'); \n for (var varName in variables) { \n if (config[varName]) throw new Error('config already holds a variable ' + varName + ' aborting ...'); \n       config[varName] = variables[varName]; \n    }\n\nmodule.exports = config;";
   return configFileContent;
}



async function createConfigFile (config) {
   config = await createConfigJson(config);
   const newConfig = await isConfigOkLoop(config);
   return newConfig;
};

// create a custom config file or copy on from the defaults
async function chooseEnvirnonment (configPath, defaultConfig) {

   if (!configPath) log.critical('projectPath is undefined!');

   const answer = await prompt([{
      type: 'select',
      name: 'environment',
      message: 'Use config environment:',
      initial: 0,
      choices: [
         { title: 'default', value: 'enviroment' },
         { title: 'development', value: 'enviroment-dev' },
         { title: 'production', value: 'enviroment-prod' },
         { title: 'custom', value: 'custom' }
      ]}]);

   if (answer.environment === 'custom') {
      var config = await createConfigFile(defaultConfig);
      var configFileContent = await createFileContet(config);
      // read file and return config
      fs.writeFileSync(configPath, configFileContent, {flags: 'w'});
      return config;
   // use a default environment file
   } else {
      sh('grunt copy:' + answer.environment); // copy
      return require(configPath); // get content
   }
};


function sh (cmd, infomessage) {
   if (infomessage) log.info(infomessage);
   log.info('executing ', cmd);
   shell.exec(cmd);
}


module.exports = chooseEnvirnonment;


// install node
// npm install
// start install script

// start configuration

// read all config files
// dialog
//    use a default config?
//    custom => create config file
// install
