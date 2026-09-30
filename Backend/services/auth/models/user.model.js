import {Schema,model} from 'mongoose'

//design of how the user model should look like
const userSchema = new Schema({
    firebaseUid: {
        type: String,
        unique:true
    },
    name: String,
    email: String,
    avatar:String
}, {
    timestamps:true
})

//we have created the model of the userSchema
const User = model("User", userSchema)

export default User;