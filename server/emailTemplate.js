/**
 * Professional HTML email template for SmileCare daily reservation summary.
 * Embedded logo via SVG (no external images needed).
 */

const PRIMARY = '#2A9D8F'
const NAVY = '#1A2E44'
const LIGHT_BG = '#F0FAF8'
const WHITE = '#ffffff'

function toothSvg() {
  return `<svg viewBox="0 0 64 64" width="28" height="28" fill="${WHITE}"><path d="M32 46c-1.2 0-2.2-.5-3.2-1.4-3.4-3-8.5-7.7-8.5-14.9 0-4.7 3.6-8.4 8.3-8.4 2.1 0 3.7 1.1 4.5 2.2.7-1.1 2.3-2.2 4.4-2.2 4.7 0 8.3 3.7 8.3 8.4 0 7.2-5.1 11.9-8.5 14.9-.9.9-2 1.4-3.3 1.4z"/></svg>`
}

function reservationRow(r, index) {
  return `
  <tr>
    <td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:${NAVY};">
      <span style="display:inline-block; width:24px; height:24px; line-height:24px; text-align:center; border-radius:50%; background:${PRIMARY}; color:${WHITE}; font-size:12px; font-weight:700; margin-right:8px;">${index}</span>
      <strong>${r.name}</strong>
    </td>
    <td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#666;">
      ${r.time}
    </td>
    <td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px;">
      <span style="display:inline-block; background:${LIGHT_BG}; color:${PRIMARY}; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600;">${r.service}</span>
    </td>
    <td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#666;">
      📞 ${r.phone}
    </td>
  </tr>`
}

export function buildDailyEmail(reservations, date, siteUrl = 'https://smilecare.example.com') {
  const rows = reservations.map((r, i) => reservationRow(r, i + 1)).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9; padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

      <!-- Logo Header -->
      <tr>
        <td style="background:${PRIMARY}; border-radius:16px 16px 0 0; padding:28px 32px; text-align:center;">
          <div style="display:inline-block; background:rgba(255,255,255,0.15); border-radius:12px; padding:8px 10px; vertical-align:middle;">
            ${toothSvg()}
          </div>
          <span style="font-size:22px; font-weight:700; color:${WHITE}; vertical-align:middle; margin-left:10px; letter-spacing:0.5px;">
            SmileCare <span style="font-weight:400; font-size:13px; opacity:0.85; display:block; letter-spacing:1.5px; text-transform:uppercase;">Dental Clinic</span>
          </span>
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="background:${WHITE}; padding:32px 32px 16px;">
          <h1 style="margin:0; font-size:22px; color:${NAVY}; font-weight:700;">
            🔔 Rendez-vous du ${date}
          </h1>
          <p style="margin:8px 0 0; font-size:15px; color:#666;">
            Vous avez <strong style="color:${PRIMARY};">${reservations.length} rendez-vous</strong> prévus ${date === new Date().toISOString().slice(0, 10) ? "aujourd'hui" : 'demain'}.
          </p>
        </td>
      </tr>

      <!-- Reservations Table -->
      <tr>
        <td style="background:${WHITE}; padding:0 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
            <thead>
              <tr style="background:${LIGHT_BG};">
                <th style="padding:12px 16px; text-align:left; font-size:12px; font-weight:700; color:${NAVY}; text-transform:uppercase; letter-spacing:0.5px;">Patient</th>
                <th style="padding:12px 16px; text-align:left; font-size:12px; font-weight:700; color:${NAVY}; text-transform:uppercase; letter-spacing:0.5px;">Heure</th>
                <th style="padding:12px 16px; text-align:left; font-size:12px; font-weight:700; color:${NAVY}; text-transform:uppercase; letter-spacing:0.5px;">Service</th>
                <th style="padding:12px 16px; text-align:left; font-size:12px; font-weight:700; color:${NAVY}; text-transform:uppercase; letter-spacing:0.5px;">Téléphone</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </td>
      </tr>

      <!-- Website Button -->
      <tr>
        <td style="background:${WHITE}; padding:28px 32px; text-align:center;">
          <a href="${siteUrl}" style="display:inline-block; background:${PRIMARY}; color:${WHITE}; text-decoration:none; padding:14px 36px; border-radius:10px; font-size:15px; font-weight:700; letter-spacing:0.3px;">
            Contacter mes patients →
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:${LIGHT_BG}; border-radius:0 0 16px 16px; padding:24px 32px; text-align:center;">
          <p style="margin:0; font-size:12px; color:#999;">
            Cet email a été envoyé automatiquement par SmileCare Dental Clinic.
          </p>
          <p style="margin:6px 0 0; font-size:12px; color:#999;">
            24 Rue de la Santé, 75013 Paris · +212 0644356664
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}
