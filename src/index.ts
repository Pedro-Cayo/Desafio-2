//TypeScript Express
import { Request, Response } from 'express';
type ExpressType = (req: Request, res: Response) => void
//-----------------------
const express = require('express')
const app = express()
const port = 3000

const routes: ExpressType =(req, res) => {
  res.send("Hello World!")
}

app.get('/', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})