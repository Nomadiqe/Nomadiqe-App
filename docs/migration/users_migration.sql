INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('9db51f50-11b2-4bf5-b6df-d7edec04771d', 'matt@bedda.tech', NULL, 'Matthew Whitney', 'Matthew J. Whitney', 'matt_bedda', 'Co-Founder of Nomadiqe', 'Scottsdale, AZ', '+14802095975', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/avatar-underwater-1760970372581-0aexcf-QiJLzTmj1N58yflTlPGWCNC8onbxIy.jpg', NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-10-20T12:01:08.701Z', '2025-11-03T15:42:18.162Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('57c26a9c-c8a8-4e6b-80de-1ffef5eae70f', 'testuser20251020@test.com', NULL, NULL, 'Test User', 'testuser2025', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-10-20T12:14:58.503Z', '2025-11-03T15:42:18.108Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('cba651ea-dd21-4c3f-8a10-3c2b01aefa86', 'luca@metatech.dev', NULL, 'Luca Corrao', 'Luca Corrao', 'lucacorraos', 'Tech entrepreneur, Nomadiqe Founder, Bedda.tech Co founder, Sicilian Host, Enthusiastic. ', 'Terrasini-Phoenix, Italia-Stati Uniti', '+39 3513671340', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-1993-1761157490706-01n7ea-thNFH8BOd55fXqjKDU8FpDR40iTZoY.jpeg', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/suitefesta-1762542330210-bptdk0-rm5phARgNqPy3yLD6cY0SAMvi4T0pc.jpg', NULL, 'HOST', 'COMPLETED', NULL, '2025-10-20T12:30:53.682Z', '2025-11-07T18:05:53.614Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('71653074-7665-4730-8663-855da2a5bca2', 'matthewjwhitney@gmail.com', NULL, 'Matthew Whitney', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'PENDING', NULL, '2025-10-20T12:39:35.708Z', '2025-11-03T15:42:18.217Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('e115b00c-d6ad-4a18-8963-17ddbab96b5e', 'matt@metatech.dev', NULL, 'Matthew Whitney', 'Test User', 'testuser', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-10-20T15:10:41.206Z', '2025-11-03T15:42:18.056Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('46f943e3-e5fa-46da-86cb-0180912bb713', 'sevkaurr@gmail.com', NULL, 'Sevara Ur', 'Sevara Urman', 'sevkaur', 'Based in Rome, Italy, and often travel to some of the most beautiful and iconic locations worldwide and would like to take amazing content for you. Your property can be showcased through aesthetic content that grabs attention and increases visibility. With the ability to speak multiple languages, connecting with diverse audiences becomes effortless. Feel free to contact me!', 'Rome, Italy', '', 'https://lh3.googleusercontent.com/a/ACg8ocJgHWMpSb5-WXyCVyzDf_D6Y1bC2z-sX1AQEcAjhAwpxXO_xEo=s96-c', NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-10-27T14:56:59.104Z', '2025-11-03T15:42:18.434Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('a86b77f8-3ad2-4672-9396-14234893e433', 'matteolorso@gmail.com', NULL, 'Matthew Whitney', 'Matteo L''Orso', 'matteolorso', NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'COMPLETED', NULL, '2025-10-28T00:26:58.863Z', '2025-11-03T15:42:18.381Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('0b9fd877-4bb7-463e-88df-443e5a4f890e', 'maniacifara66@gmail.com', NULL, 'Fara Maniaci', 'Farà Maniaci', 'faramaniaci', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocL5GVtfo-O5_92j5l3Xj5OEFRvzyVPzD3iaqDRk56N0YrgpGg=s96-c', NULL, NULL, 'INFLUENCER', 'COMPLETED', NULL, '2025-10-28T02:22:02.877Z', '2025-11-03T15:42:18.542Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('0820ca37-5d1d-4139-8d83-d1ff7850b46a', 'lucacorrao1m@gmail.com', NULL, 'Luca', 'Luca influencer test', 'test', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJyaSjV8PH6CkOfsb0i-_0s-q-qtaGAlYwvJUp6EHC0DEQouw=s96-c', NULL, NULL, 'GUEST', 'IN_PROGRESS', NULL, '2025-10-28T10:45:40.432Z', '2025-11-07T18:14:35.190Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('8221b948-d6fe-49c8-b806-9c1769f9dc8b', 'matt+1@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', NULL, '2025-10-28T14:02:49.472Z', '2025-11-03T15:42:18.328Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('e16a5645-2360-423a-adb5-c191f1eb7c77', 'testinfluencer@nomadiqe.test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', NULL, '2025-10-28T14:37:14.403Z', '2025-11-03T15:42:18.490Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('ea5483d0-f6ee-46e2-bf4d-aeb7c4d08259', 'matt+2@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TRAVELER', 'PENDING', NULL, '2025-10-28T14:56:34.672Z', '2025-11-03T15:42:18.704Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('d08af196-a2c0-406d-bd66-bc6b6e7f8804', 'matt+3@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', NULL, '2025-10-28T14:57:16.266Z', '2025-11-03T15:42:18.765Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('ecb5af09-9619-4d2a-bc04-c1672b2d95eb', 'testinfluencer2@nomadiqe.test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', NULL, '2025-10-28T15:02:22.955Z', '2025-11-03T15:42:18.597Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('9ecd1cfa-9959-48c5-9f43-97debee25cbe', 'matt+4@bedda.tech', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'PENDING', NULL, '2025-10-28T15:29:48.584Z', '2025-11-03T15:42:18.870Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('4132eb54-9413-4316-8398-8a625b68d44f', 'testinfluencer@test.com', NULL, NULL, 'Test Influencer', 'test_influencer', NULL, NULL, NULL, NULL, NULL, NULL, 'INFLUENCER', 'COMPLETED', NULL, '2025-10-28T15:47:41.023Z', '2025-11-03T15:42:18.650Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('136a6c99-9606-4be9-9fd9-88203a31084a', 'testhost@test.com', NULL, NULL, 'Test Host', 'test_host', NULL, NULL, NULL, NULL, NULL, NULL, 'HOST', 'IN_PROGRESS', NULL, '2025-10-28T15:58:56.725Z', '2025-11-03T15:42:18.818Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('63974b06-0469-4898-a629-40271393065a', 'testguest@test.com', NULL, NULL, 'Test Guest', 'test_guest', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-10-28T16:03:04.430Z', '2025-11-03T15:42:18.975Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('949e811c-af84-4f77-b15f-57c7072aa3f8', 'facevoiceai@gmail.com', NULL, 'FaceVoiceAi', 'Face', 'voice', 'Next-gen AI truth detection! Facial expressions & voice tone analysis Decentralized & transparent verification Telegram: http://t.me/FaceVoiceAi', 'Los Angeles', '', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/modified-image-1761799637758-52ad2c-fK4r3FsaO0iTPDCYyLmQcWnZWmBET5.png', NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-10-28T16:13:50.673Z', '2025-11-03T15:42:19.301Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('c89e5b4a-9471-46bc-be08-6b866c294a21', 'lucacorrao96@outlook.it', NULL, NULL, 'Host test', 'hosttest', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2476-1761672497159-m2vbt5-rKSadRIylq4AVEprZ269qa8rwIWudq.jpeg', NULL, NULL, 'INFLUENCER', 'IN_PROGRESS', NULL, '2025-10-28T16:27:31.865Z', '2025-11-03T15:42:18.922Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('29c14e40-4e76-4d8d-939b-b29516943208', 'sevkaurr1@gmail.com', NULL, NULL, 'Sevara Urman', 'sevkaur1', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2888-1761673210825-vw5plv-jc2amNfz3LAKBPXqb6w0w9pk2YB1nc.jpeg', NULL, NULL, 'INFLUENCER', 'COMPLETED', NULL, '2025-10-28T16:39:53.230Z', '2025-11-09T17:10:35.222Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('b71b0dac-97f9-49cc-8af2-72b5bf8606fa', 'alex.chatzis@web.de', NULL, NULL, 'Alex De Biase', 'alexdebiase', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/58fcadd7-5fb8-446a-b135-6eb503-1761747564632-j6cao5-oeV6EjJpPNwyliDRVzmG5HzhjLR7Wz.jpeg', NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-10-29T13:16:35.261Z', '2025-11-03T15:42:19.137Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('3fc4c060-d908-4841-85a9-9972cdb12566', 'lucacorrao1996@gmail.com', NULL, 'Luca Corrao', 'lucas suite', 'lucacorraoss', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/image-url-1761798867379-oin3hx-19t9oowpEmza1JkHLbzzXU4hz7NXlM.jpg', NULL, NULL, 'INFLUENCER', 'IN_PROGRESS', NULL, '2025-10-29T20:50:59.843Z', '2025-11-06T14:03:09.352Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('e4456af7-8d69-42c7-b5e1-005f99c54247', 'matt+10@bedda.tech', NULL, NULL, 'Test User', 'testuser123', NULL, NULL, NULL, NULL, NULL, NULL, 'GUEST', 'PENDING', NULL, '2025-10-29T23:44:50.361Z', '2025-11-03T15:42:19.248Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('17baed5e-8ac2-4225-9d2d-ca496e69de42', 'marcogodi96@gmail.com', NULL, 'Marco Godi', 'marcocreatortest', 'marcocreatortest', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJyRIhAYztLvDZUNIpOZksS4jVUV9w8Id0CczBnJG-mxrdtMQ=s96-c', NULL, NULL, 'INFLUENCER', 'COMPLETED', NULL, '2025-10-30T03:02:48.800Z', '2025-10-30T03:05:21.460Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('08bf32f7-73f9-42b7-b22b-0c11da82c212', 'host1@nomadiqe.com', NULL, 'Marco Rossi', NULL, NULL, 'Passionate about sharing the beauty of the Alps with travelers from around the world. Local expert and mountain enthusiast.', 'Zermatt, Switzerland', '+41 27 966 81 00', NULL, NULL, NULL, 'HOST', 'PENDING', NULL, '2025-10-30T16:52:54.240Z', '2025-11-03T15:42:17.945Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('13533fc3-33c3-456f-ac50-fc7b63f44f1f', 'host2@nomadiqe.com', NULL, 'Sophie Chen', NULL, NULL, 'Architecture lover and city explorer. I help travelers discover the best urban experiences in Barcelona.', 'Barcelona, Spain', '+34 93 285 38 32', NULL, NULL, NULL, 'HOST', 'PENDING', NULL, '2025-10-30T16:52:54.750Z', '2025-11-03T15:42:19.360Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('72d7400f-19f6-4e15-8e0c-33b2e8d101a1', 'traveler1@nomadiqe.com', NULL, 'Alex Johnson', NULL, NULL, 'Digital nomad and adventure seeker. Love exploring new cultures and sharing travel experiences.', 'Currently in Europe', '+1 555 123 4567', NULL, NULL, NULL, 'TRAVELER', 'PENDING', NULL, '2025-10-30T16:52:55.065Z', '2025-11-03T15:42:19.414Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('5d10d35b-6e0f-4ed5-8fac-f718d25f1128', 'traveler2@nomadiqe.com', NULL, 'Emma Wilson', NULL, NULL, 'Travel photographer and storyteller. Capturing memories one destination at a time.', 'London, UK', '+44 20 7946 0958', NULL, NULL, NULL, 'TRAVELER', 'PENDING', NULL, '2025-10-30T16:52:55.423Z', '2025-11-03T15:42:19.470Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('90d60b5c-345a-49a9-aba1-b91220b98085', 'host3@nomadiqe.com', NULL, 'Raj Patel', NULL, NULL, 'Beachfront property owner with deep knowledge of Balinese culture and hidden gems.', 'Ubud, Bali', '+62 361 123456', NULL, NULL, NULL, 'HOST', 'PENDING', NULL, '2025-10-30T16:52:55.735Z', '2025-11-03T15:42:19.527Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('dc1f5a0e-6aeb-4fe1-8cc5-605217fc9489', 'ofegaalex@gmail.com', NULL, NULL, 'Alex Jeffrey', 'youngking770', '', 'Nigeria ', '', 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-20251030-215357-1761857655784-by9d4t-pbudXWiRNda48OYb4lfJAbmpL1QvXo.jpg', NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-10-30T18:01:17.594Z', '2025-10-30T19:54:25.562Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('d8cfa41d-f7bb-426c-bebe-70693b555c5e', 'mattia@metatech.dev', NULL, 'Mattia Orlando', 'Gian Franco Nomadico', 'gianfranconomadico', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLW5SvtzWoA4Ls46aT73UPTV77HgjpmAwZiUXQsW8iXZEF-YQ=s96-c', NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-11-03T15:12:05.105Z', '2025-11-03T15:14:48.526Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('3cef210a-e1e1-4837-9964-3013aa8de319', 'giuliam.anzalone22@gmail.com', NULL, 'Giuliam Haramis Anzalone', 'JH Graphic', 'jhgraphic', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLvEd_dhZSp7z-x1-8ktiTz-DAoMfumkdgloaBVRHGxn-iqCYIY=s96-c', NULL, NULL, 'GUEST', 'COMPLETED', NULL, '2025-11-04T01:19:31.688Z', '2025-11-04T01:21:20.784Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('52a4ad60-96a1-42ca-b3b3-a655f0a4fd66', 'asdtenutagiacona@gmail.com', NULL, 'Magik End el KING', 'Villa Giacona Venuti', 'villagiaconavenuti', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIjgPtfXu0WDcO0_cbvMWFzCrp0tzLiPBB65E20QkX0hYUmQNyM=s96-c', NULL, NULL, 'HOST', 'IN_PROGRESS', NULL, '2025-11-05T21:22:57.386Z', '2025-11-05T21:53:22.786Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('cff25b5d-4639-4ef2-bf0f-bc660675b06b', 'andrea.turano97@hotmail.com', NULL, NULL, 'Andrea', 'andrea1997', NULL, NULL, NULL, 'https://a9fhc2wytnmfd6sh.public.blob.vercel-storage.com/img-2667-1762452859508-9212yr-cC8sabWQuNZnoyUC2r5SkTlwH7rdm4.jpeg', NULL, NULL, 'INFLUENCER', 'COMPLETED', NULL, '2025-11-06T17:13:50.853Z', '2025-11-06T17:21:24.658Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('b51802af-4825-4c83-8aab-7fa26f096cf2', 'nottateurman@gmail.com', NULL, 'Ian Urman', 'Kei', 'isituian', '', 'Bishkek,Kyrgyzstan', '', 'https://lh3.googleusercontent.com/a/ACg8ocKF_gOUw3fFwJNL4bS4kQ_n1JJjdcP0JSS5j0auXCxmT2ZUDhLN=s96-c', NULL, NULL, 'HOST', 'COMPLETED', NULL, '2025-11-10T05:21:53.839Z', '2025-11-11T03:03:07.345Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO users (id, email, "emailVerified", name, "fullName", username, bio, location, phone, "profilePictureUrl", "coverPhotoUrl", "dateOfBirth", role, "onboardingStatus", "isActive", "createdAt", "updatedAt")
VALUES ('438e5e5b-e1cb-4616-82d0-69eb2bbaa788', 'deanurman08@gmail.com', NULL, 'Dean Urman', 'Kei', 'okeilol', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJ8VBSbDgXDtcVwymHCmApXExT_iYz35GSqgMUm_3rFrtuY4w=s96-c', NULL, NULL, 'INFLUENCER', 'IN_PROGRESS', NULL, '2025-11-10T05:23:19.150Z', '2025-11-10T05:25:32.498Z')
ON CONFLICT (email) DO UPDATE SET "fullName" = EXCLUDED."fullName", "updatedAt" = EXCLUDED."updatedAt";

