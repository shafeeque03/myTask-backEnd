import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    permission:{
        type: Array,
        required: true
    }
})

export default mongoose.model('Role', roleSchema)