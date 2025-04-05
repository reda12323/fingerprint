// App.jsx
import React, { useState } from 'react';

function App() {
  const [status, setStatus] = useState('');
  const [credId, setCredId] = useState(null);

  const register = async () => {
    try {
      const publicKey = {
        challenge: Uint8Array.from('randomChallenge123', c => c.charCodeAt(0)),
        rp: { name: "My WebAuthn App" },
        user: {
          id: Uint8Array.from('user123', c => c.charCodeAt(0)),
          name: 'testuser@example.com',
          displayName: 'Test User'
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({ publicKey });
      const id = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      setCredId(id);
      localStorage.setItem("fingerprintCred", id);
      setStatus("✅ Fingerprint registered successfully.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Registration failed or cancelled.");
    }
  };

  const verify = async () => {
    try {
      const savedId = localStorage.getItem("fingerprintCred");
      if (!savedId) {
        setStatus("❌ No credential registered.");
        return;
      }

      const publicKey = {
        challenge: Uint8Array.from('randomChallengeVerify', c => c.charCodeAt(0)),
        allowCredentials: [{
          id: Uint8Array.from(atob(savedId), c => c.charCodeAt(0)),
          type: "public-key",
          transports: ["internal"]
        }],
        timeout: 60000,
        userVerification: "required"
      };

      const assertion = await navigator.credentials.get({ publicKey });
      if (assertion) {
        setStatus("✅ Fingerprint verified!");
      } else {
        setStatus("❌ Verification failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Fingerprint verification error.");
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h2>🔐 WebAuthn Fingerprint Auth (React)</h2>
      <button onClick={register} style={{ marginRight: 10 }}>Register Fingerprint</button>
      <button onClick={verify}>Verify Fingerprint</button>

      <div style={{ marginTop: 20 }}>
        <strong>Status:</strong> {status}
      </div>

      {credId && (
        <div style={{ marginTop: 20 }}>
          <strong>Credential ID:</strong> {credId}
        </div>
      )}
    </div>
  );
}

export default App;
