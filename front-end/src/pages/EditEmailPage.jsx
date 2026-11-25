import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, PageHeader } from '../components'
import { changeEmail } from '../services/profileService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function EditEmailPage() {
  const navigate = useNavigate()

  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function findErrors() {
    const found = {}
    const newValue = newEmail.trim()
    const confirmValue = confirmEmail.trim()

    if (!newValue) {
      found.newEmail = 'Enter your new email.'
    } else if (!EMAIL_PATTERN.test(newValue)) {
      found.newEmail = 'Enter a valid email address.'
    }

    if (!confirmValue) {
      found.confirmEmail = 'Confirm your new email.'
    } else if (confirmValue.toLowerCase() !== newValue.toLowerCase()) {
      found.confirmEmail = "Emails don't match."
    }

    return found
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const found = findErrors()
    setErrors(found)
    setServerError('')
    if (Object.keys(found).length > 0) return

    setIsSubmitting(true)
    try {
      await changeEmail({ newEmail: newEmail.trim(), confirmEmail: confirmEmail.trim() })
      navigate('/profile')
    } catch (error) {
      setServerError(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pb-8">
      <PageHeader title="Edit email" backTo="/profile" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-4">
        <p className="text-sm text-stone-600">Enter and confirm your new email.</p>

        <Input
          label="New email"
          type="email"
          autoComplete="email"
          value={newEmail}
          onChange={(event) => setNewEmail(event.target.value)}
          error={errors.newEmail}
        />

        <Input
          label="Confirm email"
          type="email"
          autoComplete="email"
          value={confirmEmail}
          onChange={(event) => setConfirmEmail(event.target.value)}
          error={errors.confirmEmail}
        />

        {serverError && (
          <p role="alert" className="text-sm text-red-600">{serverError}</p>
        )}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Update email'}
        </Button>
      </form>
    </div>
  )
}