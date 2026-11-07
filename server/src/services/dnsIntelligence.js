import dns from 'node:dns';
import dnsp from 'node:dns/promises';

// Configure reliable DNS resolvers (Cloudflare 1.1.1.1 and Google 8.8.8.8) to prevent local resolver ECONNREFUSED
try {
  dns.setServers(['1.1.1.1', '8.8.8.8', '1.0.0.1']);
} catch (e) {
  // Use system default if setServers fails
}

/**
 * Domain & DNS Intelligence
 * Resolves A, MX, and TXT (SPF/DMARC) records, plus RDAP registration lookup
 */
export async function inspectDomainDns(domain) {
  const result = {
    domain,
    aRecords: [],
    mxRecords: [],
    txtRecords: [],
    spfRecord: null,
    dmarcRecord: null,
    rdap: {
      registrar: 'N/A',
      registrationDate: null,
      expirationDate: null,
      domainAgeDays: null
    }
  };

  // 1. Resolve A records
  try {
    result.aRecords = await dnsp.resolve4(domain);
  } catch (e) {
    try {
      const lookup = await dnsp.lookup(domain);
      if (lookup?.address) result.aRecords = [lookup.address];
    } catch (e2) {
      result.aRecords = [];
    }
  }

  // 2. Resolve MX records
  try {
    const mx = await dnsp.resolveMx(domain);
    result.mxRecords = mx.sort((a, b) => a.priority - b.priority);
  } catch (e) {
    result.mxRecords = [];
  }

  // 3. Resolve TXT records (for SPF)
  try {
    const txt = await dnsp.resolveTxt(domain);
    result.txtRecords = txt.map(chunks => chunks.join(''));
    const spf = result.txtRecords.find(t => t.toLowerCase().startsWith('v=spf1'));
    if (spf) result.spfRecord = spf;
  } catch (e) {
    result.txtRecords = [];
  }

  // 4. Resolve DMARC (_dmarc.<domain>)
  try {
    const dmarcTxt = await dnsp.resolveTxt(`_dmarc.${domain}`);
    const flat = dmarcTxt.map(chunks => chunks.join(''));
    const dmarc = flat.find(t => t.toLowerCase().startsWith('v=dmarc1'));
    if (dmarc) result.dmarcRecord = dmarc;
  } catch (e) {
    result.dmarcRecord = null;
  }

  // 5. Query RDAP (https://rdap.org/domain/<domain>) with browser-like headers and 4s timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const rdapRes = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/rdap+json, application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Turify/2.0'
      }
    });
    clearTimeout(timeout);

    if (rdapRes.ok) {
      const rdapData = await rdapRes.json();

      // Find events (registration, expiration)
      if (Array.isArray(rdapData.events)) {
        for (const evt of rdapData.events) {
          if (evt.eventAction === 'registration') {
            result.rdap.registrationDate = evt.eventDate;
            const regTime = new Date(evt.eventDate).getTime();
            if (!isNaN(regTime)) {
              const diffMs = Date.now() - regTime;
              result.rdap.domainAgeDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            }
          } else if (evt.eventAction === 'expiration') {
            result.rdap.expirationDate = evt.eventDate;
          }
        }
      }

      // Find registrar entity
      if (Array.isArray(rdapData.entities)) {
        for (const ent of rdapData.entities) {
          if (Array.isArray(ent.roles) && ent.roles.includes('registrar')) {
            if (ent.vcardArray && Array.isArray(ent.vcardArray[1])) {
              const fn = ent.vcardArray[1].find(item => item[0] === 'fn');
              if (fn && fn[3]) {
                result.rdap.registrar = fn[3];
                break;
              }
            }
            if (ent.handle) {
              result.rdap.registrar = ent.handle;
            }
          }
        }
      }
    }
  } catch (err) {
    // RDAP timeout or not available for TLD, non-blocking
  }

  return result;
}
