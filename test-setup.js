#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏠 Real Estate Properties Management System - Setup Test\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
const backendPath = path.join(process.cwd(), 'backend', 'RealEstate.API', 'RealEstate.API.csproj');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

if (!fs.existsSync(backendPath)) {
  console.error('❌ Error: Backend project not found. Please ensure the backend directory structure is correct.');
  process.exit(1);
}

console.log('✅ Project structure looks good\n');

// Test Node.js and npm
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js not found. Please install Node.js 18+');
  process.exit(1);
}

try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm not found. Please install npm');
  process.exit(1);
}

// Test .NET
try {
  const dotnetVersion = execSync('dotnet --version', { encoding: 'utf8' }).trim();
  console.log(`✅ .NET version: ${dotnetVersion}`);
} catch (error) {
  console.error('❌ .NET not found. Please install .NET 8 SDK');
  process.exit(1);
}

console.log('\n🎉 All prerequisites are installed!');
console.log('\nNext steps:');
console.log('1. Run "npm install" to install frontend dependencies');
console.log('2. Run "cd backend/RealEstate.API && dotnet restore" to restore backend packages');
console.log('3. Start MongoDB (local or cloud)');
console.log('4. Run "cd backend/RealEstate.API && dotnet run" to start the backend');
console.log('5. Run "npm run dev" to start the frontend');
console.log('\nFor detailed instructions, see setup.md or README.md');
