// idea: promt user for info to create a custom environment config file

// var confirm = require('inquirer-confirm');
// var log = require('rf-log');
// var commandExists = require('command-exists');
// var shell = require('shelljs');



const prompts = require('prompts');

let questions = [
    {
        type: 'text',
        name: 'username',
        message: 'What is your GitHub username?'
    },
    {
        type: 'number',
        name: 'age',
        message: 'How old are you?'
    },
    {
        type: 'text',
        name: 'about',
        message: 'Tell something about yourself',
        initial: 'Why should I?'
    }
];

let response = await prompts(questions);

console.log(response); // => { value: 23 }


'update': {
   // environment options
   'branch': 'stable',
   'compress': false, // minifie html, js, css
   'environment': 'enviroment-prod',
   'mailTemplates': 'mail-prod',

   // update options
   'forcePull': true, // overwrite local changes
   'refreshConfig': true, // overwrite enviroment config with fresh one from git
   'refreshMailTemplates': true, //  overwrite mail templates with fresh one from git
   'refreshDatabase': false //  NOTE: critical - for local dev or on system install; overwrite database samples
}
