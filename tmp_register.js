(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Test User', email: `test+${Date.now()}@example.com`, password: 'password123' }),
      credentials: 'include'
    });
    console.log('Status:', res.status);
    const body = await res.json();
    console.log('Body:', body);
  } catch (err) {
    console.error('Request error:', err);
  }
})();