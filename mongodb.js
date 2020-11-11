// CRUD - Create Read Update Delete

/*const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID*/

//SAMMA RESULTAT SOM OVAN

//Vi får tillbaka mongodb instance från require('mongodb')
//Sedan destructurar vi MongoClient och ObjectID
const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, { useNewUrlParser : true, useUnifiedTopology: true}, (error, client) => {
    if(error) {
        return console.log('Some shit went wrong in los databasos')
    }
    const db = client.db(databaseName)

    // db.collection('users').deleteMany({age: 45}).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // Goal: Use deleteOne to remove a task
    // 1. Remove task by description
    // 2. Test that shit
    db.collection('tasks').deleteOne({description: 'Clean dishes'}).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})