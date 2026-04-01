import { NavLink } from 'react-router-dom';

const links = [
  { to: '/qr-codes', label: 'QR Codes' },
  { to: '/groups', label: 'Groups' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/send-email', label: 'Send Email' },
  { to: '/settings', label: 'Settings' }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 style={{ marginTop: 0 }}>NLA QR</h1>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
