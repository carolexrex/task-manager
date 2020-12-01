const express = require('express')
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')

//Routers(Controllers)
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Sidan är nere för underhåll')
// })

// Goal: Setup middleware for maintenance mode

// 1. Register a new middleware function
// 2. Send back a maintenance message with a 503 status code
// 3. Try your requests from the server and confirm status/message shows

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


//
//Without middleware: new request -> run route handler
//
//With middleware: new request -> do something -> run route handler

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const main = async () => {
    // const task = await Task.findById('5fbfedc52c60002e18e206db')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('5fbfdf92a5952f3b88dc30f1')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

//main()

const myFunction = async () => {
    /*const authToken = jwt.sign({ _id: 'abcd123' }, 'thisismytaskapp', { expiresIn: '7 days'})
    console.log(authToken, 'authtoken')

    const data = jwt.verify(authToken, 'thisismytaskapp')
    console.log(data)*/
}

