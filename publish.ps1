Remove-item .\cjs -Recurse
Remove-item .\esm -Recurse
Remove-item .\dist -Recurse
npm run build
npm test
# npm version patch
npm publish .
