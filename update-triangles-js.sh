# Build triangles
echo 'Building triangles...'
cd ./triangles
npm run build;
RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo 'Triangles build failed'
  return 1
fi
echo 'Build succeeded. Moving file.'
cd ..
cp ./triangles/index.js ./src/public/triangles/index.js
