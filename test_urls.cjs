const https = require('https');

const urls = [
  'https://cdn.phototourl.com/free/2026-06-30-8759f85f-57a9-458f-b4ce-7a5e20101fdd.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-c0217af0-6e61-409e-b69a-a47fab7988fb.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-c993c845-4920-4dcc-b42e-b7e9ff839929.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-60688270-fcec-480d-b328-02de4de4306d.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-37055339-1460-4502-8958-006b864790dc.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-adb0d4a7-807a-4a91-bef2-454856c3a85e.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-182347a3-a8e7-4543-a8a4-f8e7b77b2f24.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-2947aaa2-877b-4d0a-adb9-2bbddefdb1d0.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-bc65caf1-cd05-4fe1-bb75-0614c1d99405.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-112c284d-8947-456f-87ae-a6016c733779.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-80252b45-1219-4bf7-bf01-5e886dd7516d.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-dbb6b6ec-753f-4029-9e0c-806abdc9b32c.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-221dd7ab-eb08-410a-bfa5-97bb7201c107.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-4cf8ad59-268e-4a64-9844-dc2e3c0b0292.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-d3d0f04f-7407-4e78-becc-ff2b0124c6de.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-01d7e2e6-7b89-493e-ba48-fc5c9429188a.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-6dfd2f78-2c70-4d52-a548-a006c7476834.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-7c5e27a6-f5ce-4cd9-bf06-38d5811c75c3.jpg',
  'https://cdn.phototourl.com/free/2026-06-30-9b4ef3b3-847d-419b-ab9e-a10c732569ba.jpg'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => resolve({ url, status: 500 }));
  });
}

async function main() {
  const results = await Promise.all(urls.map(checkUrl));
  const working = results.filter(r => r.status === 200).map(r => r.url);
  console.log("WORKING_URLS:", JSON.stringify(working, null, 2));
}

main();
