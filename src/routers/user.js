const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


// Goal: Have signup return auth token
// 1. Generate a token for the saved user
// 2. Send back both the token and the user
// 3. Create a new user from postmnan and confirm the token is there

//USERS
//POST - CREATE
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err)
    }       
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((err) => {
    //     res.status(400).send(err)
    // })
})

//POST - LOGIN
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send( { user, token})
    } catch (error) {
        res.status(400).send()
    }
})

// POST - LOGOUT
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


//POST - LOGOUT ALL
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// GET - PROFILE PAGE
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     console.log(_id)
//     try {
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

//PATCH - UPDATE USERS
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update data'})
    }
    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        res.send(user)
    } catch (error) {
        res.send(400).send(error)
    }
})

//DELETE - DELETE USER
router.delete('/users/me', auth,  async (req, res) => {
    try {
        await req.user.remove()
        return res.send(`Deleted user ${req.user.name}`)
    } catch (error) {
        return res.status(500).send(error)
    }
})

module.exports = router