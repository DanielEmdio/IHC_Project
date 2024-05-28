import React from 'react';

const PopupComponent = ({ onClose }) => {
    return (
        <div style={{ background: 'white', padding: '20px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100, border: '5px solid #10b981' }}>
            <h2>Delete Account?</h2>
            <p>Are you sure you want to delete your account? Once confirmed, this account will be impossible to recover.</p>
            <a href="/register" style={{ backgroundColor: '#10b981', color: 'white', margin: '10px', padding: '13px', borderRadius: '5px' }}>Yes</a>

            <button
                style={{ backgroundColor: 'white', color: '#10b981', margin: '10px', padding: '10px', border: '1px solid #10b981', borderRadius: '5px' }}
                onClick={onClose}
            >
                No
            </button>
        </div>
    );
};

export default PopupComponent;
