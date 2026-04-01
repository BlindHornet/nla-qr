export function InvalidState() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div className="page-card">
        <h2>Invalid QR Code</h2>
        <p>The requested QR code could not be found.</p>
      </div>
    </div>
  );
}
