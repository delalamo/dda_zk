import React from 'react';

const NOTES_URL = 'https://notes.delalamo.xyz/';

function NotesPage() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '56px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <iframe
        src={NOTES_URL}
        title="Notes"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default NotesPage;
