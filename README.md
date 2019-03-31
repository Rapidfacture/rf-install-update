# rf-install-update
Installation and update tools for rapidfacture software

## main functions
* install
* update

Node has to be installed so the package can be fetched with npm. The functions are started like below, but usually from a shell script within your project (folder `scripts` in rf-install-update)

```js
// update
require('rf-install-update').update.start('yourProjectPath')


// install
require('rf-install-update').install.start('yourProjectPath')

```

### utils
Those functions can be used:
* chooseEnvirnonment
* checkExternalDependencies
* ifPullIsNeededThen
* pull
* npmInstall
* build
* updateEnvironmentConfig
* updateMailConfig
* printInstallationHeader
* pm2Startup
* pm2ResartAll


### Updates can be done according to specified environmental file

```js

var config = {

   // usual network config
   "db": {
      "global": "mongodb://localhost:27017/global",
      "user": "mongodb://localhost:27017/user"
   },
   "port": 3004,


   // these options are used to update the project
   "update": {
      // environment options
      'branch': 'master',
      'compress': false, // minifie html, js, css
      'environment': 'environment',
      'mailTemplates': 'mail',

      // update options
      'forcePull': false, // overwrite local changes
      'refreshConfig': false, // overwrite environment config with fresh one from git
      'refreshMailTemplates': false, //  overwrite mail templates with fresh one from git
      'refreshDatabase': false //  NOTE: critical - for local dev or on system install; overwrite database samples
   }
};


```

## building custom install scripts for external programs

```js
const checkAndInstall = require('rf-install-update').checkAndInstall;

// install via shell command
checkAndInstall('inkscape', 'sudo apt-get install inkscape');

// install via function
checkAndInstall('programme XY', function(shell, cmd){ console.log('now installing ' + cmd);});
```


## Development
Currently no tests implemented.
You might edit the package included in a standard app, check functionality, then update the package.


## ToDo
* maybe do a `npm rebuild node-sass`?


## Legal Issues
* Licenese: MIT
* Author: Felix Furtmayr
