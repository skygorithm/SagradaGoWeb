# Fix: Firebase Admin & AI Chat on Render

## 1. Firebase Admin — "Cannot find module './firebaseServiceKey.json'"

The **SagradaGoAPI** backend has been updated to support Render. It now:

- Uses **env var** `FIREBASE_SERVICE_ACCOUNT_JSON` when set (Render/production).
- Falls back to **`config/firebaseServiceKey.json`** when the env var is not set (local dev).

### What you need to do on Render

1. Open your **SagradaGoAPI** (backend) service on [Render Dashboard](https://dashboard.render.com).
2. Go to **Environment**.
3. Add a variable:
   - **Key:** `FIREBASE_SERVICE_ACCOUNT_JSON`
   - **Value:** The **entire contents** of your `firebaseServiceKey.json` as **one line** (valid JSON).  
     Copy the full JSON from your Firebase service account file (Firebase Console → Project Settings → Service accounts → Generate new private key), then paste it as the value. Do not add extra quotes; Render stores it as a string.

4. **Save** and **redeploy** the service.

After redeploy, the backend will start without the "Cannot find module './firebaseServiceKey.json'" error, and sign-in will work.

---

## 2. AI Chat on Render

The AI chatbot uses **Google Gemini**. It works locally because `GEMINI_API_KEY` is in your `.env`. On Render it will only work if the same key is set there.

### What you need to do on Render

1. In the same **SagradaGoAPI** service on Render, go to **Environment**.
2. Add (or ensure you have):
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Google AI / Gemini API key (same one you use locally).

3. **Save** and **redeploy** if you added or changed it.

After that, the AI chat (SagradaBot) will work on Render the same way as locally.
