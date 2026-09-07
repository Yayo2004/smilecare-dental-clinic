/**
 * Professional HTML email template for SmileCare daily reservation summary.
 * Logo delivered as an inline CID attachment so Gmail reliably displays it.
 */

const PRIMARY = '#2A9D8F'
const NAVY = '#1A2E44'
const LIGHT_BG = '#F0FAF8'
const WHITE = '#ffffff'

/** Inline SmileCare logo — referenced by content-id 'logo' (attached in notifier.js). */
function logoImg() {
  return `<img src="cid:logo" alt="SmileCare Dental Clinic" width="180" style="display:inline-block; max-width:200px; width:100%; height:auto;" />`
}

function reservationRow(r, index, showDate = false) {
  return `
  <tr>
    ${showDate ? `<td style="padding:14px 16px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#666;">${r.date}</td>` : ''}
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
 *  - 'today-overdue'   : escalation for all unverified reservations up to and
 *                        including today (08:00). Past dates are included so a
 *                        reservation is re-emailed every morning until checked.
 */
export function buildDailyEmail(reservations, date, siteUrl = 'https://smilecare.example.com', variant = 'tomorrow-morning') {
  const showDate = variant === 'today-overdue'
  const rows = reservations.map((r, i) => reservationRow(r, i + 1, showDate)).join('')

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
      title: `Rendez-vous non vérifiés`,
      intro: `Vous avez <strong style="color:${PRIMARY};">${reservations.length} rendez-vous non vérifiés</strong> (` + reservations.map((r) => r.date).filter((v, i, a) => a.indexOf(v) === i).join(', ') + `). Rappel envoyé chaque matin jusqu'à confirmation.`,
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
        <td style="background:${WHITE}; border-top:4px solid ${PRIMARY}; border-radius:16px 16px 0 0; padding:22px 32px; text-align:center;">
          ${logoImg()}
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="background:${WHITE}; padding:8px 32px 16px;">
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
                ${showDate ? '<th style="padding:12px 16px; text-align:left; font-size:12px; font-weight:700; color:' + NAVY + '; text-transform:uppercase; letter-spacing:0.5px;">Date</th>' : ''}
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
        <td style="background:${WHITE}; border-top:4px solid ${PRIMARY}; border-radius:16px 16px 0 0; padding:22px 32px; text-align:center;">
          ${logoImg()}
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="background:${WHITE}; padding:8px 32px 16px;">
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
        <td style="background:${WHITE}; border-top:4px solid ${PRIMARY}; border-radius:16px 16px 0 0; padding:22px 32px; text-align:center;">
          ${logoImg()}
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="background:${WHITE}; padding:8px 32px 16px; text-align:center;">
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
