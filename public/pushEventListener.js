self.addEventListener('push', (e) => {
  console.warn('[PushManager]: push event');
  const title = e.data.title || 'SaberNews';
  e.waitUntil(
      self.registration.showNotification(title),
  );
});
