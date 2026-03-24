import { GmailMessage } from './gmail';
import { ParsedPackage } from './types';

interface ParserRule {
  name: string;
  detectFrom: RegExp[];
  detectSubject: RegExp[];
  detectBody: RegExp[];
  trackingPattern?: RegExp;
  extractStatus: (subject: string, body: string) => ParsedPackage['status'];
}

const RULES: ParserRule[] = [
  {
    name: 'דואר ישראל',
    detectFrom: [/israelpost|דואר ישראל/i],
    detectSubject: [/דבר דואר|חבילה.*ממתינה|דואר רשום/i],
    detectBody: [/דואר ישראל|israel post/i],
    trackingPattern: /\b(RR\d{9}IL)\b/i,
    extractStatus: (subj, body) => {
      if (/ממתין.*לאיסוף|מוכנ.*לאיסוף|ממתינה/i.test(subj + body)) return 'ready_for_pickup';
      if (/נשלח|בדרך|יצא/i.test(subj + body)) return 'in_transit';
      return 'new';
    },
  },
  {
    name: 'Amazon',
    detectFrom: [/amazon/i],
    detectSubject: [/shipped|delivered|out for delivery|dispatched|your.*order/i],
    detectBody: [/amazon\.com|amazon\.co/i],
    trackingPattern: /\b(TBA\d{10,})\b/i,
    extractStatus: (subj, body) => {
      if (/delivered/i.test(subj + body)) return 'ready_for_pickup';
      if (/shipped|dispatched|out for delivery/i.test(subj + body)) return 'in_transit';
      return 'new';
    },
  },
  {
    name: 'AliExpress',
    detectFrom: [/aliexpress/i],
    detectSubject: [/shipped|your order|הזמנה.*נשלחה|tracking/i],
    detectBody: [/aliexpress/i],
    trackingPattern: /\b([A-Z]{2}\d{9}[A-Z]{2})\b/,
    extractStatus: (subj, body) => {
      if (/delivered|הגיעה/i.test(subj + body)) return 'ready_for_pickup';
      if (/shipped|נשלח/i.test(subj + body)) return 'in_transit';
      return 'new';
    },
  },
  {
    name: 'Shein',
    detectFrom: [/shein/i],
    detectSubject: [/shipped|delivery|חבילה|משלוח/i],
    detectBody: [/shein\.com/i],
    extractStatus: (subj, body) => {
      if (/delivered|נמסר/i.test(subj + body)) return 'ready_for_pickup';
      if (/shipped|בדרך/i.test(subj + body)) return 'in_transit';
      return 'new';
    },
  },
  {
    name: 'FedEx',
    detectFrom: [/fedex/i],
    detectSubject: [/shipment|tracking|delivery|package/i],
    detectBody: [/fedex\.com/i],
    trackingPattern: /\b(\d{12,22})\b/,
    extractStatus: (subj, body) => {
      if (/delivered/i.test(subj + body)) return 'picked_up';
      if (/out for delivery/i.test(subj + body)) return 'ready_for_pickup';
      if (/in transit|shipment/i.test(subj + body)) return 'in_transit';
      return 'new';
    },
  },
  {
    name: 'DHL',
    detectFrom: [/dhl/i],
    detectSubject: [/shipment|delivery|tracking/i],
    detectBody: [/dhl\.com/i],
    trackingPattern: /\b(\d{10,11})\b/,
    extractStatus: (subj, body) => {
      if (/delivered/i.test(subj + body)) return 'picked_up';
      if (/transit|on its way/i.test(subj + body)) return 'in_transit';
      return 'new';
    },
  },
  {
    name: 'iHerb',
    detectFrom: [/iherb/i],
    detectSubject: [/shipped|order|tracking/i],
    detectBody: [/iherb\.com/i],
    extractStatus: (subj, body) => {
      if (/delivered/i.test(subj + body)) return 'ready_for_pickup';
      if (/shipped/i.test(subj + body)) return 'in_transit';
      return 'new';
    },
  },
];

// General Hebrew patterns for unknown senders
const GENERAL_HEBREW_PATTERNS = [
  /חבילה/,
  /משלוח/,
  /הזמנה.*נשלחה/,
  /ממתין.*לאיסוף/,
  /tracking/i,
  /shipped/i,
  /delivered/i,
  /out for delivery/i,
];

export function parseEmail(msg: GmailMessage): ParsedPackage | null {
  const combined = `${msg.subject} ${msg.from} ${msg.body}`;

  for (const rule of RULES) {
    const fromMatch = rule.detectFrom.some((r) => r.test(msg.from));
    const subjMatch = rule.detectSubject.some((r) => r.test(msg.subject));
    const bodyMatch = rule.detectBody.some((r) => r.test(msg.body));

    if (fromMatch || (subjMatch && bodyMatch)) {
      let trackingNumber: string | undefined;
      if (rule.trackingPattern) {
        const match = combined.match(rule.trackingPattern);
        if (match) trackingNumber = match[1];
      }

      return {
        storeName: rule.name,
        trackingNumber,
        status: rule.extractStatus(msg.subject, msg.body),
        receivedDate: new Date(msg.date).toISOString(),
        source: 'email',
        rawMessage: msg.body.slice(0, 500),
        emailSubject: msg.subject,
        emailFrom: msg.from,
      };
    }
  }

  // Check general patterns
  const isPackageRelated = GENERAL_HEBREW_PATTERNS.some((p) => p.test(combined));
  if (isPackageRelated) {
    // Try to extract tracking number with general pattern
    const trackingMatch = combined.match(/\b([A-Z]{2}\d{9}[A-Z]{2})\b/);

    let status: ParsedPackage['status'] = 'new';
    if (/ממתין.*לאיסוף|מוכן.*לאיסוף|delivered/i.test(combined)) status = 'ready_for_pickup';
    else if (/נשלח|בדרך|shipped|in transit/i.test(combined)) status = 'in_transit';

    // Extract sender name
    const fromName = msg.from.replace(/<.*>/, '').trim() || 'לא ידוע';

    return {
      storeName: fromName,
      trackingNumber: trackingMatch?.[1],
      status,
      receivedDate: new Date(msg.date).toISOString(),
      source: 'email',
      rawMessage: msg.body.slice(0, 500),
      emailSubject: msg.subject,
      emailFrom: msg.from,
    };
  }

  return null;
}

export function parseEmails(messages: GmailMessage[]): ParsedPackage[] {
  const results: ParsedPackage[] = [];
  const seen = new Set<string>();

  for (const msg of messages) {
    const parsed = parseEmail(msg);
    if (parsed) {
      // Deduplicate by tracking number
      const key = parsed.trackingNumber || `${parsed.storeName}-${parsed.receivedDate}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push(parsed);
      }
    }
  }

  return results;
}
