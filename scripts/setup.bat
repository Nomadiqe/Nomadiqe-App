@echo off
echo 🚀 Setting up Nomadiqe Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm...
    npm install -g pnpm
)

echo ✅ pnpm version:
pnpm --version

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local file...
    copy env.example .env.local
    echo ⚠️  Please update .env.local with your configuration values
    echo    - Database URL
    echo    - NextAuth secret
    echo    - Google OAuth credentials
    echo    - Stripe keys
    echo    - Coinbase Commerce keys
) else (
    echo ✅ .env.local already exists
)

REM Generate Prisma client
echo 🗄️  Generating Prisma client...
pnpm db:generate

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your configuration
echo 2. Set up your PostgreSQL database
echo 3. Run: pnpm db:push
echo 4. Run: pnpm db:seed (optional)
echo 5. Run: pnpm dev
echo.
echo 🌐 Open http://localhost:3000 to view the application
pause
