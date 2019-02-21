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
updateProject cad prod force
updateProject login prod force
updateProject website prod force
# updateProject STEPImport prod force


exit 0
