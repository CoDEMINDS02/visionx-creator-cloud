import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastStack from '../common/Toast';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
      <ToastStack />
    </div>
  );
}
