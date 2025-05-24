@echo off
echo Cleaning project...

echo Cleaning web-app...
cd web-app
if exist node_modules rmdir /s /q node_modules
if exist client\node_modules rmdir /s /q client\node_modules
del /f /q package-lock.json
del /f /q client\package-lock.json
cd ..

echo Cleaning chaincode...
cd chaincode
if exist node_modules rmdir /s /q node_modules
del /f /q package-lock.json
cd ..

echo Cleaning complete!
echo Please run 'npm run install-all' to reinstall dependencies 