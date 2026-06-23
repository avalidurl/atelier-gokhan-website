# Email routing — contact@gokhan.vc → operator@example.invalid

The site wires `mailto:contact@gokhan.vc` unconditionally (footer + legal pages), so the
contact address works for anyone composing mail. To actually **receive** mail at
`contact@gokhan.vc`, Cloudflare **Email Routing** must be enabled on the `gokhan.vc` zone with a
forwarding rule to `operator@example.invalid`.

> **Status (2026-06-22): not yet live.** Setting up routing requires a dedicated
> `CLOUDFLARE_EMAIL_TOKEN` (the existing deploy/API tokens lack email scope) **and** a one-time
> destination-verification click that only the founder can complete from the
> `operator@example.invalid` inbox. Until both happen, mail to `contact@gokhan.vc` is not
> delivered. This is a founder gate, not a site defect.

Two equivalent paths are documented below: the **dashboard** click-path and the **API** calls.

---

## A. Cloudflare dashboard (click-path)

1. Sign in to the Cloudflare dashboard and select the **gokhan.vc** zone.
2. Go to **Email** → **Email Routing**.
3. Click **Get started / Enable Email Routing**. Cloudflare will add the required **MX** and
   **TXT (SPF)** records for the zone automatically — accept them.
4. Under **Destination addresses**, click **Add destination** and enter
   `operator@example.invalid`. Cloudflare emails a verification link to that inbox.
5. **Founder step:** open `operator@example.invalid` and click the **verification link**. The
   destination shows **Verified** once done. (Routing cannot deliver to an unverified destination.)
6. Under **Routing rules** → **Custom addresses**, click **Create address**:
   - **Custom address:** `contact@gokhan.vc`
   - **Action:** **Send to an email** → `operator@example.invalid`
   - **Enable** the rule and save.
7. (Optional) Set the **Catch-all** action to _Drop_ or to the same destination, as preferred.
8. Test by emailing `contact@gokhan.vc` from an external account and confirm it arrives at
   `operator@example.invalid`.

---

## B. Cloudflare API (equivalent)

**Token scopes required** for `CLOUDFLARE_EMAIL_TOKEN`:
`Email Routing Rules:Edit`, `Email Routing Addresses:Edit`, `DNS:Edit`, `Zone:Read`.

Load the secret without echoing it, then run the calls. Never print or commit the token; redact
`Authorization` in any captured output.

```bash
set -a; . the operator environment >/dev/null 2>&1; set +a
AUTH="Authorization: Bearer $CLOUDFLARE_EMAIL_TOKEN"
ACCT="$CLOUDFLARE_ACCOUNT_ID"

# 1. Resolve the zone id for gokhan.vc
ZONE=$(curl -s -H "$AUTH" \
  "https://api.cloudflare.com/client/v4/zones?name=gokhan.vc" \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['result'][0]['id'])")

# 2. Enable Email Routing on the zone (adds MX/TXT records)
curl -s -X POST -H "$AUTH" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE/email/routing/enable"

# 3. Add + (founder) verify the destination address
curl -s -X POST -H "$AUTH" -H "Content-Type: application/json" \
  --data '{"email":"operator@example.invalid"}' \
  "https://api.cloudflare.com/client/v4/accounts/$ACCT/email/routing/addresses"
#    → Cloudflare emails a verification link to operator@example.invalid.
#      FOUNDER must click it before forwarding will deliver.

# 4. Create the forwarding rule contact@gokhan.vc -> operator@example.invalid
curl -s -X POST -H "$AUTH" -H "Content-Type: application/json" \
  --data '{
    "name":"contact@gokhan.vc forward",
    "enabled":true,
    "matchers":[{"type":"literal","field":"to","value":"contact@gokhan.vc"}],
    "actions":[{"type":"forward","value":["operator@example.invalid"]}]
  }' \
  "https://api.cloudflare.com/client/v4/zones/$ZONE/email/routing/rules"
```

### Verify it is live

```bash
# routing enabled?
curl -s -H "$AUTH" "https://api.cloudflare.com/client/v4/zones/$ZONE/email/routing" \
  | python3 -c "import sys,json;print('enabled:', json.load(sys.stdin)['result']['enabled'])"

# rule present + enabled?
curl -s -H "$AUTH" "https://api.cloudflare.com/client/v4/zones/$ZONE/email/routing/rules" \
  | python3 -c "import sys,json;[print(r['matchers'],r['actions'],r['enabled']) for r in json.load(sys.stdin)['result']]"

# destination verified? (non-null 'verified' timestamp)
curl -s -H "$AUTH" "https://api.cloudflare.com/client/v4/accounts/$ACCT/email/routing/addresses" \
  | python3 -c "import sys,json;[print(a['email'],a.get('verified')) for a in json.load(sys.stdin)['result']]"
```

Routing is fully live when: `enabled: true`, a rule matches `to == contact@gokhan.vc` forwarding to
`operator@example.invalid` with `enabled: true`, and the destination shows a non-null `verified`
timestamp.
