import { writeFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>,
) {
  writeFileSync('public/logo.png', req.read());
  res.status(200).json({});
}
