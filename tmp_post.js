(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/food-partner/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'vk@18', password: 'password' })
    });
    console.log('Status:', res.status);
    const body = await res.text();
    console.log('Body:', body);
  } catch (err) {
    console.error('Request error:', err);
  }
})();