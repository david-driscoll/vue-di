Remove-item .\dist -Recurse
npm run build
npm test

npm publish .
