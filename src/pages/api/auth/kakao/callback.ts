import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;
  const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || '',
      redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '',
      code: code as string,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (tokenData.error) {
    console.error('Error obtaining token:', tokenData.error);
    res.status(400).json({ message: 'Error obtaining token', error: tokenData.error });
    return;
  }

  const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const user = await userResponse.json();
  if (!user.id) {
    console.error('Authentication failed');
    res.status(401).json({ message: 'Authentication failed' });
    return;
  }

  console.log('User info:', user);
  console.log('Token info:', tokenData);

  res.setHeader('Set-Cookie', serialize('auth', JSON.stringify({ user, token: tokenData }), { path: '/' }));
  res.redirect('/landing');
};
