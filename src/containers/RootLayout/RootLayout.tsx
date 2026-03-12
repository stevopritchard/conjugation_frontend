import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import type { User } from '../../types/user';

export default function RootLayout({
  user,
  signOut,
}: {
  user: User;
  signOut: () => void;
}) {
  return (
    <>
      <Header user={user} signOut={signOut} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
