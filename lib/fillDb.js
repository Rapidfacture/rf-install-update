/** script to init the database
 * @example
 *
 */


module.exports = {
   fillDb
};


function fillDb (config, callback) {

   const path = require('path');
   let schemaPath = path.join(__dirname, '../../../server/schemas');
   let fillLocalDbScriptPath = path.join(__dirname, '../../../shell/fillLocalDb.sh');

   // start global 'config'

   let log = require('rf-log').start(`[setGlobalUrl]`);
   let async = require('async');
   const { execSync } = require('child_process');
   const prompts = require('prompts');


   // init databases
   let mongooseMulti = require('mongoose-multi');

   let db;

   let loginUrl = 'http://localhost:3004';


   async.waterfall([
      prompt,
      fillLocalDb,
      getGlobalSettings,
      setGlobalSettings
   ], function (err, docs) {
      if (err) {
         log.error(err);
         callback(err);
      } else {
         let msg = 'updated login url with ' + loginUrl;
         log.success(msg);
         callback(null, msg);
      }
   });


   function prompt (callback) {
      prompts({
         type: 'text',
         name: 'Login URL',
         message: 'Type in the url of the login project (as ist should be reached in production like "https://login.rapidfacture.com"). After the command line installation go to this url and start to configure the project'
      }, {onSubmit: function (form, value) {
         // console.log(value);
         loginUrl = value;
         callback();
      }});
   }



   function fillLocalDb (callback) {
      log.info('import database settings');
      execSync(fillLocalDbScriptPath);
      log.success('imported database settings');
      callback();
   }


   function getGlobalSettings (callback) {

      db = mongooseMulti.start(config.db, schemaPath);

      db.global.mongooseConnection.once('open', function () {
         db.global.settings
            .findOne({
               'name': 'global'
            }, function (err, data) {
               callback(err, data);
            });
      });
   }

   function setGlobalSettings (setting, callback) {

      if (!setting || !setting.settings || !setting.settings.apps) return callback('incomplete global settings ', setting);

      setting.settings.apps['rf-app-login'].urls.main = loginUrl;

      db.global.settings
         .findOneAndUpdate({
            'name': 'global'
         }, setting, {
            upsert: true,
            new: true
         }, callback);
   }
}
