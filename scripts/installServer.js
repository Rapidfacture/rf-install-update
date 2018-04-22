
function install (options, path) {
   var opts = _.merge(defaulOptions, options);
   printInstallationHeader(path);
   pull(opts);
   build(opts);
   configure(opts, 'force');
   pm2Startup();
}



# get app name
. 'shell/function/packageJsonValue.sh'
name="$(packageJsonValue name)"


# show install screen
. 'shell/function/installScreen.sh'


# check and install external dependencies
. 'shell/function/installExternalDependencys.sh'


# get dependencies
printf "Get npm packages ... \n"
npm install


# db config
printf "configure db to localhost \n"
grunt copy:enviroment


# db config
printf "create mail templates \n"
grunt copy:mail


# build
. 'shell/function/build.sh'
buildProd


# start app
printf "Starting process with pm2 \n\n"
pm2 start server.js --name $name


# start app on every system start
if [ "$1" = "--continue" ]; then
    printf "continue installation \n\n"
else
   . 'shell/function/pm2Startup.sh'
   $SHELL # quit and leave terminal open to see output
fi

# byebye!
exit 0
