-- ============================================
-- NEON TO SUPABASE MIGRATION SQL
-- Generated: 2025-11-11T19:39:35.633Z
-- ============================================

-- ============================================
-- USERS (37 records)
-- ============================================

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('907b6258-3943-4b9a-acf0-e3cad59899d6', 'matt@bedda.tech', NULL, 'Matthew Whitney', 'Matthew J. Whitney', 'matt_bedda', 'Co-Founder of Nomadiqe', 'Scottsdale, AZ', '+14802095975', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/avatar-underwater-1760970372581-0aexcf-QiJLzTmj1N58yflTlPGWCNC8onbxIy.jpg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/avatar-underwater-1760970372581-0aexcf-QiJLzTmj1N58yflTlPGWCNC8onbxIy.jpg', NULL, 'GUEST', 'COMPLETED', '2025-10-20T12:01:08.701Z', '2025-11-03T15:42:18.162Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('9fdc53df-a0d9-44ef-8c1e-5f031d67ef99', 'testuser20251020@test.com', NULL, NULL, 'Test User', 'testuser2025', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', '2025-10-20T12:14:58.503Z', '2025-11-03T15:42:18.108Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'luca@metatech.dev', NULL, 'Luca Corrao', 'Luca Corrao', 'lucacorraos', 'Tech entrepreneur, Nomadiqe Founder, Bedda.tech Co founder, Sicilian Host, Enthusiastic. ', 'Terrasini-Phoenix, Italia-Stati Uniti', '+39 3513671340', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1993-1761157490706-01n7ea-thNFH8BOd55fXqjKDU8FpDR40iTZoY.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1993-1761157490706-01n7ea-thNFH8BOd55fXqjKDU8FpDR40iTZoY.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/suitefesta-1762542330210-bptdk0-rm5phARgNqPy3yLD6cY0SAMvi4T0pc.jpg', 'HOST', 'COMPLETED', '2025-10-20T12:30:53.682Z', '2025-11-07T18:05:53.614Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('d6c5a332-3a0b-42dc-acf0-38b3377f0277', 'matthewjwhitney@gmail.com', NULL, 'Matthew Whitney', NULL, NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJMzZL7DHeJDWflIXiZKO8Vx_NOw-pP66K6Ki-TCc_Kmq_dG_-glQ=s96-c', NULL, NULL, 'GUEST', 'PENDING', '2025-10-20T12:39:35.708Z', '2025-11-03T15:42:18.217Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('05dd6938-ed20-4141-ab9c-59e07558f022', 'matt@metatech.dev', NULL, 'Matthew Whitney', 'Test User', 'testuser', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', '2025-10-20T15:10:41.206Z', '2025-11-03T15:42:18.056Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('7d03dbfb-2ad6-45c1-98e2-6ef03b89db5e', 'sevkaurr@gmail.com', NULL, 'Sevara Ur', 'Sevara Urman', 'sevkaur', 'Based in Rome, Italy, and often travel to some of the most beautiful and iconic locations worldwide and would like to take amazing content for you. Your property can be showcased through aesthetic content that grabs attention and increases visibility. With the ability to speak multiple languages, connecting with diverse audiences becomes effortless. Feel free to contact me!', 'Rome, Italy', '', 'https://lh3.googleusercontent.com/a/ACg8ocJgHWMpSb5-WXyCVyzDf_D6Y1bC2z-sX1AQEcAjhAwpxXO_xEo=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJgHWMpSb5-WXyCVyzDf_D6Y1bC2z-sX1AQEcAjhAwpxXO_xEo=s96-c', NULL, 'GUEST', 'COMPLETED', '2025-10-27T14:56:59.104Z', '2025-11-03T15:42:18.434Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('7ae70c46-05ea-4857-bc5a-5feaf6c055c9', 'matteolorso@gmail.com', NULL, 'Matthew Whitney', 'Matteo L''Orso', 'matteolorso', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJPZ4VPw-nD7KvS-LpVv0ntXJBt7VaRDGA3gzpftWP49Ulm=s96-c', NULL, NULL, 'INFLUENCER', 'COMPLETED', '2025-10-28T00:26:58.863Z', '2025-11-03T15:42:18.381Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('936d7aca-49cf-429d-821d-d4bf0a6de8c4', 'maniacifara66@gmail.com', NULL, 'Fara Maniaci', 'Farà Maniaci', 'faramaniaci', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocL5GVtfo-O5_92j5l3Xj5OEFRvzyVPzD3iaqDRk56N0YrgpGg=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocL5GVtfo-O5_92j5l3Xj5OEFRvzyVPzD3iaqDRk56N0YrgpGg=s96-c', NULL, 'INFLUENCER', 'COMPLETED', '2025-10-28T02:22:02.877Z', '2025-11-03T15:42:18.542Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('dcf301ec-2d08-405c-a581-ac766a2001c9', 'lucacorrao1m@gmail.com', NULL, 'Luca', 'Luca influencer test', 'test', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJyaSjV8PH6CkOfsb0i-_0s-q-qtaGAlYwvJUp6EHC0DEQouw=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJyaSjV8PH6CkOfsb0i-_0s-q-qtaGAlYwvJUp6EHC0DEQouw=s96-c', NULL, 'GUEST', 'IN_PROGRESS', '2025-10-28T10:45:40.432Z', '2025-11-07T18:14:35.190Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('64022988-ee3e-4d98-b77f-d95c454a75cb', 'matt+1@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T14:02:49.472Z', '2025-11-03T15:42:18.328Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('9b4e4a5f-813a-48f3-b4eb-5e41c155319c', 'testinfluencer@nomadiqe.test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T14:37:14.403Z', '2025-11-03T15:42:18.490Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('0f3b6130-9d98-4bdb-9ac8-6157cacbd8e4', 'matt+2@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TRAVELER', 'PENDING', '2025-10-28T14:56:34.672Z', '2025-11-03T15:42:18.704Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('bae264c3-d9f2-4015-9470-4bc62a04cf4a', 'matt+3@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T14:57:16.266Z', '2025-11-03T15:42:18.765Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('800be14b-bb4f-46a7-bdf6-32547e45ea78', 'testinfluencer2@nomadiqe.test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T15:02:22.955Z', '2025-11-03T15:42:18.597Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('98420a63-1e54-41b2-beff-e3e5558356e7', 'matt+4@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T15:29:48.584Z', '2025-11-03T15:42:18.870Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('35b43038-7a1c-4008-88bc-8a0310d7ab40', 'testinfluencer@test.com', NULL, NULL, 'Test Influencer', 'test_influencer', NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'COMPLETED', '2025-10-28T15:47:41.023Z', '2025-11-03T15:42:18.650Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('21314c11-42a7-4ceb-8ad2-24c2c3b7a98a', 'testhost@test.com', NULL, NULL, 'Test Host', 'test_host', NULL, NULL, NULL, NULL, NULL, NULL, 'HOST', 'IN_PROGRESS', '2025-10-28T15:58:56.725Z', '2025-11-03T15:42:18.818Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('faf0e89a-2414-4c29-bebb-06aa118d0eaf', 'testguest@test.com', NULL, NULL, 'Test Guest', 'test_guest', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', '2025-10-28T16:03:04.430Z', '2025-11-03T15:42:18.975Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('6b42cea9-ce54-4339-8fc0-fa61c9987847', 'facevoiceai@gmail.com', NULL, 'FaceVoiceAi', 'Face', 'voice', 'Next-gen AI truth detection! Facial expressions & voice tone analysis Decentralized & transparent verification Telegram: http://t.me/FaceVoiceAi', 'Los Angeles', '', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/modified-image-1761799637758-52ad2c-fK4r3FsaO0iTPDCYyLmQcWnZWmBET5.png', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/modified-image-1761799637758-52ad2c-fK4r3FsaO0iTPDCYyLmQcWnZWmBET5.png', NULL, 'GUEST', 'COMPLETED', '2025-10-28T16:13:50.673Z', '2025-11-03T15:42:19.301Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('65a4c75e-5478-43ab-ae0c-9c2b52726d76', 'lucacorrao96@outlook.it', NULL, NULL, 'Host test', 'hosttest', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2476-1761672497159-m2vbt5-rKSadRIylq4AVEprZ269qa8rwIWudq.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2476-1761672497159-m2vbt5-rKSadRIylq4AVEprZ269qa8rwIWudq.jpeg', NULL, 'INFLUENCER', 'IN_PROGRESS', '2025-10-28T16:27:31.865Z', '2025-11-03T15:42:18.922Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('ef760284-69eb-4c45-ae78-49babf2fcc2e', 'sevkaurr1@gmail.com', NULL, NULL, 'Sevara Urman', 'sevkaur1', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2888-1761673210825-vw5plv-jc2amNfz3LAKBPXqb6w0w9pk2YB1nc.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2888-1761673210825-vw5plv-jc2amNfz3LAKBPXqb6w0w9pk2YB1nc.jpeg', NULL, 'INFLUENCER', 'COMPLETED', '2025-10-28T16:39:53.230Z', '2025-11-09T17:10:35.222Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('bb6a0ec7-f4e6-418a-b8e1-b6aa90cd2808', 'alex.chatzis@web.de', NULL, NULL, 'Alex De Biase', 'alexdebiase', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/58fcadd7-5fb8-446a-b135-6eb503-1761747564632-j6cao5-oeV6EjJpPNwyliDRVzmG5HzhjLR7Wz.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/58fcadd7-5fb8-446a-b135-6eb503-1761747564632-j6cao5-oeV6EjJpPNwyliDRVzmG5HzhjLR7Wz.jpeg', NULL, 'GUEST', 'COMPLETED', '2025-10-29T13:16:35.261Z', '2025-11-03T15:42:19.137Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('0564ba8e-f44c-484b-90d9-ffe0741aef7d', 'lucacorrao1996@gmail.com', NULL, 'Luca Corrao', 'lucas suite', 'lucacorraoss', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/image-url-1761798867379-oin3hx-19t9oowpEmza1JkHLbzzXU4hz7NXlM.jpg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/image-url-1761798867379-oin3hx-19t9oowpEmza1JkHLbzzXU4hz7NXlM.jpg', NULL, 'INFLUENCER', 'IN_PROGRESS', '2025-10-29T20:50:59.843Z', '2025-11-06T14:03:09.352Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('cd60ba73-cd0c-4e9c-bc4a-b466325c33b3', 'matt+10@bedda.tech', NULL, NULL, 'Test User', 'testuser123', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'PENDING', '2025-10-29T23:44:50.361Z', '2025-11-03T15:42:19.248Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('156a65dd-f4d4-456c-b550-40ac51d906ef', 'marcogodi96@gmail.com', NULL, 'Marco Godi', 'marcocreatortest', 'marcocreatortest', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJyRIhAYztLvDZUNIpOZksS4jVUV9w8Id0CczBnJG-mxrdtMQ=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJyRIhAYztLvDZUNIpOZksS4jVUV9w8Id0CczBnJG-mxrdtMQ=s96-c', NULL, 'INFLUENCER', 'COMPLETED', '2025-10-30T03:02:48.800Z', '2025-10-30T03:05:21.460Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('5ffb2460-047a-4249-8896-fdf95f5d410b', 'host1@nomadiqe.com', NULL, 'Marco Rossi', NULL, NULL, 'Passionate about sharing the beauty of the Alps with travelers from around the world. Local expert and mountain enthusiast.', 'Zermatt, Switzerland', '+41 27 966 81 00', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'HOST', 'PENDING', '2025-10-30T16:52:54.240Z', '2025-11-03T15:42:17.945Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('2fb70d26-96e4-4238-bd0b-9eaa00963234', 'host2@nomadiqe.com', NULL, 'Sophie Chen', NULL, NULL, 'Architecture lover and city explorer. I help travelers discover the best urban experiences in Barcelona.', 'Barcelona, Spain', '+34 93 285 38 32', 'https://images.unsplash.com/photo-1494790108755-2616b332c7e0?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'HOST', 'PENDING', '2025-10-30T16:52:54.750Z', '2025-11-03T15:42:19.360Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('1fdc3c1f-fbb8-47af-87e6-b2deb5273759', 'traveler1@nomadiqe.com', NULL, 'Alex Johnson', NULL, NULL, 'Digital nomad and adventure seeker. Love exploring new cultures and sharing travel experiences.', 'Currently in Europe', '+1 555 123 4567', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'TRAVELER', 'PENDING', '2025-10-30T16:52:55.065Z', '2025-11-03T15:42:19.414Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('dd7adf28-05b5-429f-938c-46f589c19eb4', 'traveler2@nomadiqe.com', NULL, 'Emma Wilson', NULL, NULL, 'Travel photographer and storyteller. Capturing memories one destination at a time.', 'London, UK', '+44 20 7946 0958', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'TRAVELER', 'PENDING', '2025-10-30T16:52:55.423Z', '2025-11-03T15:42:19.470Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('cae68d5f-045c-4c1a-8278-0eb9f84dc575', 'host3@nomadiqe.com', NULL, 'Raj Patel', NULL, NULL, 'Beachfront property owner with deep knowledge of Balinese culture and hidden gems.', 'Ubud, Bali', '+62 361 123456', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'HOST', 'PENDING', '2025-10-30T16:52:55.735Z', '2025-11-03T15:42:19.527Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('19936c20-bf7a-4d04-b15c-234e7f446c92', 'ofegaalex@gmail.com', NULL, NULL, 'Alex Jeffrey', 'youngking770', '', 'Nigeria ', '', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-215357-1761857655784-by9d4t-pbudXWiRNda48OYb4lfJAbmpL1QvXo.jpg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-215357-1761857655784-by9d4t-pbudXWiRNda48OYb4lfJAbmpL1QvXo.jpg', NULL, 'GUEST', 'COMPLETED', '2025-10-30T18:01:17.594Z', '2025-10-30T19:54:25.562Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('210d7830-a26c-429e-b838-c8f74daf3edc', 'mattia@metatech.dev', NULL, 'Mattia Orlando', 'Gian Franco Nomadico', 'gianfranconomadico', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLW5SvtzWoA4Ls46aT73UPTV77HgjpmAwZiUXQsW8iXZEF-YQ=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocLW5SvtzWoA4Ls46aT73UPTV77HgjpmAwZiUXQsW8iXZEF-YQ=s96-c', NULL, 'GUEST', 'COMPLETED', '2025-11-03T15:12:05.105Z', '2025-11-03T15:14:48.526Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('5bb9c1a7-0d32-44a5-bf4c-80df44f8755a', 'giuliam.anzalone22@gmail.com', NULL, 'Giuliam Haramis Anzalone', 'JH Graphic', 'jhgraphic', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLvEd_dhZSp7z-x1-8ktiTz-DAoMfumkdgloaBVRHGxn-iqCYIY=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocLvEd_dhZSp7z-x1-8ktiTz-DAoMfumkdgloaBVRHGxn-iqCYIY=s96-c', NULL, 'GUEST', 'COMPLETED', '2025-11-04T01:19:31.688Z', '2025-11-04T01:21:20.784Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('d22a7299-e9e5-431f-a0f5-e05b248e42e0', 'asdtenutagiacona@gmail.com', NULL, 'Magik End el KING', 'Villa Giacona Venuti', 'villagiaconavenuti', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIjgPtfXu0WDcO0_cbvMWFzCrp0tzLiPBB65E20QkX0hYUmQNyM=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocIjgPtfXu0WDcO0_cbvMWFzCrp0tzLiPBB65E20QkX0hYUmQNyM=s96-c', NULL, 'HOST', 'IN_PROGRESS', '2025-11-05T21:22:57.386Z', '2025-11-05T21:53:22.786Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('70394fa0-9ffd-4cbe-bf19-4442a00643f6', 'andrea.turano97@hotmail.com', NULL, NULL, 'Andrea', 'andrea1997', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2667-1762452859508-9212yr-cC8sabWQuNZnoyUC2r5SkTlwH7rdm4.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2667-1762452859508-9212yr-cC8sabWQuNZnoyUC2r5SkTlwH7rdm4.jpeg', NULL, 'INFLUENCER', 'COMPLETED', '2025-11-06T17:13:50.853Z', '2025-11-06T17:21:24.658Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('b9281602-f564-4c0a-ae68-1c1d39c0ea11', 'nottateurman@gmail.com', NULL, 'Ian Urman', 'Kei', 'isituian', '', 'Bishkek,Kyrgyzstan', '', 'https://lh3.googleusercontent.com/a/ACg8ocKF_gOUw3fFwJNL4bS4kQ_n1JJjdcP0JSS5j0auXCxmT2ZUDhLN=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocKF_gOUw3fFwJNL4bS4kQ_n1JJjdcP0JSS5j0auXCxmT2ZUDhLN=s96-c', NULL, 'HOST', 'COMPLETED', '2025-11-10T05:21:53.839Z', '2025-11-11T03:03:07.345Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('c56252d2-fca1-40a6-8ce6-b8bf45a70d38', 'deanurman08@gmail.com', NULL, 'Dean Urman', 'Kei', 'okeilol', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJ8VBSbDgXDtcVwymHCmApXExT_iYz35GSqgMUm_3rFrtuY4w=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJ8VBSbDgXDtcVwymHCmApXExT_iYz35GSqgMUm_3rFrtuY4w=s96-c', NULL, 'INFLUENCER', 'IN_PROGRESS', '2025-11-10T05:23:19.150Z', '2025-11-10T05:25:32.498Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";


-- ============================================
-- PROPERTIES (14 records)
-- ============================================

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('6f640b6d-8567-47ea-87b9-853bc092817c', '5ffb2460-047a-4249-8896-fdf95f5d410b', 'Cozy Mountain Cabin', 'Beautiful wooden cabin with stunning mountain views. Perfect for a peaceful retreat in the Swiss Alps.', 'HOUSE', 'Alpine Valley 123', 'Zermatt', 'Switzerland', 46.0207, 7.7491, 2, 1, 4, 120, 'EUR', ARRAY['WiFi','Kitchen','Fireplace','Mountain View','Parking']::text[], ARRAY['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], NULL, true, '2025-10-30T16:52:56.041Z', '2025-11-03T15:42:36.058Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('19837a78-0300-45b5-8908-4d9e6ebd8378', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'Lucas Suite', 'Camera confortevole a 50 metri dal centro di Terrasini, a 20 minuti da Palermo e 10 dall’aeroporto Falcone e Borsellino. 350 metri dalla spiaggia Praiola e 800 metri dalla spiaggia Magaggiari. ', 'HOUSE', 'Via Vito di Stefano 32', 'Terrasini ', 'Italy', 38.1519916, 13.0829289, 1, 1, 3, 70, 'EUR', ARRAY['wifi','airConditioning','heating','tv','refrigerator','coffeeMachine','workspace','shampoo','toiletPaper','hairDryer','iron','parking']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/image-1761414318404-lprcl6-ASlJbPmGPuM04pcLwAFBBhq6Pmtbwo.jpg']::text[], NULL, true, '2025-10-25T15:45:32.463Z', '2025-11-03T15:42:34.625Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('8024243c-1398-4b9e-b496-3fa85eff1a39', '0564ba8e-f44c-484b-90d9-ffe0741aef7d', 'Lucas Cottage', 'nice cottage near to trappeto and balestrare at 500 m from the sea, with shared infinity pool. ', 'HOUSE', 'via francesco crispi', 'trappeto', 'italia', 38.0651928, 13.0370385, 1, 1, 4, 200, 'EUR', ARRAY['wifi','airConditioning','heating','pool','shampoo','toiletPaper','hairDryer']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/lucas-cottage-pool-1-jpg-1761796876298-u23sn1-kYh4tKBJ0hdPM4MNQJn07CqXXzPrSu.jpg']::text[], NULL, false, '2025-10-30T03:01:28.874Z', '2025-10-30T03:01:28.874Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('7392dc81-7c4d-4249-99b5-77d1c1a92a08', '65a4c75e-5478-43ab-ae0c-9c2b52726d76', 'Host test 2025', 'Nice host test for host sign up loop bug. Trying to see if now is working well', 'HOUSE', 'Host test', 'Sicilia', 'Italia', 37.5160628, 15.0966867, 1, 1, 5, 100, 'EUR', ARRAY['wifi','airConditioning','heating','tv']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2496-1761672612133-vei15i-9FHMSBZt6PulwuOPxnUis0mQCqEkzv.png','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2477-1761672613248-oavwnd-NCbvgsK6gjlLfqGKnUWH2dkqIXWAmE.jpeg']::text[], NULL, false, '2025-10-28T16:30:29.482Z', '2025-11-03T15:42:34.968Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('564b18a2-11f0-48da-95d0-d814ed83c4fd', '65a4c75e-5478-43ab-ae0c-9c2b52726d76', 'Hajjjjjjjjjjd', 'Test test test test test test Test test test test test test Test test test test test test Test test test test test test ', 'HOUSE', 'Test', 'Test', 'Test', 50.9100776, -1.467459, 1, 1, 2, 75, 'EUR', ARRAY['wifi']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/9f4117e5-6c46-41f3-8623-d1a7ad-1761672881184-7fdcrk-0DLwi8DcZP6jjfov53cPjyqUNC1WhQ.jpeg']::text[], NULL, false, '2025-10-28T16:34:48.947Z', '2025-11-03T15:42:35.076Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('6407827c-d6c6-4b5e-9b4b-eacd9eb33684', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'Lucas rooftop', 'Piccola camera con bagno privato a 50 metri dalla piazza duomo di Terrasini e 350 metri dalla spiaggia Praiola. ', 'HOUSE', 'Via Vito di Stefano 32', 'Terrasini', 'Italy ', 38.1519916, 13.0829289, 1, 1, 3, 70, 'EUR', ARRAY['wifi','airConditioning','heating','tv','refrigerator','coffeeMachine','workspace','towels','shampoo','toiletPaper','hairDryer','iron','parking','privateEntrance']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/886e0f9c-6903-4995-9db6-1b9998-1761575389121-cvb675-A1UBYS5Wq0AnN0z012YjCZzGTav8On.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/d8bbad63-ad6f-409d-9ebf-6e5735-1761575391079-cg5nff-B3cdhfCrGNZ8F1URXmTlvMZtqRRXn4.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2192-1761575392192-a9jlgc-RrA8qBbXQGLZMNUwmORkMnKM9EV1Vr.jpeg']::text[], NULL, true, '2025-10-27T13:30:11.525Z', '2025-11-03T15:42:34.736Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('16d8b751-2dfe-4036-8b0f-ab084414de6a', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'Lucas Suite', 'A 30 metri da Piazza Duomo e 350 metri dal mare. Ideale per 2 persone. Caratterizzata da splendidi affreschi storici sui soffitti che si fondono con comfort moderni.
', 'HOUSE', 'Via Vito di Stefano 32', 'Terrasini', 'Italy', 38.1519916, 13.0829289, 1, 1, 3, 70, 'EUR', ARRAY['wifi','airConditioning','heating','tv','refrigerator','coffeeMachine','workspace','towels','shampoo','toiletPaper','hairDryer','iron','parking','privateEntrance']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-0153-1761157772884-mu6op9-T1ZLlUmrNwS624Rrx1Qvkb3fta9J3S.png','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/262a0a8a-3144-4603-b2fd-24c17b-1761157773822-n42t8q-Ugw2U234KDr9xN6M2Yx75Rbp2ov84O.jpeg']::text[], NULL, true, '2025-10-22T16:29:46.929Z', '2025-11-03T15:42:34.456Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('07aab04b-28cb-4f18-b5a2-0798aa68ff3c', 'cae68d5f-045c-4c1a-8278-0eb9f84dc575', 'Beachfront Villa', 'Luxurious villa with direct beach access, private pool, and stunning ocean views in Bali.', 'HOUSE', 'Jalan Pantai 789', 'Ubud', 'Indonesia', -8.3405, 115.092, 3, 2, 6, 200, 'EUR', ARRAY['WiFi','Kitchen','Private Pool','Beach Access','Garden','Air Conditioning']::text[], ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], NULL, true, '2025-10-30T16:52:56.223Z', '2025-11-03T15:42:35.946Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('61f249a6-b185-45c5-b468-18fd76f6864c', '2fb70d26-96e4-4238-bd0b-9eaa00963234', 'Modern City Loft', 'Stylish loft in the heart of Barcelona with modern amenities and easy access to all attractions.', 'HOUSE', 'Carrer de Gràcia 456', 'Barcelona', 'Spain', 41.3851, 2.1734, 1, 1, 2, 85, 'EUR', ARRAY['WiFi','Kitchen','Balcony','Air Conditioning','Washing Machine']::text[], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], NULL, true, '2025-10-30T16:52:56.162Z', '2025-11-03T15:42:36.171Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('94443256-e662-4ab5-8432-e345e1b89c5e', 'dcf301ec-2d08-405c-a581-ac766a2001c9', 'Colazione al Vaticano', 'Via della Stazione di S. Pietro, 40, 00165 Roma RM', 'HOUSE', 'Via della Stazione di S. Pietro, 40,', 'Roma', 'Italia', 41.8965852, 12.4557177, 3, 2, 6, 100, 'EUR', ARRAY['wifi','airConditioning','heating','tv','washingMachine','dryer','refrigerator','dishwasher','coffeeMachine']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2502-1761667071119-qgyixv-h0OTVvCsiis5fCrpFX5gUQ8IQPOlKA.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2500-1761667072767-aos1y1-miJLS03Jo5EeOZbYEYtN1LksAbFwwd.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2504-1761667073697-ihtbvj-YNxZ6KkGash8ykRxYbBI9GGnOjfAwn.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2499-1761667074486-npbgl8-l4BkRvToso4tlHiulvUzfWJJFk4iRa.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2505-1761667075451-9yqkvr-0gGegQb91fQRqGueEU3m6DK4vFIdV6.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2506-1761667076308-2pwwr7-N48xtMEz2KjTJ3OVkxg1v5IOFhw1V6.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2510-1761667077058-n7o9vu-J9y506UPilquxKXXd9ljAGagBcfQ0X.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2511-1761667077952-94wby4-5i4u26uSCA39kzULgYnJr97qnqc1d3.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2512-1761667078624-xdfp5j-HnSaRLdmRiEZlY8Q9EQbUAR7Brfh7Q.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2513-1761667079504-w2fxyl-8zH3GUyVWwPkQPHCJn3Wmu5yAsmn1I.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2514-1761667080335-2z75tk-hPnQrh4ECEuK9GBoPMPvJhjRlZcSTL.jpeg']::text[], NULL, false, '2025-10-28T14:58:08.393Z', '2025-11-03T15:42:34.847Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('44e7afdc-a298-4b39-ad01-415ae6b00067', '0564ba8e-f44c-484b-90d9-ffe0741aef7d', 'lucas suite', 'A 30 metri da Piazza Duomo e 350 metri dal mare. Ideale per 2 persone. Caratterizzata da splendidi affreschi storici sui soffitti che si fondono con comfort moderni.', 'HOUSE', 'via vito di stefano 32', 'terrasini ', 'italia', 38.1519916, 13.0829289, 1, 1, 3, 70, 'EUR', ARRAY['wifi','airConditioning','heating','tv','refrigerator','coffeeMachine','workspace','towels','shampoo','toiletPaper','hairDryer','iron','parking','privateEntrance']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/bedroom-historic-1-1761799018102-pqdawg-OjUBCTCMpChqZhaF7VMRehrK1Ij11a.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/bedroom-historic-2-1761799019018-kkj2jo-RP70zy03Zr8KViPpdPywE50a11yJEG.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/ceiling-fresco-1-1761799025933-8sks2y-Tu3Wii2hiNcy6Yg8A9vG7ERvCuXmsC.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/bathroom-modern-1761799030375-u5mgum-TpfAPPNu4x2Ti8gkXB8B3uOHaEbDVC.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/terrasini-beach-1761799039429-xl6c20-F4N4Kg04ipc58t1QIJVj2vCmt3XA4l.jpg']::text[], NULL, false, '2025-10-30T03:37:32.733Z', '2025-11-03T15:42:35.294Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('63023e5a-c7fb-48c8-a569-1f27dbfbae6e', 'd22a7299-e9e5-431f-a0f5-e05b248e42e0', 'Villa Giacona Venuti', 'Villa Giacona Venuti immersa nella natura, con accesso privato al mare, piscina privata.', 'HOUSE', 'via sofocle perla del golfo ', 'terrasini', 'italia', 38.153115, 13.0840277, 5, 4, 12, 100, 'EUR', ARRAY['wifi','airConditioning','heating','tv','kitchen','washingMachine','refrigerator','dishwasher','coffeeMachine','balcony','seaView','pool','fireplace','towels','shampoo','toiletPaper','hairDryer','iron','highChair','toys','parking','privateEntrance']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2007-1762383186405-xzyarh-S6QT69dangXNsyVEhcT0mpIa6aaaI3.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2006-1762383188730-o2yw8k-9yDv7czBLleuNm0RnaiItfUsaWaFn5.jpeg']::text[], NULL, true, '2025-11-05T21:53:22.592Z', '2025-11-05T21:53:22.592Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('ff98e793-95ab-491f-8e1f-a0ce6cc37f35', 'b9281602-f564-4c0a-ae68-1c1d39c0ea11', 'Karakol Barnhouse', 'Barnhouse Karakol - is a new guest house in Karakol,Kyrgyzstan.  
- free WI-FI
- 2 bedrooms
- kitchen with an electric kettle,fridge,microwave,washing machine
- 2 air conditioners
', 'HOUSE', 'gagarin street 26', 'Karakol', 'Kyrgyzstan', 42.4939653, 78.4013221, 2, 1, 6, 75, 'EUR', ARRAY['wifi','airConditioning','heating','kitchen','washingMachine','refrigerator','coffeeMachine','towels','shampoo','toiletPaper']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/photo-2025-11-11-09-48-26-1762832967123-028lhm-1A6pKH3hbEoAAB8ZQHrmwlYIlKRSge.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/photo-2025-11-11-09-48-31-1762832980579-3dsst3-ildBPMrSPR0OqbdhJAc5Xu3CXDrLx6.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/photo-2025-11-11-09-48-35-1762832993600-fdtvhi-7jNOhrdaKEqrI7xSfjXMV7g1eK3Cb9.jpg']::text[], NULL, true, '2025-11-11T02:50:45.032Z', '2025-11-11T02:50:45.032Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO properties (id, "hostId", title, description, type, address, city, country, latitude, longitude, bedrooms, bathrooms, "maxGuests", price, currency, amenities, images, rules, "isActive", "createdAt", "updatedAt")
VALUES ('352640e7-a47f-4512-9540-9acf07fe1919', 'b9281602-f564-4c0a-ae68-1c1d39c0ea11', 'Karakol Barnhouse', 'Panoramic windows create a sense of spaciousness and fill the rooms with light. The interior is clean, cozy and modern. 

There is everything necessary for living — an equipped kitchen, dishes, comfortable beds, clean bed linen and towels. Bathroom with a nice shower, hot water without interruptions.

The location of the house is a quiet, peaceful area, with everything you need nearby. A great place to relax!', 'HOUSE', 'gagarin street 26', 'Karakol', 'Kyrgyzstan', 42.4939653, 78.4013221, 2, 1, 6, 75, 'EUR', ARRAY['wifi','airConditioning','heating','kitchen','washingMachine','refrigerator','towels','shampoo','toiletPaper']::text[], ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/photo-2025-11-11-09-48-26-1762833368674-aqn5r3-zyjBevWSwfZImpQYeLRigHKGiGAXVu.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/photo-2025-11-11-09-48-31-1762833370588-3yc8o3-gugF7z3ncPFUbu8LX0V7GtAtHRLijH.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/photo-2025-11-11-09-48-35-1762833380775-v3sp2k-q4s6TEF9EjDaUnJDyR4E2GnHXl8Lna.jpg']::text[], NULL, true, '2025-11-11T02:56:53.433Z', '2025-11-11T02:56:53.433Z')
ON CONFLICT (id) DO NOTHING;


-- ============================================
-- POSTS (25 records)
-- ============================================

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('23f568db-725a-479f-933b-c109258d18ad', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'Lucas Rooftop', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/immagine-whatsapp-2025-07-10-o-1761778156208-6sxjde-XqaheLGLLTtjjVZD5gZhSMLQIqdzJm.jpg']::text[], 'terrasini', NULL, true, '2025-10-29T21:49:46.065Z', '2025-10-29T21:49:46.065Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('76eec8e3-582a-426d-9903-2583a157c0ed', '1fdc3c1f-fbb8-47af-87e6-b2deb5273759', 'Just had the most incredible stay at this mountain cabin! The views were absolutely breathtaking and the fresh Alpine air was exactly what I needed. Thanks @Marco for being such an amazing host! 🏔️', ARRAY['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Zermatt, Switzerland', '6f640b6d-8567-47ea-87b9-853bc092817c', true, '2025-10-30T16:52:57.350Z', '2025-10-30T16:52:57.350Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('454c748a-8e4a-4615-abe9-5a3d79854ac8', '2fb70d26-96e4-4238-bd0b-9eaa00963234', 'Barcelona never fails to amaze me! From the stunning architecture to the vibrant street life, this city has my heart. Currently exploring the Gothic Quarter and discovering hidden gems around every corner. 🏛️✨', ARRAY['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Barcelona, Spain', NULL, true, '2025-10-30T16:52:57.475Z', '2025-10-30T16:52:57.475Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('66daf758-5bd3-4f39-ae21-dae901deeff4', 'cae68d5f-045c-4c1a-8278-0eb9f84dc575', 'Sunset from our beachfront villa in Bali 🌅 There''s something magical about the way the light dances on the water here. Grateful to share this slice of paradise with travelers from around the world.', ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Ubud, Bali', '07aab04b-28cb-4f18-b5a2-0798aa68ff3c', true, '2025-10-30T16:52:57.585Z', '2025-10-30T16:52:57.585Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('2756dda2-47e1-4082-bb33-b43538bfd235', 'dd7adf28-05b5-429f-938c-46f589c19eb4', 'Photography tip of the day: Golden hour lighting makes every travel photo 10x better! 📸 Currently capturing the magic of European countryside and loving every moment of this nomadic lifestyle.', ARRAY['https://images.unsplash.com/photo-1516680224141-86bc862537ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Tuscany, Italy', NULL, true, '2025-10-30T16:52:57.648Z', '2025-10-30T16:52:57.648Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('fdfea10a-58c3-463d-98b2-1ab4be7615c3', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'Ciao Mondo', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2455-1761575601827-45d6s2-uSc5KOaB144CuLcb59A2tMuPH5mGmK.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2452-1761575602878-yvcs2h-hhzG4RQcnLpHlGvf8h5grYGePxoQWv.jpeg']::text[], 'Terrasini', NULL, true, '2025-10-27T13:33:29.992Z', '2025-11-03T15:42:36.487Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('8e38ddf6-3f7f-471d-ac0d-21f92ed6b394', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'Una mamma felice allo Château de Versailles in Francia.', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2038-1761576028664-nzswkk-mqT3eMpFWrVFIrTbAaYF4RFq0v1u67.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2058-1761576029948-5a4xnp-6icnYxsDjRI9yPoD7iGT1cyxsThevG.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2075-1761576031041-1g9vhw-uV1eKF5tdAwGN0uJT0Qr7kWQ4LSYux.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2111-1761576032194-8ba25d-pXe08oXRgxiE41apFOtnet24DGfql5.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2118-1761576033433-7vse7e-ZfBFRC5fdMhIadCczysGqgCGqgZZbb.jpeg']::text[], 'Versailles', NULL, true, '2025-10-27T13:41:38.647Z', '2025-11-03T15:42:36.752Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('9ac360db-4777-4606-b2bf-40a2cf9c0901', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'A Terrasini giocando a Tennis a @Gazzareclub con la mia principessa @Sevkaurr', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-0714-1761576431487-k7t2li-SC22zviIWq4nSg1NsVKhlVzlO1uXhY.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-0704-1761576432768-u6r0cq-X5DF8OZ6Ta7iX4U1Kax2PsWMSqiDAI.jpeg']::text[], 'Terrasini', NULL, true, '2025-10-27T13:48:05.464Z', '2025-11-03T15:42:36.859Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('83ea3411-bfbc-4293-9345-977c4a84738a', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'Nei giardini dello Château de Versailles con @Faramanici', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2173-1761576535104-7sbxnp-b3z5DERLXL6iyIHBBw44jb3LOHtTrx.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/075eedc0-2291-421c-bc10-3d8503-1761576536003-837z3j-dxhdTFv9OEtYjbHs6xqOL6MW1k9oxB.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2170-1761576537016-ltbh1p-nnpb7x7wXoTbvvUDI7k9Gjy6PNqq3T.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2151-1761576537978-yb6grd-tdTkjlq8EvIVmuwW8KquIzES4OBJ6E.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2152-1761576538784-uj2qgt-HN4N6x0KlJ4OvN6Hld3l7hzVbXnV8s.jpeg']::text[], 'Francia', NULL, true, '2025-10-27T13:49:42.154Z', '2025-11-03T15:42:36.963Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('e562c788-b689-4cce-aa45-cca1aef7e318', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'La Sicilia anche in Francia !', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1817-1761576913907-t1kg8k-N4vx1WceM5M9lw7dHcNQ62FFtjV9q1.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1818-1761576915589-mydbk7-fuLcQvQXQeac8xetEyAQmUNRThHDWC.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/3a1afe8c-0331-49b9-8048-fe1d51-1761576916750-r8hqd6-cwbsYIJkZPRoSDtFCwhFcXtYJpUgSV.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/7e33f948-ceda-4824-8a40-801e23-1761576918001-jh2o69-aiawNHvqjprFHSbUSJ2Vj4RuGBAlzr.jpeg']::text[], 'Parigi', NULL, true, '2025-10-27T13:55:36.108Z', '2025-11-03T15:42:37.075Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('c4dee53a-2e24-476a-8f4e-aabc64bfc2ba', '19936c20-bf7a-4d04-b15c-234e7f446c92', 'Night View Victoria island, Lagos state, Nigeria 🇳🇬', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-203407-1761852958350-n1xosd-iUTa08KmEBhO7aC5rzWuQ1Me72zpMI.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-203405-1761852968477-zlac1f-ZJEPp36Nxh082uEc1HR0zdL9g3egQY.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-203403-1761852970445-haijjt-UFqUQPwklbJj1hzX9YEeyTxcMlCIqH.jpg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-203400-1761852973090-j4qmj1-yfIeD93K5LZFKF2JVxHmOastLxTy4Z.jpg']::text[], 'Nigeria', NULL, true, '2025-10-30T18:36:51.798Z', '2025-10-30T18:36:51.798Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('c25a868b-cb75-4861-a5c1-028d9c2552f9', 'dd7adf28-05b5-429f-938c-46f589c19eb4', 'Photography tip of the day: Golden hour lighting makes every travel photo 10x better! 📸 Currently capturing the magic of European countryside and loving every moment of this nomadic lifestyle.', ARRAY['https://images.unsplash.com/photo-1516680224141-86bc862537ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Tuscany, Italy', NULL, true, '2025-10-30T16:29:01.235Z', '2025-11-03T15:42:37.619Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('ec6afe75-17be-4cf9-97d1-5881968aab6d', 'cd60ba73-cd0c-4e9c-bc4a-b466325c33b3', 'Testing the points system! This post should award me 15 points. 🎯', ARRAY[]::text[], NULL, NULL, true, '2025-10-30T16:46:29.802Z', '2025-11-03T15:42:37.727Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('ece0ed0b-93ed-4a34-860d-5a3cbda3d834', '1fdc3c1f-fbb8-47af-87e6-b2deb5273759', 'Just had the most incredible stay at this mountain cabin! The views were absolutely breathtaking and the fresh Alpine air was exactly what I needed. Thanks @Marco for being such an amazing host! 🏔️', ARRAY['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Zermatt, Switzerland', '6f640b6d-8567-47ea-87b9-853bc092817c', true, '2025-10-30T17:45:19.283Z', '2025-11-03T15:42:37.830Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('ff3e0d52-c211-4501-b500-e0e1fba20d94', 'cae68d5f-045c-4c1a-8278-0eb9f84dc575', 'Sunset from our beachfront villa in Bali 🌅 There''s something magical about the way the light dances on the water here. Grateful to share this slice of paradise with travelers from around the world.', ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Ubud, Bali', '07aab04b-28cb-4f18-b5a2-0798aa68ff3c', true, '2025-10-30T17:45:19.524Z', '2025-11-03T15:42:38.044Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('8efcb2e9-9bde-4a17-9689-fd4b111c106c', 'dd7adf28-05b5-429f-938c-46f589c19eb4', 'Photography tip of the day: Golden hour lighting makes every travel photo 10x better! 📸 Currently capturing the magic of European countryside and loving every moment of this nomadic lifestyle.', ARRAY['https://images.unsplash.com/photo-1516680224141-86bc862537ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Tuscany, Italy', NULL, true, '2025-10-30T17:45:19.587Z', '2025-11-03T15:42:38.149Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('a9126dea-6bd7-4385-bd0d-6c5c846da12d', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'Bello quello che puoi fare con Nomadiqe! vivi esperienze gratuite', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/ready-to-explore-better-versio-1761918034089-u2jqr0-PGRNfaVjoF0r092mKIQzHj8Bul82wT.png']::text[], 'europe', NULL, true, '2025-10-31T12:41:24.333Z', '2025-11-03T15:42:38.256Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('2c9483b4-3557-49f1-b5af-f9cdf28e28ed', '6b42cea9-ce54-4339-8fc0-fa61c9987847', 'Questa è un’ottima app! Super utile 🥰', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/b501dc20-acb7-4eab-804f-7390b7-1762186918224-mn0cv4-WuvRtWm352zz3Nzt8DIjgleeDyJgio.jpeg']::text[], 'Palermo', NULL, false, '2025-11-03T15:22:32.025Z', '2025-11-10T19:03:23.776Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('ef85535d-a2b9-4121-95a6-47a867bbab33', '1fdc3c1f-fbb8-47af-87e6-b2deb5273759', 'Just had the most incredible stay at this mountain cabin! The views were absolutely breathtaking and the fresh Alpine air was exactly what I needed. Thanks @Marco for being such an amazing host! 🏔️', ARRAY['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Zermatt, Switzerland', '6f640b6d-8567-47ea-87b9-853bc092817c', true, '2025-10-30T16:29:00.924Z', '2025-11-03T15:42:37.297Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('de2c8edb-8b24-4cb8-90a6-886eba00d613', '2fb70d26-96e4-4238-bd0b-9eaa00963234', 'Barcelona never fails to amaze me! From the stunning architecture to the vibrant street life, this city has my heart. Currently exploring the Gothic Quarter and discovering hidden gems around every corner. 🏛️✨', ARRAY['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Barcelona, Spain', NULL, true, '2025-10-30T16:29:01.047Z', '2025-11-03T15:42:37.403Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('7116caf1-7265-497f-a5b8-aaf87d5d8150', 'cae68d5f-045c-4c1a-8278-0eb9f84dc575', 'Sunset from our beachfront villa in Bali 🌅 There''s something magical about the way the light dances on the water here. Grateful to share this slice of paradise with travelers from around the world.', ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Ubud, Bali', '07aab04b-28cb-4f18-b5a2-0798aa68ff3c', true, '2025-10-30T16:29:01.165Z', '2025-11-03T15:42:37.509Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('7a987415-5ef9-4715-80c2-2e409841b374', '2fb70d26-96e4-4238-bd0b-9eaa00963234', 'Barcelona never fails to amaze me! From the stunning architecture to the vibrant street life, this city has my heart. Currently exploring the Gothic Quarter and discovering hidden gems around every corner. 🏛️✨', ARRAY['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']::text[], 'Barcelona, Spain', NULL, true, '2025-10-30T17:45:19.406Z', '2025-11-03T15:42:37.935Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('61bc6c27-7a0e-4602-8dc5-110bb239d505', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'A Parigi con la mamma davanti al Moulin Rouge 🇫🇷', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1745-1761575693239-oy0dt4-YYs46YAr5AnJUmVgRWWcx1FmTQmDKB.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1746-1761575694379-sym7lv-ESiZWNfYhmWgxozP3B59dhWx1RxO8P.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1747-1761575695679-o41tdc-NRWZkp5FrW6iB1yxgbj3QEG5CFUt6i.jpeg']::text[], 'Parigi', NULL, true, '2025-10-27T13:36:12.640Z', '2025-11-03T15:42:36.641Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('603f024c-993d-4b05-b16f-5cc95f31012c', 'e62f7828-8892-45d5-b6f8-21d00c89ce2b', 'La mia esperienza in questa struttura è stata pessima. Le condizioni reali non corrispondono affatto alle foto dell’annuncio. La stanza era sporca ovunque: pavimenti pieni di polvere e residui, bagno con muffa, cucina trascurata e mobili sporchi. Il letto era slivellato e troppo piccolo per due persone. Ho contattato l’host, ma non ha risposto in tempo e ho dovuto dormire una notte in queste condizioni. Nessuna attenzione verso l’ospite. Non consiglio assolutamente questa sistemazione.', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1685-1761580265259-gc1259-0Ww8tG2cxncCBz2wriMKvTGhHOOrQ1.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1686-1761580266894-bqizaz-oK0H9cqbZ6sIapzhJjGM2u0u2YbMgC.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1687-1761580268432-go46ik-WBs7MpwY54B3pQk3gZbUFbmpkOR8qh.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1689-1761580269353-6ob051-SIMDuDsYgT5zV7EBSjfa8hFHv4vdLW.jpeg','https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1697-1761580270477-w7awsw-kh4s8yllSQWzTu9I89LwUP2YtmI1Ga.jpeg']::text[], 'Clichy, Francia', NULL, true, '2025-10-27T14:51:50.032Z', '2025-11-03T15:42:37.186Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", content, images, location, "propertyId", "isActive", "createdAt", "updatedAt")
VALUES ('250800ce-6e52-464c-8f18-dacc180cfac8', 'ef760284-69eb-4c45-ae78-49babf2fcc2e', 'Sicilian sunsets🥰', ARRAY['https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-9941-1762712092083-5x67jg-eSrhVz1Nv1gpfyjMYfcvMlKdVG52n4.jpeg']::text[], 'Sicily', NULL, true, '2025-11-09T17:15:28.727Z', '2025-11-09T17:15:28.727Z')
ON CONFLICT (id) DO NOTHING;
