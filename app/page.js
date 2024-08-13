'use client';
import { Box, Typography, Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user, isLoading } = useUser();

  const handleLogin = () => {
    window.location.href = '/api/auth/login?returnTo=/me';
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout?returnTo=/';
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h3">
        {user ? `Welcome, ${user.name}` : 'Welcome to the Pantry Tracker'}
      </Typography>
      <Button
        variant="contained"
        onClick={user ? handleLogout : handleLogin}
      >
        {user ? 'Logout' : 'Login'}
      </Button>
    </Box>
  );
}


