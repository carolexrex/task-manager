const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()



//GET /tasks?completed=false
//GET /tasks?limit=10&skip=0
//Get /tasks?sortBy=createdAt_desc
router.get('/tasks', auth,  async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.sortBy) {
        const sortArr = req.query.sortBy.split('_')

        sort[sortArr[0]] = sortArr[1] === 'desc' ? -1 : 1

    }
    
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
    
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        //const task = await Task.findById(req.user.id)
        const task = await Task.findOne( { _id, owner: req.user._id})
        
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//POST - CREATE
router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
      ...req.body,
      owner: req.user._id  
    })
    
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


//PATCH - UPDATE TASK
router.patch('/tasks/:id', auth, async (req, res) => {
    
    //updates contains all keys from the request body(eg name, description)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update data for task'})
    }

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        return res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Refactor DELETE /tasks/:id

// 1. Add authentication
// 2. Find the task by _id/owner (findOneAndDelete)
// 3. Test your work

//DELETE - DELETE TASK
router.delete('/tasks/:id', auth,  async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task) {
            return res.status(404).send('Task not found')
        }
        return res.send(`Deleted task ${task.description}`)
    } catch (error) {
        return res.status(500).send(error)
    }
})

module.exports = router