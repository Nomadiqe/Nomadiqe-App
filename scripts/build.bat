@echo off
echo 🚀 Starting build process...

REM Install dependencies
echo 📦 Installing dependencies...
call pnpm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call pnpm prisma generate

REM Build the application
echo 🏗️ Building the application...
call pnpm run build

echo ✅ Build completed successfully!
pause
