//TypeScript Express
import express from 'express'
import CoordRoutes from './routes/CoordRoutes'
//-----------------------
const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
});

//Routes
app.use('/pontos', CoordRoutes)

app.listen(3000)