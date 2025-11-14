#!/bin/bash

# Script to replace NextAuth imports with Supabase in all TSX files

FILES=(
  "./components/onboarding/steps/ProfileSetup.tsx"
  "./components/onboarding/steps/host/ListingWizard.tsx"
  "./components/onboarding/steps/host/CollaborationSetup.tsx"
  "./components/onboarding/steps/RoleSelection.tsx"
  "./components/onboarding/steps/guest/InterestSelection.tsx"
  "./components/onboarding/steps/influencer/ProfileMediaKit.tsx"
  "./components/onboarding/steps/influencer/SocialMediaConnect.tsx"
  "./components/onboarding/OnboardingFlow.tsx"
  "./components/post-comments.tsx"
  "./components/points/PointsDisplay.tsx"
  "./components/points/DailyCheckIn.tsx"
  "./app/messages/[id]/page.tsx"
  "./app/messages/page.tsx"
  "./app/host/create-property/page.tsx"
  "./app/create-post/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Replace import
    sed -i "s/import { useSession } from 'next-auth\/react'/import { useSupabase } from '@\/components\/providers\/supabase-auth-provider'/g" "$file"
    # Replace hook usage
    sed -i "s/const { data: session } = useSession()/const { user } = useSupabase()/g" "$file"
    # Replace session?.user?.id with user?.id
    sed -i "s/session?.user?.id/user?.id/g" "$file"
    # Replace session?.user with user
    sed -i "s/session?.user/user/g" "$file"
    # Replace session.user with user
    sed -i "s/session\.user/user/g" "$file"
  fi
done

echo "✅ Done! Replaced NextAuth with Supabase in all files."







