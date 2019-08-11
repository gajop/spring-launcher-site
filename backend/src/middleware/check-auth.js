const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    const decodedToken = jwt.verify(token, JWT_SECRET)
    req.userData = { github_nick: decodedToken.github_nick }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Auth failed' })
  }
}
