import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp.toString()
}

// Din kod här. Skriv dina arrayer
const users = []
const accounts = []
const sessions = []

// Din kod här. Skriv dina routes:
app.post('/users', (req, res) => {
  const { username, password } = req.body
  const id = users.length + 101

  const user = {
    id,
    username,
    password,
  }
  users.push(user)

  const account = {
    id: accounts.length + 1,
    userId: user.id,
    amount: 0,
  }
  accounts.push(account)

  res.json(user)
})

app.post('/sessions', (req, res) => {
  const { username, password } = req.body
  const user = users.find(
    (u) => u.username === username && u.password === password,
  )
  if (!user)
    return res.status(401).json({ error: 'Fel användarnamn eller lösenord' })

  const otp = generateOTP()
  sessions.push({ userId: user.id, token: otp })
  res.json({ token: otp })
})

app.post('/me/accounts', (req, res) => {
  const { token } = req.body
  const session = sessions.find((s) => s.token === token)
  if (!session) return res.status(401).json({ error: 'Ogiltig session token' })

  const account = accounts.find((a) => a.userId === session.userId)
  res.json({ amount: account.amount })
})

app.post('/me/accounts/transactions', (req, res) => {
  const { token, amount } = req.body
  const session = sessions.find((s) => s.token === token)
  if (!session) return res.status(401).json({ error: 'Ogiltig token' })

  const account = accounts.find((a) => a.userId === session.userId)
  account.amount += Number(amount)
  res.json({ amount: account.amount })
})

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://127.0.0.1:${port}`)
})
