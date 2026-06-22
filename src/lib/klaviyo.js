// Klaviyo client-side integration (no backend / no secret keys).
// Uses the public API key (company/site ID) and the client endpoints, which
// are designed to be called directly from the browser.
//
// Required env (safe to expose):
//   VITE_KLAVIYO_PUBLIC_KEY  — your Klaviyo public API key / site ID (6 chars)
//   VITE_KLAVIYO_LIST_ID     — the list to subscribe leads to (6 chars)

const PUBLIC_KEY = import.meta.env.VITE_KLAVIYO_PUBLIC_KEY;
const LIST_ID = import.meta.env.VITE_KLAVIYO_LIST_ID;
const REVISION = '2024-10-15';

export function isKlaviyoConfigured() {
  return Boolean(PUBLIC_KEY && LIST_ID);
}

/**
 * Submit a "Book a Call" lead to Klaviyo: upsert the profile (with custom
 * properties) and subscribe it to the configured list.
 * @param {{firstName?:string,lastName?:string,email:string,phone?:string,company?:string,message?:string}} data
 */
export async function submitBookCallLead(data) {
  if (!isKlaviyoConfigured()) {
    throw new Error(
      'Klaviyo is not configured. Set VITE_KLAVIYO_PUBLIC_KEY and VITE_KLAVIYO_LIST_ID.'
    );
  }

  const properties = {};
  if (data.company) properties.company = data.company;
  if (data.message) properties.message = data.message;
  properties.source = 'Book a 20-Minute Call';

  // 1) Upsert the profile with name / phone / custom properties.
  const profileRes = await fetch(
    `https://a.klaviyo.com/client/profiles/?company_id=${PUBLIC_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        revision: REVISION,
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: data.email,
            first_name: data.firstName || undefined,
            last_name: data.lastName || undefined,
            phone_number: data.phone || undefined,
            properties,
          },
        },
      }),
    }
  );

  // 409 = profile already exists; that's fine, the subscription call still works.
  if (!profileRes.ok && profileRes.status !== 409) {
    const body = await profileRes.text().catch(() => '');
    throw new Error(`Klaviyo profile error (${profileRes.status}): ${body}`);
  }

  // 2) Subscribe the profile to the list (and consent to email).
  const subRes = await fetch(
    `https://a.klaviyo.com/client/subscriptions/?company_id=${PUBLIC_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        revision: REVISION,
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: data.email,
                  first_name: data.firstName || undefined,
                  last_name: data.lastName || undefined,
                  phone_number: data.phone || undefined,
                  properties,
                },
              },
            },
          },
          relationships: {
            list: { data: { type: 'list', id: LIST_ID } },
          },
        },
      }),
    }
  );

  if (!subRes.ok) {
    const body = await subRes.text().catch(() => '');
    throw new Error(`Klaviyo subscription error (${subRes.status}): ${body}`);
  }

  return true;
}
