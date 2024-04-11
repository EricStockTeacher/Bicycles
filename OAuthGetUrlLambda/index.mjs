import { google} from 'googleapis';

export const handler = async (event) => {
    const url = getGoogleOauthURL();

    return {url};
}
    
const getGoogleOauthURL = () => {
    const oauthClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.OAUTH_CALLBACK_URL
    );

    return oauthClient.generateAuthUrl( {
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ]
    })
}
