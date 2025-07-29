//TypeScript Express
import express, { Request, Response, NextFunction } from 'express'
import CoordRoutes from './routes/CoordRoutes'
//-----------------------
const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'Erro de sintaxe no JSON.' })
  }
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
});

//Routes
app.use('/pontos', CoordRoutes)

app.listen(3000)