
function install (options, path) {
   var opts = _.merge(defaulOptions, options);
   printInstallationHeader(path);
   pull(opts);
   build(opts);
   configure(opts, 'force');
   pm2Startup();
}




# show install screen
. 'shell/function/installScreen.sh'


# check and install external dependencies
. 'shell/function/installExternalDependencys.sh'


# get dependencies
printf "Get npm packages ... \n"
npm install


# db config
printf "configure db to localhost, enable demo account credentials on login site \n"
grunt copy:enviroment-dev


# db config
printf "create mail templates \n"
grunt copy:mail


printf "\n
Installation finished. \n
Run 'grunt' in terminal of the project folder to start development. \n
This will build the application and run it on a webserver which will restart on your code changes."


# leave terminal open to see output; executed on PC via double click
$SHELL
