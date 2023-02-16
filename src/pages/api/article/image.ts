import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next/types';

export const config = {
  api: {
    bodyParser: false,
  },
};
function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>,
) {
  const fileName = `${makeid(10)}.png`;
  if (!existsSync('public/upload')) {
    mkdirSync('public/upload');
  }
  writeFileSync(`public/upload/${fileName}`, req.read());
  res.status(200).json({ src: `/upload/${fileName}` });
}
