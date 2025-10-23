import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';

export default function RootLayout({ user }) {
  return (
    <>
      <Header user={user} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
