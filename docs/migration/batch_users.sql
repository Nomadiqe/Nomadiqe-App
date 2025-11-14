INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('7a0a8b2a-e21b-4821-abaf-59250a921900', 'matt@bedda.tech', NULL, 'Matthew Whitney', 'Matthew J. Whitney', 'matt_bedda', 'Co-Founder of Nomadiqe', 'Scottsdale, AZ', '+14802095975', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/avatar-underwater-1760970372581-0aexcf-QiJLzTmj1N58yflTlPGWCNC8onbxIy.jpg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/avatar-underwater-1760970372581-0aexcf-QiJLzTmj1N58yflTlPGWCNC8onbxIy.jpg', NULL, 'GUEST', 'COMPLETED', '2025-10-20T12:01:08.701Z', '2025-11-03T15:42:18.162Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('2e03c27d-d6cb-4856-9e46-52bd80ddf9df', 'testuser20251020@test.com', NULL, NULL, 'Test User', 'testuser2025', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', '2025-10-20T12:14:58.503Z', '2025-11-03T15:42:18.108Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('2d235fc5-eb53-4877-b453-427cc88405de', 'luca@metatech.dev', NULL, 'Luca Corrao', 'Luca Corrao', 'lucacorraos', 'Tech entrepreneur, Nomadiqe Founder, Bedda.tech Co founder, Sicilian Host, Enthusiastic. ', 'Terrasini-Phoenix, Italia-Stati Uniti', '+39 3513671340', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1993-1761157490706-01n7ea-thNFH8BOd55fXqjKDU8FpDR40iTZoY.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1993-1761157490706-01n7ea-thNFH8BOd55fXqjKDU8FpDR40iTZoY.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/suitefesta-1762542330210-bptdk0-rm5phARgNqPy3yLD6cY0SAMvi4T0pc.jpg', 'HOST', 'COMPLETED', '2025-10-20T12:30:53.682Z', '2025-11-07T18:05:53.614Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('bc05b9c3-fd3b-4d4e-8ab6-9a6dcb320f78', 'matthewjwhitney@gmail.com', NULL, 'Matthew Whitney', NULL, NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJMzZL7DHeJDWflIXiZKO8Vx_NOw-pP66K6Ki-TCc_Kmq_dG_-glQ=s96-c', NULL, NULL, 'GUEST', 'PENDING', '2025-10-20T12:39:35.708Z', '2025-11-03T15:42:18.217Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('5de74dbb-8642-486b-8359-ede998eacccc', 'matt@metatech.dev', NULL, 'Matthew Whitney', 'Test User', 'testuser', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', '2025-10-20T15:10:41.206Z', '2025-11-03T15:42:18.056Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('93d83195-b209-4020-bad9-750a7d22262f', 'sevkaurr@gmail.com', NULL, 'Sevara Ur', 'Sevara Urman', 'sevkaur', 'Based in Rome, Italy, and often travel to some of the most beautiful and iconic locations worldwide and would like to take amazing content for you. Your property can be showcased through aesthetic content that grabs attention and increases visibility. With the ability to speak multiple languages, connecting with diverse audiences becomes effortless. Feel free to contact me!', 'Rome, Italy', '', 'https://lh3.googleusercontent.com/a/ACg8ocJgHWMpSb5-WXyCVyzDf_D6Y1bC2z-sX1AQEcAjhAwpxXO_xEo=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJgHWMpSb5-WXyCVyzDf_D6Y1bC2z-sX1AQEcAjhAwpxXO_xEo=s96-c', NULL, 'GUEST', 'COMPLETED', '2025-10-27T14:56:59.104Z', '2025-11-03T15:42:18.434Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('3aae2970-4d3e-49d3-8a50-88dec4dfb22d', 'matteolorso@gmail.com', NULL, 'Matthew Whitney', 'Matteo L''Orso', 'matteolorso', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJPZ4VPw-nD7KvS-LpVv0ntXJBt7VaRDGA3gzpftWP49Ulm=s96-c', NULL, NULL, 'INFLUENCER', 'COMPLETED', '2025-10-28T00:26:58.863Z', '2025-11-03T15:42:18.381Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('b9bad7e1-abcc-4e54-b1ee-0d6981fd531d', 'maniacifara66@gmail.com', NULL, 'Fara Maniaci', 'Farà Maniaci', 'faramaniaci', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocL5GVtfo-O5_92j5l3Xj5OEFRvzyVPzD3iaqDRk56N0YrgpGg=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocL5GVtfo-O5_92j5l3Xj5OEFRvzyVPzD3iaqDRk56N0YrgpGg=s96-c', NULL, 'INFLUENCER', 'COMPLETED', '2025-10-28T02:22:02.877Z', '2025-11-03T15:42:18.542Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('c133ce4f-cade-4a84-b5c5-1d2ccd2b6ae5', 'lucacorrao1m@gmail.com', NULL, 'Luca', 'Luca influencer test', 'test', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJyaSjV8PH6CkOfsb0i-_0s-q-qtaGAlYwvJUp6EHC0DEQouw=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJyaSjV8PH6CkOfsb0i-_0s-q-qtaGAlYwvJUp6EHC0DEQouw=s96-c', NULL, 'GUEST', 'IN_PROGRESS', '2025-10-28T10:45:40.432Z', '2025-11-07T18:14:35.190Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('753a317c-afb4-4ff6-8ca7-21644f33f935', 'matt+1@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T14:02:49.472Z', '2025-11-03T15:42:18.328Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('6f63f3e8-3f36-442b-bbf9-00eb58b872a7', 'testinfluencer@nomadiqe.test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T14:37:14.403Z', '2025-11-03T15:42:18.490Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('86d5afaf-ec87-419e-a562-5fb4f3446390', 'matt+2@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TRAVELER', 'PENDING', '2025-10-28T14:56:34.672Z', '2025-11-03T15:42:18.704Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('05b1c373-b238-4ac7-9d5e-b463ed59e8eb', 'matt+3@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T14:57:16.266Z', '2025-11-03T15:42:18.765Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('52ac3d6e-2a2c-4df2-be3e-3bfef0756ccc', 'testinfluencer2@nomadiqe.test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T15:02:22.955Z', '2025-11-03T15:42:18.597Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('13b29f5e-2891-40ec-a760-f8c6556c626e', 'matt+4@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', '2025-10-28T15:29:48.584Z', '2025-11-03T15:42:18.870Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('08ce38fe-f56b-465e-8747-938ac5692493', 'testinfluencer@test.com', NULL, NULL, 'Test Influencer', 'test_influencer', NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'COMPLETED', '2025-10-28T15:47:41.023Z', '2025-11-03T15:42:18.650Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('4e905b5b-d797-406a-baa4-2be20afcfe41', 'testhost@test.com', NULL, NULL, 'Test Host', 'test_host', NULL, NULL, NULL, NULL, NULL, NULL, 'HOST', 'IN_PROGRESS', '2025-10-28T15:58:56.725Z', '2025-11-03T15:42:18.818Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('fb773c61-10ba-4f23-bcc9-a4038d47113b', 'testguest@test.com', NULL, NULL, 'Test Guest', 'test_guest', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', '2025-10-28T16:03:04.430Z', '2025-11-03T15:42:18.975Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('71bfde77-f625-4fc3-ab3c-f97f46fcfb59', 'facevoiceai@gmail.com', NULL, 'FaceVoiceAi', 'Face', 'voice', 'Next-gen AI truth detection! Facial expressions & voice tone analysis Decentralized & transparent verification Telegram: http://t.me/FaceVoiceAi', 'Los Angeles', '', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/modified-image-1761799637758-52ad2c-fK4r3FsaO0iTPDCYyLmQcWnZWmBET5.png', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/modified-image-1761799637758-52ad2c-fK4r3FsaO0iTPDCYyLmQcWnZWmBET5.png', NULL, 'GUEST', 'COMPLETED', '2025-10-28T16:13:50.673Z', '2025-11-03T15:42:19.301Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('ce5944ae-fe3f-4a1b-8d84-fe77a4ce65eb', 'lucacorrao96@outlook.it', NULL, NULL, 'Host test', 'hosttest', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2476-1761672497159-m2vbt5-rKSadRIylq4AVEprZ269qa8rwIWudq.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2476-1761672497159-m2vbt5-rKSadRIylq4AVEprZ269qa8rwIWudq.jpeg', NULL, 'INFLUENCER', 'IN_PROGRESS', '2025-10-28T16:27:31.865Z', '2025-11-03T15:42:18.922Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('030cbaf3-1fe4-4fe4-860a-f517ec570148', 'sevkaurr1@gmail.com', NULL, NULL, 'Sevara Urman', 'sevkaur1', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2888-1761673210825-vw5plv-jc2amNfz3LAKBPXqb6w0w9pk2YB1nc.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2888-1761673210825-vw5plv-jc2amNfz3LAKBPXqb6w0w9pk2YB1nc.jpeg', NULL, 'INFLUENCER', 'COMPLETED', '2025-10-28T16:39:53.230Z', '2025-11-09T17:10:35.222Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('557e1e40-d509-4279-8c4a-16199ec6202b', 'alex.chatzis@web.de', NULL, NULL, 'Alex De Biase', 'alexdebiase', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/58fcadd7-5fb8-446a-b135-6eb503-1761747564632-j6cao5-oeV6EjJpPNwyliDRVzmG5HzhjLR7Wz.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/58fcadd7-5fb8-446a-b135-6eb503-1761747564632-j6cao5-oeV6EjJpPNwyliDRVzmG5HzhjLR7Wz.jpeg', NULL, 'GUEST', 'COMPLETED', '2025-10-29T13:16:35.261Z', '2025-11-03T15:42:19.137Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('9f61c378-9d03-4f20-8225-29678b6e4e1d', 'lucacorrao1996@gmail.com', NULL, 'Luca Corrao', 'lucas suite', 'lucacorraoss', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/image-url-1761798867379-oin3hx-19t9oowpEmza1JkHLbzzXU4hz7NXlM.jpg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/image-url-1761798867379-oin3hx-19t9oowpEmza1JkHLbzzXU4hz7NXlM.jpg', NULL, 'INFLUENCER', 'IN_PROGRESS', '2025-10-29T20:50:59.843Z', '2025-11-06T14:03:09.352Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('5af65533-86f2-4291-b61b-37d8ea34c95f', 'matt+10@bedda.tech', NULL, NULL, 'Test User', 'testuser123', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'PENDING', '2025-10-29T23:44:50.361Z', '2025-11-03T15:42:19.248Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('9030c97d-e434-4eef-8096-1337c8a9efd7', 'marcogodi96@gmail.com', NULL, 'Marco Godi', 'marcocreatortest', 'marcocreatortest', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJyRIhAYztLvDZUNIpOZksS4jVUV9w8Id0CczBnJG-mxrdtMQ=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJyRIhAYztLvDZUNIpOZksS4jVUV9w8Id0CczBnJG-mxrdtMQ=s96-c', NULL, 'INFLUENCER', 'COMPLETED', '2025-10-30T03:02:48.800Z', '2025-10-30T03:05:21.460Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('f5b1b9f2-f4df-4216-9ca8-824e4e5499d4', 'host1@nomadiqe.com', NULL, 'Marco Rossi', NULL, NULL, 'Passionate about sharing the beauty of the Alps with travelers from around the world. Local expert and mountain enthusiast.', 'Zermatt, Switzerland', '+41 27 966 81 00', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'HOST', 'PENDING', '2025-10-30T16:52:54.240Z', '2025-11-03T15:42:17.945Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('10c828d0-d1b0-4286-9900-35bf0d01bf3f', 'host2@nomadiqe.com', NULL, 'Sophie Chen', NULL, NULL, 'Architecture lover and city explorer. I help travelers discover the best urban experiences in Barcelona.', 'Barcelona, Spain', '+34 93 285 38 32', 'https://images.unsplash.com/photo-1494790108755-2616b332c7e0?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'HOST', 'PENDING', '2025-10-30T16:52:54.750Z', '2025-11-03T15:42:19.360Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('a5de2ac4-82f2-430c-89ed-708df97e34d0', 'traveler1@nomadiqe.com', NULL, 'Alex Johnson', NULL, NULL, 'Digital nomad and adventure seeker. Love exploring new cultures and sharing travel experiences.', 'Currently in Europe', '+1 555 123 4567', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'TRAVELER', 'PENDING', '2025-10-30T16:52:55.065Z', '2025-11-03T15:42:19.414Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('d14bf201-89b8-4acc-8281-4c5a19e4cdbd', 'traveler2@nomadiqe.com', NULL, 'Emma Wilson', NULL, NULL, 'Travel photographer and storyteller. Capturing memories one destination at a time.', 'London, UK', '+44 20 7946 0958', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'TRAVELER', 'PENDING', '2025-10-30T16:52:55.423Z', '2025-11-03T15:42:19.470Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('a46d73db-1730-4659-b1de-8a4a7a6dcf38', 'host3@nomadiqe.com', NULL, 'Raj Patel', NULL, NULL, 'Beachfront property owner with deep knowledge of Balinese culture and hidden gems.', 'Ubud, Bali', '+62 361 123456', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', NULL, NULL, 'HOST', 'PENDING', '2025-10-30T16:52:55.735Z', '2025-11-03T15:42:19.527Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('4d11ccb5-87ea-4163-8951-e7474988a3dd', 'ofegaalex@gmail.com', NULL, NULL, 'Alex Jeffrey', 'youngking770', '', 'Nigeria ', '', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-215357-1761857655784-by9d4t-pbudXWiRNda48OYb4lfJAbmpL1QvXo.jpg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-215357-1761857655784-by9d4t-pbudXWiRNda48OYb4lfJAbmpL1QvXo.jpg', NULL, 'GUEST', 'COMPLETED', '2025-10-30T18:01:17.594Z', '2025-10-30T19:54:25.562Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('c640fb4b-5698-4137-bd37-ca0b2b54047d', 'mattia@metatech.dev', NULL, 'Mattia Orlando', 'Gian Franco Nomadico', 'gianfranconomadico', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLW5SvtzWoA4Ls46aT73UPTV77HgjpmAwZiUXQsW8iXZEF-YQ=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocLW5SvtzWoA4Ls46aT73UPTV77HgjpmAwZiUXQsW8iXZEF-YQ=s96-c', NULL, 'GUEST', 'COMPLETED', '2025-11-03T15:12:05.105Z', '2025-11-03T15:14:48.526Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('aa770a7d-6446-4eaa-b1d2-8b1145c07192', 'giuliam.anzalone22@gmail.com', NULL, 'Giuliam Haramis Anzalone', 'JH Graphic', 'jhgraphic', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLvEd_dhZSp7z-x1-8ktiTz-DAoMfumkdgloaBVRHGxn-iqCYIY=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocLvEd_dhZSp7z-x1-8ktiTz-DAoMfumkdgloaBVRHGxn-iqCYIY=s96-c', NULL, 'GUEST', 'COMPLETED', '2025-11-04T01:19:31.688Z', '2025-11-04T01:21:20.784Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('fbfd0473-6867-4887-9b11-8bcb62232c19', 'asdtenutagiacona@gmail.com', NULL, 'Magik End el KING', 'Villa Giacona Venuti', 'villagiaconavenuti', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIjgPtfXu0WDcO0_cbvMWFzCrp0tzLiPBB65E20QkX0hYUmQNyM=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocIjgPtfXu0WDcO0_cbvMWFzCrp0tzLiPBB65E20QkX0hYUmQNyM=s96-c', NULL, 'HOST', 'IN_PROGRESS', '2025-11-05T21:22:57.386Z', '2025-11-05T21:53:22.786Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('7e04fe09-5e82-4c7e-92a7-41c890a70de8', 'andrea.turano97@hotmail.com', NULL, NULL, 'Andrea', 'andrea1997', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2667-1762452859508-9212yr-cC8sabWQuNZnoyUC2r5SkTlwH7rdm4.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2667-1762452859508-9212yr-cC8sabWQuNZnoyUC2r5SkTlwH7rdm4.jpeg', NULL, 'INFLUENCER', 'COMPLETED', '2025-11-06T17:13:50.853Z', '2025-11-06T17:21:24.658Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('f3f36bea-b353-4d85-ac5a-3f2eadd23a36', 'nottateurman@gmail.com', NULL, 'Ian Urman', 'Kei', 'isituian', '', 'Bishkek,Kyrgyzstan', '', 'https://lh3.googleusercontent.com/a/ACg8ocKF_gOUw3fFwJNL4bS4kQ_n1JJjdcP0JSS5j0auXCxmT2ZUDhLN=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocKF_gOUw3fFwJNL4bS4kQ_n1JJjdcP0JSS5j0auXCxmT2ZUDhLN=s96-c', NULL, 'HOST', 'COMPLETED', '2025-11-10T05:21:53.839Z', '2025-11-11T03:03:07.345Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
--
INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, image, "profilePictureUrl", "coverPhotoUrl", role, "onboardingStatus", "createdAt", "updatedAt")
VALUES ('675c4ffb-b2fb-43a1-844e-43c657d87438', 'deanurman08@gmail.com', NULL, 'Dean Urman', 'Kei', 'okeilol', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJ8VBSbDgXDtcVwymHCmApXExT_iYz35GSqgMUm_3rFrtuY4w=s96-c', 'https://lh3.googleusercontent.com/a/ACg8ocJ8VBSbDgXDtcVwymHCmApXExT_iYz35GSqgMUm_3rFrtuY4w=s96-c', NULL, 'INFLUENCER', 'IN_PROGRESS', '2025-11-10T05:23:19.150Z', '2025-11-10T05:25:32.498Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";
