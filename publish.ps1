Remove-item .\dist -Recurse
npm run build
copy .\package.json .\dist\package.json
pushd .\dist
npm publish .
