// idea: promt user for info to create a custom environment config file

// var log = require('rf-log');



// const questions = [
//    {
//       type: 'text',
//       name: 'twitter',
//       message: `What's your twitter handle?`,
//       initial: 'terkelg',
//       format: v => `@${v}`
//    },
//    {
//       type: 'number',
//       name: 'age',
//       initial: 12,
//       message: 'How old are you?'
//    },
//    {
//       type: 'confirm',
//       name: 'confirmed',
//       message: 'Can you confirm?'
//    },
//    {
//       type: 'select',
//       name: 'color',
//       message: 'Pick a color',
//       choices: [
//          { title: 'Red', value: '#ff0000' },
//          { title: 'Green', value: '#00ff00' },
//          { title: 'Blue', value: '#0000ff' }
//       ]
//    }
// ];



// {
//    type: 'select',
//    name: 'branch',
//    message: 'Select a default configuration:',
//    initial: 0,
//    choices: [
//       { title: 'default', value: 'enviroment' },
//       { title: 'development', value: 'enviroment-dev' },
//       { title: 'production', value: 'enviroment-prod' },
//       { title: 'custom', value: 'enviroment-prod' }
//    ]
// }



const { prompt } = require('prompts');

function getEnvirnonmentOptions () {
   return prompt([{
      type: 'select',
      name: 'mail',
      message: 'Which mail templates should be used?',
      initial: 0,
      choices: [
         { title: 'default', value: 'enviroment' },
         { title: 'development', value: 'enviroment-dev' },
         { title: 'production', value: 'enviroment-prod' },
         { title: 'custom', value: 'enviroment-prod' }
      ]}, {
      type: 'confirm',
      name: 'compress',
      message: 'Should your frontend code (HTML, CSS, JS) be minified?',
      initial: false
   }]);
};

function getUpdateOptions () {
   return prompt([{
      type: 'select',
      name: 'branch',
      message: 'Select a branch to pull updates from:',
      initial: 0,
      choices: [
         { title: 'master', value: 'master' },
         { title: 'stable', value: 'stable' }
      ]}, {
      type: 'confirm',
      name: 'forcePull',
      message: 'Force "git pull" (= overwrite local changes, recommended for server auto update',
      initial: false
   }, {
      type: 'confirm',
      name: 'refreshConfig',
      message: 'Auto update environment configuration? Warning: Will overwrites custom config',
      initial: false
   }, {
      type: 'confirm',
      name: 'refreshMailTemplates',
      message: 'Auto update mail configuration? Warning: Will overwrites custom config',
      initial: false
   }]);
}



(async function () {

   const answers1 = await getEnvirnonmentOptions();
   console.log(answers1);
   const answers2 = await getUpdateOptions();
   console.log(answers2);

})();



// 'update': {
//    // environment options
//    'branch': 'stable',
//    'compress': false, // minifie html, js, css
//    'environment': 'enviroment-prod',
//    'mailTemplates': 'mail-prod',
//
//    // update options
//    'forcePull': true, // overwrite local changes
//    'refreshConfig': true, // overwrite enviroment config with fresh one from git
//    'refreshMailTemplates': true, //  overwrite mail templates with fresh one from git
//    'refreshDatabase': false //  NOTE: critical - for local dev or on system install; overwrite database samples
// }
