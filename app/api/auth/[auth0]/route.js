
// app/api/auth/[auth0]/route.js
// from auth0, creates the authentication 
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();