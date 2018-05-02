# start the node install script

# get project path
cd ..
projectPath=$(pwd)

# echo $projectPath
# echo "console.log('$projectPath');" | node

# exec node script
# exec node script
installPath="tmpInstall.js"

echo "require('rf-install-update').update.start('$projectPath');" > $installPath
node $installPath
rm -R $installPath
