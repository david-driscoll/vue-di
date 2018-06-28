Remove-item .\dist -Recurse
npm run build
gci .\dist\src | Copy-Item -Destination .\dist -Recurse -Force
Remove-Item .\dist\test -Recurse
Remove-Item .\dist\src -Recurse

copy .\package.json .\dist\package.json
pushd .\dist
# npm publish .
popd
