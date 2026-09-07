import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, KeyRound, Loader2, RefreshCw } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/** Forgot-password modal — code is auto-sent to the doctor's email. */
export default function ForgotPasswordModal({ show, onClose, lang, t }) {
  const [code, setCode] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [sending, setSending] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const requestCode = async () => {
    setError('')
    setSending(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) {
        setError(lang === 'fr' ? "Erreur lors de l'envoi du code" : 'Error sending code')
        return
      }
      const data = await res.json()
      setSentTo(data.email || '')
      setCodeSent(true)
    } catch {
      setError(lang === 'fr' ? 'Erreur de connexion' : 'Connection error')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (show) requestCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  const handleClose = () => {
    setCode('')
    setNewPass('')
    setConfirmPass('')
    setShowPass(false)
    setSending(false)
    setCodeSent(false)
    setSentTo('')
    setError('')
    setSuccess(false)
    onClose()
  }

  const handleSubmitReset = async (e) => {
    e.preventDefault()
    setError('')
    if (newPass !== confirmPass) {
      setError(lang === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
      return
    }
    if (newPass.length < 4) {
      setError(lang === 'fr' ? 'Le mot de passe doit contenir au moins 4 caractères' : 'Password must be at least 4 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, newPassword: newPass }),
      })
      if (res.status === 401) {
        setError(lang === 'fr' ? 'Code invalide ou expiré' : 'Invalid or expired code')
        return
      }
      if (!res.ok) {
        setError(lang === 'fr' ? 'Erreur' : 'Error')
        return
      }
      setSuccess(true)
      setTimeout(handleClose, 2000)
    } catch {
      setError(lang === 'fr' ? 'Erreur de connexion' : 'Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-6 w-6" />
              </span>
            </div>
            <h3 className="mt-4 text-center font-display text-lg font-bold text-navy">
              {t('admin.forgotTitle')}
            </h3>

            {success ? (
              <p className="mt-4 rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-600">
                {t('admin.resetSuccess')}
              </p>
            ) : sending ? (
              <>
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-mint/50 p-3 text-sm font-medium text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {lang === 'fr' ? 'Envoi du code par email...' : 'Sending code by email...'}
                </div>
                <p className="mt-3 text-center text-xs text-navy/50">
                  {lang === 'fr' ? 'Vérifiez votre email' : 'Check your email'}{' '}
                  <strong className="text-navy/70">{sentTo || (lang === 'fr' ? 'votre boîte mail' : 'your inbox')}</strong>
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-center text-sm text-navy/60">{t('admin.forgotCodeHint')}</p>
                {codeSent && (
                  <p className="mt-3 text-center text-xs text-green-600">
                    {lang === 'fr' ? `✓ Code envoyé par email` : '✓ Code sent by email'}{' '}
                    {sentTo && <strong className="font-semibold">({sentTo})</strong>}
                  </p>
                )}
                <form onSubmit={handleSubmitReset} className="mt-5 space-y-3">
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError('') }}
                    placeholder="• • • • • •"
                    className="field w-full text-center text-lg font-bold tracking-[0.5em]"
                  />
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPass}
                      onChange={(e) => { setNewPass(e.target.value); setError('') }}
                      placeholder={t('admin.newPassword')}
                      className="field w-full pr-11"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmPass}
                      onChange={(e) => { setConfirmPass(e.target.value); setError('') }}
                      placeholder={t('admin.confirmPassword')}
                      className="field w-full pr-11"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {error && (
                    <p className="rounded-xl bg-red-50 p-2.5 text-center text-sm font-medium text-red-600">{error}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 rounded-xl border border-navy/10 px-4 py-2.5 text-sm font-semibold text-navy/60 transition-colors hover:bg-navy/5"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {t('admin.cancel')}
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {loading ? t('admin.loading') : t('admin.resetPassword')}
                    </motion.button>
                  </div>
                </form>
                <button
                  type="button"
                  onClick={requestCode}
                  disabled={sending}
                  className="mt-4 mx-auto flex items-center gap-1.5 text-xs text-primary/70 transition-colors hover:text-primary hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  {lang === 'fr' ? 'Renvoyer le code' : 'Resend code'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}