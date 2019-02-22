updateProject(){
   folderPrefix="/opt/rapidfacture/"
   folderName=$1
   printf "updating project $folderName ... \n"
   cd $folderPrefix$folderName"/shell"
   echo $(./update.sh $2 $3)
   echo ""
   cd ..
   cd ..
}

# list of projects to be updated
updateProject cad
updateProject login
updateProject website
# updateProject STEPImport


exit 0
