const express = require('express')
const app = express()
const cors = require('cors')
const bp = require("body-parser")
app.use(bp.json())
app.use(cors())
app.use(bp.urlencoded({
	extended: true
}));
const port = process.env.PORT || 3001

app.post('/login', (req, res) => {
	console.log(req.body)
	res.json({ message: `Pinger is set for ${req.body.username} at ${new Date().toString()}` })
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})