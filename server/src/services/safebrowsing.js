/**
 * Google Safe Browsing Lookup API v4 Client
 */
export async function scanWithSafeBrowsing(targetUrl, apiKey) {
  if (!apiKey) {
    return { error: 'Google Safe Browsing API key not configured', status: 'unconfigured' };
  }

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const payload = {
      client: {
        clientId: 'turify-threat-intel',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: targetUrl }]
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return { error: `Safe Browsing error (${response.status}): ${errText}`, status: 'failed' };
    }

    const data = await response.json();
    const matches = data.matches || [];

    const isFlagged = matches.length > 0;
    const threatTypes = matches.map(m => m.threatType);

    return {
      safe: !isFlagged,
      flagged: isFlagged,
      matchCount: matches.length,
      threatTypes,
      matches,
      verdict: isFlagged ? `Flagged by Google Safe Browsing (${threatTypes.join(', ')})` : 'Clear / Clean'
    };
  } catch (err) {
    return { error: err.message, status: 'error' };
  }
}
