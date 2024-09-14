const mongoose = require('mongoose');


const ExerciseSchema = new mongoose.Schema(
    [{

        userId: {
            type: String
        },
        description: {
            type: String
        },
        duration: {
            type: Number
        },
        date: {
            type: String,
            default: new Date()
        }


    }]
);
const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;