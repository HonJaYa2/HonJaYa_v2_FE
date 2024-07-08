import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = cookie.parse(req.headers.cookie || '');
  if (user) {
    res.status(200).json(JSON.parse(user));
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
}
