import { useState } from 'react';
import AdminLogin from './AdminLogin';
import UploadSection from './UploadSection';
import ArticlesSection from './ArticlesSection';
import PasswordsSection from './PasswordsSection';
import './styles.css';

const TABS = ['upload', 'articles', 'passwords'];

export default function Admin() {
  const [adminPassword, setAdminPassword] = useState(null);
  const [tab, setTab] = useState('upload');

  const handleUnauth = () => setAdminPassword(null);

  if (!adminPassword) {
    return <AdminLogin onLogin={setAdminPassword} />;
  }

  return (
    <div className="admin">
      <div className="admin-nav">
        <div className="admin-nav__tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`admin-nav__tab ${t === tab ? 'admin-nav__tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="admin-nav__tab admin-nav__logout" onClick={handleUnauth}>
          logout
        </button>
      </div>

      {tab === 'upload' && <UploadSection adminPassword={adminPassword} />}
      {tab === 'articles' && (
        <ArticlesSection adminPassword={adminPassword} onUnauth={handleUnauth} />
      )}
      {tab === 'passwords' && (
        <PasswordsSection adminPassword={adminPassword} onUnauth={handleUnauth} />
      )}
    </div>
  );
}
