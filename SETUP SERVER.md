# Connect the Career Finding Guide results server

You do this once, in about 5 minutes. It gives the form a private Google Sheet to save results in.

Never paste your leader code into chat, email or this repo. It goes only into Google.

## 1. Create the server

1. Sign in at https://script.google.com with your Google account and click **New project**. Name it `Career Finding Guide`.
2. Delete the sample code. Open `server/Code.gs` from this folder, copy all of it, paste it in, and click Save.
3. Click **Project Settings** (the gear icon). Under **Script properties**, add this:

| Property | Value |
|---|---|
| `LEADER_CODE` | a code only leaders know, at least 10 characters |

4. Go back to **Editor**, choose the `setup` function at the top, and click **Run**. Approve the Google permissions it asks for. Google may warn the app is unverified; choose **Advanced**, then continue. It is your own script.

This creates a private Google Sheet called `Career Finding Guide Results` in your Drive.

## 2. Publish the server

1. Click **Deploy**, then **New deployment**, then the gear icon, then **Web app**.
2. Set **Execute as** to **Me**.
3. Set **Who has access** to **Anyone**. Candidates need this to submit. Only the leader code can read results.
4. Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.

## 3. Send me the URL

Paste the `/exec` URL into our chat. It isn't secret. I'll connect the form and test it end to end.

## Later changes

- **Change the leader code:** edit `LEADER_CODE` in Script properties.
- **Change the daily limit:** add a property `DAILY_LIMIT`. The default is 200 submissions a day.
- **After changing `Code.gs`:** Deploy, Manage deployments, edit, New version. The URL stays the same.
- **Results:** don't rename columns or delete the first row of the Sheet.
