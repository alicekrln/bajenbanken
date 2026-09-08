'use client'

import React, { useEffect, useState } from 'react'

export default function Account() {
  const [value, setValue] = useState('')
  const [amount, setAmount] = useState('0')
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [note, setNote] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('token') || ''
    setToken(t)
    fetch('http://127.0.0.1:3001/me/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: t }),
    })
      .then((res) => res.json())
      .then((data) => setAmount(data.amount))
  }, [])

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    setSuccess(null)

    try {
      const res = await fetch(
        'http://127.0.0.1:3001/me/accounts/transactions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            amount: Number(value),
          }),
        },
      )
      const data = await res.json()
      console.log('Balance:', data.amount)
      setAmount(data.amount)
      setSuccess('Klirr på kontot!')
      setBusy(false)
      setValue('')
      setNote('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Något fick fel, försök igen',
      )
    }
  }
  return (
    <div className='min-h-screen bg-background'>
      <main className='mx-auto w-full max-w-5xl px-5 py-10'>
        <div className='rounded-3xl bg-primary px-8 py-10 text-center shadow-xl'>
          <p className='text-sm font-bold uppercase tracking-widest text-background/80'>
            Hej där, ditt saldo är
          </p>
          <p className='font-black mt-2 text-6xl text-background'>
            {amount} kr
          </p>
        </div>

        <div className='mt-8 grid gap-6 md:grid-cols-2'>
          <form
            onSubmit={handleSubmit}
            className='rounded-3xl border-4 border-primary bg-card p-7 shadow-lg'
          >
            <h1 className='font-black text-2xl text-primary'>Sätt in pengar</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Överför ett belopp direkt till ditt konto.
            </p>
            <label className='mt-5 block'>
              <span className='text-sm font-bold'>Belopp (kr)</span>
              <input
                className='mt-1 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 outline-none focus:border-primary'
                type='text'
                value={value}
                placeholder='100'
                onChange={(e) => setValue(e.target.value)}
                onClick={(e) => setSuccess(null)}
              />
            </label>
            <label className='mt-5 block'>
              <span className='text-sm font-bold'>Vad är det för?</span>
              <input
                className='mt-1 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 outline-none focus:border-primary'
                type='text'
                value={note}
                placeholder='Vann bet'
                onChange={(e) => setNote(e.target.value)}
                maxLength={120}
                onClick={(e) => setSuccess(null)}
              />
            </label>
            {error && (
              <p className='mt-3 rounded-xl bg-error/10 px-4 py-2 text-sm text-error'>
                {error}
              </p>
            )}
            {success && (
              <p className='mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-foreground'>
                {success}
              </p>
            )}
            <button
              type='submit'
              disabled={busy}
              className='mt-5 w-full rounded-full bg-primary px-6 py-3 font-bold text-background disabled:opacity-60'
            >
              {busy ? 'Överför...' : 'Sätt in på kontot'}
            </button>
          </form>

          <div className='rounded-3xl border-2 border-border bg-card p-7'>
            <h1 className='font-black text-2xl text-primary'>
              Tidigare insättningar
            </h1>
            <ul className='mt-4 space-y-3'>
              <li className='flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm'>
                <span className='text-secondary-foreground'>Vann på lotto</span>
                <span className='font-bold text-primary'>+ 9 kr</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
