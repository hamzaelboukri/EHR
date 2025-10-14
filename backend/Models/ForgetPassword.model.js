import mongoose from "mongoose";
import { Types } from "../Config/db";


const ForgetPasswordShema= new mongoose.Schema ({
    token :{type :String },
    dateexparation :{type :Date}
    
})

export default mongoose.model('ForgetPassword',ForgetPasswordShema)