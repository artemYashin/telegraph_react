import { NextRequest, NextResponse } from 'next/server';
import jwtDecode from 'jwt-decode';
import { authRoutes, adminRoutes } from './routes';
import { User } from './types/User';
import { AuthService } from './services/api/AuthService';
import { matchPath } from 'react-router-dom';

// eslint-disable-next-line consistent-return
export default async function middleware(request: NextRequest) {
  const userToken = request.cookies.get('user')?.value;
  let userData: User | null = null;

  if (userToken) {
    userData = jwtDecode(userToken) as User;
  }

  if (userData && userToken) {
    const isTokenValid = await AuthService.verifyToken(userToken);
    
    if (adminRoutes.some(route => matchPath(route, request.nextUrl.pathname))) {
      if (!userData) {
        return NextResponse.redirect(new URL('/login', request.url));
      } else if (!userData.admin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    if (!isTokenValid) {
      request.cookies.delete('user');
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('user');
      return response;
    }

    if (authRoutes.includes(request.nextUrl.pathname) && userData) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (adminRoutes.some(route => matchPath(route, request.nextUrl.pathname))) {
    return NextResponse.redirect(new URL('/login', request.url));
  } else if (authRoutes.includes(request.nextUrl.pathname) && userData) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
