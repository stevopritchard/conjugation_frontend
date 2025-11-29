import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';

export default function RootLayout({ user, signOut }) {
  return (
    <>
      <Header user={user} signOut={signOut} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
