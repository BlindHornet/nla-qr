import { useParams } from 'react-router-dom';
import { InvalidState } from './InvalidState';

export function QRLandingPage() {
  const { id } = useParams();

  if (!id) {
    return <InvalidState />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>QR Landing Page</h1>
      <p>Landing state renderer for /qr/{id} will be connected to Firestore next.</p>
    </div>
  );
}
