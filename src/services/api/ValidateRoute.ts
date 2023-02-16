import { NextApiRequest } from 'next';
import { protectedRoutes } from '@/routes';
import { AuthService } from './AuthService';
import SettingsTable from './SettingsTable';

const validateRoute = async (req: NextApiRequest) => {
  const isTokenValid: boolean = await AuthService.verifyToken(req.cookies.user || '');
  const isPasswordRequired: boolean = (await SettingsTable.findSetting('user_password_state')).value === 'yes';

  // If token is invalid or not set - redirecting from protected routes to login page
  if (isPasswordRequired && protectedRoutes.includes(String(req.url)) && !isTokenValid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default validateRoute;
