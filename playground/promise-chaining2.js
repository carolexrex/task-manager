require('../src/db/mongoose');

const Task = require('../src/models/task')

/*Task.findByIdAndDelete('5fae73bd0528944bd421633d').then((deletedDocument) => {
    if(deletedDocument) {
        console.log(`Deleted document: ${deletedDocument}`)
        return Task.countDocuments({completed: false})
    }
    else {
        console.log('No document was found to delete')
        return Task.countDocuments({completed:false})
    }
}).then((noOfTasks) => {
    console.log(`Incompleted tasks:  ${noOfTasks}`)
}).catch((err) => {
    console.log(`LES ERRORS! ${err}`)
})*/


const deleteTaskAndCount = async (id) => {
    const deletedDocument = await Task.findByIdAndDelete(id)
    if(!deletedDocument) {
        throw new Error('Could not find document')
    }
    const count = Task.countDocuments({completed: false})
    return count
}


deleteTaskAndCount('5fac216bd371842098e57134').then((count) => {
    console.log(`Deleted 1 document. Number of incomplete tasks: ${count}`)
}).catch((err) => {
    console.log(err.message)
})