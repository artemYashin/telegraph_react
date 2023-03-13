import { NextApiRequest, NextApiResponse } from 'next';
import SettingsTable from '@/services/api/SettingsTable';

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  await SettingsTable.changeSetting({ name: 'user_password_state', value: req.body.passwordState });
  if (req.body.watermark?.size) {
    await SettingsTable.changeSetting({ name: 'watermark_size', value: req.body.watermark.size });
  }
  if (req.body.watermark?.opacity) {
    await SettingsTable.changeSetting({ name: 'watermark_opacity', value: req.body.watermark.opacity });
  }
  if (req.body.watermark?.state) {
    await SettingsTable.changeSetting({ name: 'watermark_state', value: req.body.watermark.state });
  }
  res.status(200).json({});
}
