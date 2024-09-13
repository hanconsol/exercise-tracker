const mongoose = require('mongoose');


const ExerciseSchema = new mongoose.Schema(
    [{

        
          description: {
                type: String
            },
            duration: {
                type: Number
            },
            date: {
                type: String,
                default: Date.toDateString
            }
        

}]
);
const Exercise = mongoose.model('Exercise', ExerciseSchema);


const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    log: [ExerciseSchema]
});

const User = mongoose.model('User', UserSchema);



module.exports = User;
