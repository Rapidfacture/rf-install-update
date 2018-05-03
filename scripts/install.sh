# NODE.JS ###################
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
if hash node 2>/dev/null; then
    echo "node is installed. Fine."
else
    echo "could not find node, try to install it."
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "\n"

npm install

# get project path
cd ..
projectPath=$(pwd)

# echo $projectPath
# echo "console.log('$projectPath');" | node

# exec node script
installPath="tmpInstall.js"

echo "require('rf-install-update').install.start('$projectPath');" > $installPath
node $installPath
rm -R $installPath

exit 0
