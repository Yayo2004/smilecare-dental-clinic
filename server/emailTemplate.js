/**
 * Professional HTML email template for SmileCare daily reservation summary.
 * Embedded logo via SVG (no external images needed).
 */

const PRIMARY = '#2A9D8F'
const NAVY = '#1A2E44'
const LIGHT_BG = '#F0FAF8'
const WHITE = '#ffffff'

function toothSvg() {
  return `<svg viewBox="0 0 64 64" width="28" height="28" fill="${WHITE}"><path d="M32 4C22.6 4 14.9 11 14.9 20.4c0 6 3.2 9.8 5.4 14.6 2.3 5 3.1 9.4 3.9 15.4.6 4.5 2.4 6.8 5.4 6.8 2.4 0 2.8-2.8 2.4-7.3-.2-2.3-.7-4.2-.4-7.1.3-3.6 1.4-6.8 3.6-9.4 1.9-2.2 3.6-4.8 5.2-7.4 1.6 2.6 3.3 5.2 5.2 7.4 2.2 2.6 3.3 5.8 3.6 9.4.3 2.9-.2 4.8-.4 7.1-.4 4.5 0 7.3 2.4 7.3 3 0 4.8-2.3 5.4-6.8.8-6 1.6-10.4 3.9-15.4 2.2-4.8 5.4-8.6 5.4-14.6C49.1 11 41.4 4 32 4z"/></svg>`
}

function reservationRow(r, index) {
  return `
  <tr>
    <td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:${NAVY};">
      <span style="display:inline-block; width:24px; height:24px; line-height:24px; text-align:center; border-radius:50%; background:${PRIMARY}; color:${WHITE}; font-size:12px; font-weight:700; margin-right:8px;">${index}</span>
      <strong>${r.name}</strong>
    </td>
    <td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px;">
      <span style="display:inline-block; background:${LIGHT_BG}; color:${PRIMARY}; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600;">${r.service}</span>
    </td>
    <td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#666;">
      ${r.email || '—'}
    </td>
    <td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#666;">
      📞 ${r.phone}
    </td>
  </tr>`
}

/**
 * Build the reminder email. `variant` controls the title & message:
 *  - 'tomorrow-morning': first reminder for tomorrow (09:00)
 *  - 'tomorrow-evening': second reminder for tomorrow (19:00)
 *  - 'today-overdue'   : escalation for today's unverified reservations (08:00)
 */
export function buildDailyEmail(reservations, date, siteUrl = 'https://smilecare.example.com', variant = 'tomorrow-morning') {
  const rows = reservations.map((r, i) => reservationRow(r, i + 1)).join('')

  const copy = {
    'tomorrow-morning': {
      emoji: '🔔',
      title: `Rendez-vous de demain (${date})`,
      intro: `Vous avez <strong style="color:${PRIMARY};">${reservations.length} rendez-vous</strong> demain (${date}) à vérifier.`,
    },
    'tomorrow-evening': {
      emoji: '🌙',
      title: `Rappel du soir — demain (${date})`,
      intro: `Vous avez encore <strong style="color:${PRIMARY};">${reservations.length} rendez-vous</strong> demain (${date}) qui ne sont pas encore vérifiés.`,
    },
    'today-overdue': {
      emoji: '⚠️',
      title: `Rendez-vous aujourd'hui (${date}) non vérifiés`,
      intro: `Vous avez <strong style="color:${PRIMARY};">${reservations.length} rendez-vous</strong> aujourd'hui (${date}) que vous n'avez pas encore vérifiés.`,
    },
  }[variant] || {
    emoji: '🔔',
    title: `Rendez-vous du ${date}`,
    intro: `Vous avez <strong style="color:${PRIMARY};">${reservations.length} rendez-vous</strong> le ${date}.`,
  }

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
            ${copy.emoji} ${copy.title}
          </h1>
          <p style="margin:8px 0 0; font-size:15px; color:#666;">
            ${copy.intro}
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
                <th style="padding:12px 16px; text-align:left; font-size:12px; font-weight:700; color:${NAVY}; text-transform:uppercase; letter-spacing:0.5px;">Service</th>
                <th style="padding:12px 16px; text-align:left; font-size:12px; font-weight:700; color:${NAVY}; text-transform:uppercase; letter-spacing:0.5px;">Email</th>
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

/**
 * Immediate notification email when a single new reservation is booked.
 */
export function buildImmediateEmail(r, siteUrl = 'http://localhost:5173') {
  const adminUrl = `${siteUrl}/#/admin`

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
            📅 Nouveau rendez-vous
          </h1>
          <p style="margin:8px 0 0; font-size:15px; color:#666;">
            Un nouveau rendez-vous vient d'être réservé.
          </p>
        </td>
      </tr>

      <!-- Reservation Card -->
      <tr>
        <td style="background:${WHITE}; padding:0 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
            <tbody>
              <tr>
                <td style="padding:16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:${NAVY};">
                  <strong style="color:${NAVY};">Patient</strong>
                </td>
                <td style="padding:16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#666;">
                  ${r.name}
                </td>
              </tr>
              <tr>
                <td style="padding:16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:${NAVY};">
                  <strong style="color:${NAVY};">Date</strong>
                </td>
                <td style="padding:16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#666;">
                  ${r.date}
                </td>
              </tr>
              <tr>
                <td style="padding:16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:${NAVY};">
                  <strong style="color:${NAVY};">Service</strong>
                </td>
                <td style="padding:16px; border-bottom:1px solid #e5e7eb; font-size:14px;">
                  <span style="display:inline-block; background:${LIGHT_BG}; color:${PRIMARY}; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600;">${r.service}</span>
                </td>
              </tr>
              ${r.email ? `<tr>
                <td style="padding:16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:${NAVY};">
                  <strong style="color:${NAVY};">Email</strong>
                </td>
                <td style="padding:16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#666;">
                  ${r.email}
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding:16px; font-size:14px; color:${NAVY};">
                  <strong style="color:${NAVY};">Téléphone</strong>
                </td>
                <td style="padding:16px; font-size:14px; color:#666;">
                  📞 ${r.phone}
                </td>
              </tr>
              ${r.message ? `<tr>
                <td style="padding:16px; font-size:14px; color:${NAVY};">
                  <strong style="color:${NAVY};">Message</strong>
                </td>
                <td style="padding:16px; font-size:14px; color:#666;">
                  ${r.message}
                </td>
              </tr>` : ''}
            </tbody>
          </table>
        </td>
      </tr>

      <!-- Website Button -->
      <tr>
        <td style="background:${WHITE}; padding:28px 32px; text-align:center;">
          <a href="${adminUrl}" style="display:inline-block; background:${PRIMARY}; color:${WHITE}; text-decoration:none; padding:14px 36px; border-radius:10px; font-size:15px; font-weight:700; letter-spacing:0.3px;">
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

/**
 * Password reset email — sends a 6-digit verification code.
 */
export function buildResetEmail(code) {
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
        <td style="background:${WHITE}; padding:32px 32px 16px; text-align:center;">
          <h1 style="margin:0; font-size:22px; color:${NAVY}; font-weight:700;">
            🔑 Réinitialisation du mot de passe
          </h1>
          <p style="margin:8px 0 0; font-size:15px; color:#666;">
            Votre code de réinitialisation est :
          </p>
        </td>
      </tr>

      <!-- Code Box -->
      <tr>
        <td style="background:${WHITE}; padding:0 32px 32px;">
          <div style="background:${LIGHT_BG}; border:2px dashed ${PRIMARY}; border-radius:14px; padding:20px; text-align:center;">
            <span style="font-size:34px; font-weight:800; color:${PRIMARY}; letter-spacing:8px;">${code}</span>
          </div>
          <p style="margin:14px 0 0; font-size:13px; color:#999; text-align:center;">
            Ce code expire dans 15 minutes.
          </p>
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
