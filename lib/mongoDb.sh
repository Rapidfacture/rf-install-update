#!/bin/bash

# example: exportMongoDbToJson cad /server/dbSampleData


# export all collections from one local mongoDB to json files
mongoExportDb(){

   if [ ! $1 ]; then
           echo " Example of use: $0 database_name [dir_to_store]"
           exit 1
   fi
   db=$1
   out_dir="$2/$1"
   if [ ! $out_dir ]; then
           out_dir="./"
   else
           mkdir -p $out_dir
   fi

   tmp_file="fadlfhsdofheinwvw.js"
   echo "print('_ ' + db.getCollectionNames())" > $tmp_file
   cols=`mongo $db $tmp_file | grep '_' | awk '{print $2}' | tr ',' ' '`
   for c in $cols
   do
      if [ $c != "system.indexes" ]; then
         echo $c
         mongoexport -d $db -c $c -o "$out_dir/${c}.json"
         # mongoexport -d $db -c $c -o "$out_dir/exp_${db}_${c}.json"
      fi
   done

   rm -R $tmp_file

}


# import all collections from json files in one folder
# usage example: mongoImportCollection /home/felix/RAPIDFACTURE/Git/CAM/server/dbSampleData/cad --drop
mongoImportDb() {
   path=$1
   drop=$2
   host=$3
   dbName="$(basename $path)"

   for jsonFilePath in $path/*.json ;
   do
      jsonFileName="$(basename $jsonFilePath .json)"
      echo "\n mongoimport: db $dbName, collection $jsonFileName from file $jsonFilePath"
      mongoimport $drop --db $dbName --collection $jsonFileName --file $jsonFilePath --host $host
   done
}



# mongorestore
# restore a whole db with all collections to bson
# recommendation: use direct in code
#
# mongorestore -d $dbName $dbFolderpath --host $host --drop
# example: mongorestore -d dev_jobs MONGODB/dev_jobs --host $host --drop
# operand "--drop": overwrites old DB


# mongodump
# save db with all collections as bson files
# recommendation: use direct in code
#
# example: mongodump -o server/dbSampleData/
