#!/bin/bash

# ensure right folder path
if [ $(basename $(pwd)) = "shell" ]; then
    cd ..
fi

# import
. 'shell/function/mongoDb.sh'


backupFolder="./server/SAMPLE/MONGODB/"

mongoExportDb jobs $backupFolder
mongoExportDb materials $backupFolder
mongoExportDb production $backupFolder

mongoExportDb test_drawing $backupFolder
mongoExportDb test_jobs $backupFolder
mongoExportDb test_materials $backupFolder
mongoExportDb test_production $backupFolder
