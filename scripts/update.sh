# start the node install script

# get project path
cd ..
projectPath=$(pwd)

# echo $projectPath
# echo "console.log('$projectPath');" | node

# exec node script
echo "require('rf-install-update').update.start('$projectPath');" | node
