/** script to init the database
 * @example
 *
 */


module.exports = {
   fillDb
};


function fillDb (callback) {

   // start global 'config'
   let config = require('../config/conf/config.js');

   // start 'log'
   let log = require('rf-log').start(`[setGlobalUrl]`);
   let async = require('async');
   const { execSync } = require('child_process');
   const path = require('path');
   const prompts = require('prompts');



   // init databases
   let mongooseMulti = require('mongoose-multi');
   let schemaPath = path.join(__dirname, '../server/schemas');
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
         message: 'Please type in the url of the login project'
      }, {onSubmit: function (form, value) {
         // console.log(value);
         loginUrl = value;
         callback();
      }});
   }



   function fillLocalDb (callback) {
      log.info('import database settings');
      execSync(path.join(__dirname, '/fillLocalDb.sh'));
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
