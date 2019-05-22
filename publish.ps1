Remove-item .\cjs -Recurse
Remove-item .\dist -Recurse
rm *.tsbuildinfo
npm run build
npm test
# npm version patch
npm publish .
