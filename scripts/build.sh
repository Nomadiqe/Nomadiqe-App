#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm prisma generate

# Build the application
echo "🏗️ Building the application..."
pnpm run build

echo "✅ Build completed successfully!"
