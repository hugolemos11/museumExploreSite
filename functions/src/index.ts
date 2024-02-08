import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const sendArtworkNotification = functions.firestore
  .document('artworks/{artworkId}')
  .onCreate(async (snapshot, context) => {
    const artworkData = snapshot.data();
    const artworkTitle = artworkData.title; // Adjust accordingly

    // Get user tokens from Firestore (you need to have a 'tokens' collection in Firestore with user tokens)
    const usersSnapshot = await admin.firestore().collection('tokens').get();
    const tokens = usersSnapshot.docs.map((doc) => doc.data().token);

    // Send notification to all users
    const payload = {
      notification: {
        title: 'New Artwork Created!',
        body: `Check out the latest artwork: ${artworkTitle}`,
      },
    };

    await admin.messaging().sendToDevice(tokens, payload);
  });