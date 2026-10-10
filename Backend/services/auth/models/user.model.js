import {Schema,model} from 'mongoose'

//design of how the user model should look like
const userSchema = new Schema({
    firebaseUid: {
        type: String,
        unique:true
    },
    name: String,
    email: String,
    avatar: String,
    plan: {
        type: String,
        default:"free"
    },
    credits: {
        type: Number,
        default:100
    },
    totalCredits: {
        type: Number,
        default:100
    },
    planExpiresAt:Date
}, {
    timestamps:true
})

//we have created the model of the userSchema
export const User = model("User", userSchema)
