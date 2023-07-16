export const sendPushNotification = async (token, title, body) => {
    const FIREBASE_API_KEY = "AAAAqsWe4SY:APA91bG5T5gepMvg2Dh8NeYi2KG1AK9ACOYA22Qsmw-cbgtfXHYfJFMEF7aNViQDAw0ePEtYcm3hHvUBI8FpsWMEj2UFZ7WBSyEhU_HTguaw-pTIeLWR1g_4y92KmhUiK0NiHRU8LXIs";
  
    const message = {
      registration_ids: [token],
      notification: {
        title: title,
        body: body,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: "high",
        content_available: true,
      },
    };
  
    let headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "key=" + FIREBASE_API_KEY,
    });
  
    let response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers,
      body: JSON.stringify(message),
    });
  
    response = await response.json();
  };
  