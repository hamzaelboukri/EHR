import mongoose from "mongoose";


const RoleSchema = new mongoose.Schema({
Name : {type : String, require :true},
Permissions : {type: mongoose.Schema.Types.ObjectId, ref:"Permissions"}



}) ;

export default mongoose.model("Role",RoleSchema)


