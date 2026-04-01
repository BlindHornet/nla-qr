import { Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { QRCodesPage } from './features/qr-codes/QRCodesPage';
import { GroupsPage } from './features/groups/GroupsPage';
import { ContactsPage } from './features/contacts/ContactsPage';
import { SendEmailPage } from './features/send-email/SendEmailPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { QRLandingPage } from './pages/qr-landing/QRLandingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/qr/:id" element={<QRLandingPage />} />
      <Route
        path="/*"
        element={
          <div className="app-shell">
            <Sidebar />
            <main className="main">
              <Routes>
                <Route path="/" element={<Navigate to="/qr-codes" replace />} />
                <Route path="/qr-codes" element={<QRCodesPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/send-email" element={<SendEmailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}
