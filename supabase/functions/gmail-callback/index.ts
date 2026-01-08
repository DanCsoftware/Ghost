import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    // Frontend URL to redirect back to
    const frontendUrl = 'https://ghostnavi.lovable.app';

    if (error) {
      console.error('OAuth error from Google:', error);
      return Response.redirect(`${frontendUrl}?error=${encodeURIComponent(error)}`, 302);
    }

    if (!code) {
      console.error('No authorization code received');
      return Response.redirect(`${frontendUrl}?error=no_code`, 302);
    }

    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/gmail-callback`;

    if (!clientId || !clientSecret) {
      console.error('Google OAuth credentials not configured');
      return Response.redirect(`${frontendUrl}?error=config_error`, 302);
    }

    // Exchange authorization code for access token
    console.log('Exchanging authorization code for access token...');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData.error, tokenData.error_description);
      return Response.redirect(`${frontendUrl}?error=${encodeURIComponent(tokenData.error)}`, 302);
    }

    console.log('Successfully obtained access token');

    // Redirect back to frontend with access token (short-lived, passed via URL fragment for security)
    // Using fragment (#) instead of query param to prevent server logging
    const accessToken = tokenData.access_token;
    
    return Response.redirect(`${frontendUrl}#access_token=${encodeURIComponent(accessToken)}`, 302);
  } catch (error) {
    console.error('Error in gmail-callback:', error);
    return Response.redirect(`https://ghostnavi.lovable.app?error=server_error`, 302);
  }
});
