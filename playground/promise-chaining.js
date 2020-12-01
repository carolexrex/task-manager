require('../src/db/mongoose')

const User = require('../src/models/user')

//5fae6bd0e0c3b21ffcecb990

/*User.findByIdAndUpdate('5fad63ce570dab46a4d33522', { age: 1}).then((user) => {
    console.log(user)
    return User.countDocuments({age: 1})
}).then((noOfUsers) => {
    console.log(noOfUsers)
}).catch((err) => {
    console.log(err)
})*/

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const noOfDocuments =  await User.countDocuments({age})

    return noOfDocuments
}

updateAgeAndCount('5fad63ce570dab46a4d33522', 21).then((count) => {
    console.log(count)
}).catch((err) => {
    console.log(err)
})

