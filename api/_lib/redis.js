// Minimal Upstash Redis client using its REST API (plain fetch, no packages).

async function pipeline(commands, token) {
  const url = process.env.KV_REST_API_URL;
  const key = token || process.env.KV_REST_API_TOKEN;
  if (!url || !key) throw new Error('Redis is not configured');

  const res = await fetch(url + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands)
  });
  if (!res.ok) throw new Error('Redis request failed with status ' + res.status);

  const out = await res.json();
  return out.map(function (item) {
    if (item.error) throw new Error('Redis error: ' + item.error);
    return item.result;
  });
}

async function command() {
  const results = await pipeline([Array.prototype.slice.call(arguments)]);
  return results[0];
}

module.exports = { pipeline, command };
