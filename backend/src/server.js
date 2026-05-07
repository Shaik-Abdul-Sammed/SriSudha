import dotenv from 'dotenv'
import { createApp } from './app.js'

dotenv.config()

const app = createApp()
const PORT = Number(process.env.PORT || 4000)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${PORT}`)
})
