const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({

    username: {
        type: String, 
        required: false
    }

});
 const User = mongoose.model('User', UserSchema);
 module.exports = User;