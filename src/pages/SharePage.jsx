import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { ShareIcon } from "../components/CustomIcons";
import FileManager from '../utils/fileManager';
import { useNotifications } from '../contexts/NotificationContext'; // <-- added

const css = `:root{
  --page-bg: #efefef;
  --card-bg: #F8F7F7;
  --card-border: rgba(0,0,0,0.33);
  --card-shadow: rgba(0,0,0,0.1);
  --primary: #007AFF;
  --muted: #6b6b6b;
}
html,body{height:100%;margin:0;font-family:"Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;background:var(--page-bg);} 
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:20px;padding:32px 32px 150px 32px;box-sizing:border-box;position:relative;} 
.top-header { display:flex; align-items:center; gap:12px; z-index:10; } 
.top-header h1{ margin:0; width:fit-content; height:54px; line-height:54px; font-family:"Inter",sans-serif; font-weight:700; font-size:45px; color:#111; text-align:left; display:flex; align-items:center; gap:10px; } 
.card-wrap { width:100%; max-width:1048px; box-sizing:border-box; position:relative; } 
.card { width:100%; background: var(--card-bg); min-height:557px; border-radius:20px; border: 1px solid var(--card-border); box-shadow: 0px 4px 12px 0px var(--card-shadow); padding:24px 36px; box-sizing:border-box; position:relative; overflow:visible; display:flex; flex-direction:column; } 
.subtitle-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; } 
.subtitle { font-size:18px; color:#333; font-weight:600; } 
.share-link { color: #000000; font-size:20px; font-weight:600; cursor:pointer; } 
.top-row { display:flex; gap:18px; align-items:flex-start; flex:0 0 auto; } 
.email-row { flex: 1 1 auto; margin-top:0; display:flex; gap:12px; align-items:center; } 
.email-input { width: 969px; height: 81px; border-radius: 20px; padding: 17px 27px; box-sizing: border-box; border: 1px solid #00000080; background: #FFFFFF; font-size: 18px; outline: none; } 
.rows { margin-top:18px; display:flex; flex-direction:column; gap:12px; flex: 1 1 auto; min-height:0; overflow:auto; padding-right:8px; box-sizing:border-box; } 
.row { display:flex; align-items:center; justify-content:space-between; padding:12px 18px; border-radius:12px; background:transparent; box-sizing:border-box; min-width:0; } 
.left-group { display:flex; gap:12px; align-items:center; min-width:0; } 
.profile { display:flex; gap:12px; align-items:center; width:186px; height:41px; padding:6px 10px; border-radius:8px; background:#fff; box-sizing:border-box; flex-shrink:0; } 
.avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; background:linear-gradient(135deg,#d8d8d8,#bcbcbc); font-family:Inter, sans-serif; flex-shrink:0; } 
.name { font-size:16px; color:#222; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } 
.controls { display:flex; align-items:center; gap:12px; margin-left:12px; min-width:0; } 
.row-checkbox { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 15px; font-family: "Open Sans", sans-serif; user-select: none; } 
.row-checkbox input[type="checkbox"] { display: none; } 
.row-checkbox .checkmark { width: 22px; height: 22px; border: 2px solid #000; border-radius: 4px; position: relative; display: flex; align-items: center; justify-content: center; background: #fff; transition: all 0.2s ease; } 
.row-checkbox .checkmark::after { content: ""; position: absolute; right: -7px; bottom: -7px; width: 21px; height: 22px; border-right: 3px solid #000; border-bottom: 3px solid #000; border-radius: 0 0 8px 0; pointer-events: none; } 
.row-checkbox input[type="checkbox"]:checked + .checkmark::before { content: "✔"; color: #000; font-size: 16px; font-weight: bold; position: absolute; } 
.row-perm-select { appearance:none; -webkit-appearance:none; height:32px; min-width:110px; border-radius:8px; border:1px solid rgba(0,0,0,0.08); padding:2px 8px; background:#fff; font-weight:600; font-family:"Open Sans",sans-serif; cursor:pointer; box-sizing:border-box; font-size:14px; color:#222; } 
.row-perm-select:disabled { opacity:0.6; cursor:default; } 

/* Bottom-center Share Button */ 
.bottom-share-btn { 
  position: absolute; 
  bottom: 20px; 
  left: 50%; 
  transform: translateX(-50%); 
  width: 355px; 
  height: 56px; 
  border-radius: 12px; 
  background: var(--primary); 
  color: #fff; 
  border: none; 
  font-size: 18px; 
  font-weight: 600; 
  cursor: pointer; 
  box-shadow: 0 6px 20px rgba(0,0,0,0.2); 
  z-index: 150; 
} 
.bottom-share-btn:disabled { opacity: 0.6; cursor: default; } 

/* Sharing overlay */ 
.sharing-overlay { 
  position: fixed; 
  top: 0; left: 0; 
  width: 100%; 
  height: 100%; 
  background: rgba(255,255,255,0.6); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  z-index: 200; 
} 
.sharing-popup { 
  background: #fff; 
  color: #fff; 
  padding: 20px 30px; 
  border-radius: 12px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  gap: 15px; 
  box-shadow: 0 8px 20px rgba(0,0,0,0.2); 
} 
.spinner { 
  width: 50px; 
  height: 50px; 
  border: 5px solid rgba(0,0,0,0.2); 
  border-top-color: var(--primary); 
  border-radius: 50%; 
  animation: spin 1s linear infinite; 
} 
@keyframes spin { to { transform: rotate(360deg); } } 
.checkmark-success { 
  width: 50px; 
  height: 50px; 
  border-radius: 50%; 
  background: var(--primary); 
  color: #fff; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 24px; 
  font-weight: bold; 
  animation: pop 0.3s ease forwards; 
} 
@keyframes pop { 
  0% { transform: scale(0.5); opacity: 0; } 
  100% { transform: scale(1); opacity: 1; } 
} 
.sharing-text { 
  font-size: 16px; 
  font-weight: 600; 
  text-align: center; 
} 

@media (max-width:940px){ .card-wrap { width:92%; } .share-link { font-size:14px; } }`;

const initialUsers = [
  { id: 1, name: 'A. Kumar', email: 'akumar@example.com', initials: 'AK', permission: 'Can view', shared: false },
  { id: 2, name: 'R. Mehta', email: 'rmehta@example.com', initials: 'RM', permission: 'Can edit', shared: false },
  { id: 3, name: 'S. Verma', email: 'sverma@example.com', initials: 'SV', permission: 'Can view', shared: false },
  { id: 4, name: 'N. Patel', email: 'npatel@example.com', initials: 'NP', permission: 'Can view', shared: false },
  { id: 5, name: 'L. Roy', email: 'lroy@example.com', initials: 'LR', permission: 'Can view', shared: false },
  { id: 6, name: 'M. Singh', email: 'msingh@example.com', initials: 'MS', permission: 'Can edit', shared: false },
];

const UserRow = ({ user, selectedIds, handleCheckboxChange, handlePermChange, currentPerms }) => {
  const isSelected = selectedIds.includes(user.id);
  const isDisabled = !isSelected && !user.shared;
  const permValue = currentPerms[user.id] || user.permission;

  return (
    <div className="row" data-userid={user.id}>
      <div className="left-group">
        <div className="profile">
          <div className="avatar">{user.initials}</div>
          <div className="name">{user.name}</div>
        </div>
      </div>
      <div className="controls">
        <label className="row-checkbox">
          <span>Select</span>
          <input
            type="checkbox"
            value={user.id}
            checked={isSelected}
            onChange={(e) => handleCheckboxChange(user.id, e.target.checked)}
          />
          <span className="checkmark"></span>
        </label>
        <select
          className="row-perm-select"
          value={permValue}
          onChange={(e) => handlePermChange(user.id, e.target.value)}
          disabled={isDisabled}
        >
          <option value="Can view">Can view</option>
          <option value="Can edit">Can edit</option>
        </select>
      </div>
    </div>
  );
};

export default function SharePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutletContext?.() || {};
  const pendingFiles = location.state?.pendingFiles || [];
  const passwordSet = location.state?.passwordSet || false;
  const passwordValue = location.state?.passwordValue ?? null;

  const { helpers } = useNotifications(); // <-- use notification helpers

  const [users, setUsers] = useState(initialUsers);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPerms, setCurrentPerms] = useState({});
  const [emailInput, setEmailInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(''), 3500);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  const handleCheckboxChange = (id, checked) => {
    setSelectedIds(prev =>
      checked ? [...new Set([...prev, id])] : prev.filter(i => i !== id)
    );
  };

  const handlePermChange = (id, value) => {
    setCurrentPerms(prev => ({ ...prev, [id]: value }));
    setUsers(prev => prev.map(u => u.id === id ? { ...u, permission: value } : u));
  };

  const showToast = (msg) => setToastMsg(msg);

  const confirmShare = async () => {
    if (selectedIds.length === 0) {
      showToast('No users selected. Please choose users to share with.');
      return;
    }

    setIsSharing(true);
    setShareSuccess(false);

    try {
      const selectedUsers = users
        .filter(user => selectedIds.includes(user.id))
        .map(user => ({
          email: user.email,
          name: user.name,
          permission: currentPerms[user.id] || user.permission
        }));

      // Simulate delay to show spinner
      await new Promise(r => setTimeout(r, 1200));

      for (const file of pendingFiles) {
        // determine the password for this shared file: prefer file.password if already attached,
        // otherwise use the passwordValue passed via location.state
        const filePassword = (file && file.password) ? file.password : (passwordSet ? passwordValue : null);
        const sharedFile = {
          id: Date.now() + Math.random(),
          name: file.name || 'Untitled',
          size: file.size ? `${(file.size / 1024).toFixed(2)} KB` : file.sizeText || '1.2 MB',
          type: 'shared',
          folder: 'Shared',
          lastModified: new Date().toISOString(),
          sharedWith: selectedUsers,
          hasPassword: !!filePassword,
          password: filePassword || null,
          dataUrl: file.dataUrl || null,
          originalFile: file
        };
        FileManager.addFile(sharedFile);
      }

      setUsers(prev =>
        prev.map(user =>
          selectedIds.includes(user.id) ? { ...user, shared: true } : user
        )
      );

      // --- NOTIFICATION: trigger only after FileManager updates and before navigation ---
      try {
        const label = pendingFiles.length === 1 ? (pendingFiles[0].name || 'Untitled') : `${pendingFiles.length} files`;
        if (helpers && typeof helpers.shareFile === 'function') {
          helpers.shareFile(label, "You");
        } else {
          // fallback if NotificationContext isn't present in this route
          showToast(`${label} shared successfully.`);
        }
      } catch (notifyErr) {
        console.error('Notification helper failed:', notifyErr);
        showToast('Files shared successfully.');
      }

      setShareSuccess(true);
      setIsSharing(false);

      setTimeout(() => {
        navigate('/dashboard/success', {
          state: {
            sharedFiles: pendingFiles,
            sharedWith: selectedUsers,
            message: `Successfully shared ${pendingFiles.length} file${pendingFiles.length > 1 ? 's' : ''} with ${selectedUsers.length} ${selectedUsers.length === 1 ? 'person' : 'people'}`
          }
        });
      }, 1000);

    } catch (err) {
      console.error('Error sharing files:', err);
      showToast('Failed to share files. Please try again.');
      setIsSharing(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="stage">
        <div className="top-header" role="heading" aria-level="1">
          <h1>
            <ShareIcon className="w-11 h-14 text-blue-500" />
            Share
          </h1>
        </div>

        <div className="card-wrap">
          <div className="card">
            <div className="subtitle-row">
              <div className="subtitle">Share your file with your team mates</div>
              <div className="share-link">🔗 Share link</div>
            </div>

            <div className="top-row">
              <div className="email-row">
                <input
                  className="email-input"
                  placeholder="Enter names, email, or address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
            </div>

            <div className="rows">
              {users.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  selectedIds={selectedIds}
                  handleCheckboxChange={handleCheckboxChange}
                  handlePermChange={handlePermChange}
                  currentPerms={currentPerms}
                />
              ))}
            </div>

            {(isSharing || shareSuccess) && (
              <div className="sharing-overlay">
                <div className="sharing-popup">
                  {isSharing ? (
                    <div className="spinner"></div>
                  ) : (
                    <div className="checkmark-success">✔</div>
                  )}
                  <div className="sharing-text">
                    {isSharing ? 'Sharing your files...' : 'Files shared successfully!'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="bottom-share-btn"
          onClick={confirmShare}
          disabled={isSharing || selectedIds.length === 0}
        >
          {isSharing ? 'Sharing...' : 'Share'}
        </button>

        <div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>
      </div>
    </>
  );
}
