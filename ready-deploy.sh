# Build triangles
sh ./update-triangles-js.sh

echo "Building main site"
cd ./src
npm run build

RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo 'Site build failed'
  return 1
fi
cd ..

echo 'Deleting old CSS'
rm ./css/app.*.css
echo 'Copying new CSS'
cp ./src/dist/css/app.*.css ./css/
cp ./src/dist/css/style.css ./css/

echo 'Deleting old JS'
rm ./js/app.*
rm ./js/chunk-vendors.*
echo 'Copying new JS'
cp ./src/dist/js/app.* ./js/
cp ./src/dist/js/chunk-vendors.* ./js/

echo 'Copying HTML'
cp ./src/dist/index.HTML .

echo 'Done'