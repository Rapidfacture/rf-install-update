#!/bin/bash

# ensure that script is executed from the root folder
if [ "$(basename $(pwd))" = "shell" ] ; then
    echo "stepping outside shell folder"
    cd ..
fi


host='localhost:27017'
filePath='config/dbSampleData/'
backupPath="$(pwd)/$filePath*"
# something like: /home/felix/RAPIDFACTURE/Git/CAM/server/dbSampleData/*

drop=""
if [ $1="--drop" ]; then
    drop="--drop"
fi
. 'shell/function/mongoDb.sh'


# import certain collection:
# mongoImportDb '$backupPath/dev_jobs' $drop
# mongoImportDb '$backupPath/dev_materials' $drop

# https://stackoverflow.com/a/28938235/2597135
RED='\033[1;31m' # bold
GREEN='\033[1;32m' # bold
NC='\033[0m' # No Color

HAS_FAILED=0
# default: restore all databases
for path in $backupPath
do
   mongoImportDb $path $drop $host
   # detect error
   if [[ $? -ne 0 ]] ; then
      HAS_FAILED=1
      echo -e "${RED}File import failed: ${path}${NC}"
   fi
done

# WARN if there was ANY error
if [[ "${HAS_FAILED}" -ne "0" ]] ; then
    echo -e "${RED}============================================================${NC}"
    echo -e "${RED}= At least one file import failed ! See above for details !=${NC}"
    echo -e "${RED}============================================================${NC}"
else
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}= MongoDB sample import was successful !=${NC}"
    echo -e "${GREEN}=========================================${NC}"

fi

$SHELL
