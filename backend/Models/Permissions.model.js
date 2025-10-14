import  mongoose  from "mongoose";

const PermissionSchema = new mongoose.Schema({
    Name :{type:String,required :true,unique:true},
    desc :{type:String,}
})

export default mongoose.model ("Permission",PermissionSchema)