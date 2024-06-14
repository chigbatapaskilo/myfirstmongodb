const express=require(`express`);

const dotenv=require(`dotenv`)



const PORT=process.env.PORT;

const app=express();
const mongoose=require("mongoose")

app.use(express.json());
//connect to db 
mongoose.connect(process.env.db).then(()=>{
    console.log(`connection to database is established `)
}).catch((err)=>{
    console.log(`Unable to connect to the db because ${err}`)
})

const date=new Date
// console.log(date.getFullYear())
//create a schema
const userModel=new mongoose.Schema({
name:{type:String,required:[true,"Kindly provide your name"]},
email:{type:String,unique:true,required:[true,"kindly provide your email"],toUpperCase:true},
stack:{type:String},
dateOfBirth:{type:Number,required:true},
sex:{type:String,required:true, enum:["male","female"]},
age:{type:Number}



},{timestamps:true})

const mymodel=mongoose.model("SECONDMONGODB",userModel)
app.get("/",(req,res)=>{

    res.status(200).json(`welcome to mongodb`)

});
//create first user

app.post("/createuser",async(req,res)=>{
    try {
        let{name,email ,stack,sex,dateOfBirth,}=req.body
        let mail=email.toLowerCase();
        let fullName=name.split(" ");
        console.log(fullName);
        let removedSpace = fullName.filter((space) => space !== "")
        console.log(removedSpace)
      let firstLetter=removedSpace[0].slice(0,1).toUpperCase()
      let remaining=removedSpace[0].slice(1).toLowerCase()
      let totalName=firstLetter+remaining

    //   let lastName=removedSpace[removedSpace.length-1]
    //   console.log(lastName)
      let firstLetter2=removedSpace[1].slice(0,1).toUpperCase()
      let remaining2=removedSpace[1].slice(1).toLowerCase()
      let total2=firstLetter2+remaining2
      let gender=sex.toLowerCase();


        const data={name:totalName+" "+total2,email:mail,stack,sex:gender,dateOfBirth,age:date.getFullYear()-dateOfBirth}
       const createUser=await mymodel.create(data)
        res.status(201).json({
            "message":`new user created`,
            createUser

        })
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//get all

app.get("/getallstudents",async(req,res)=>{
try {
    const allStudents=await mymodel.find()
    
    res.status(200).json({Message:`kindly find below ${allStudents.length} students`,allStudents})


} catch (error) {
    res.status(400).json(error.message)
}

})

// get one by id


app.get("/getone/:id",async(req,res)=>{
    
try {
    let id=req.params.id

    let foundUser=await mymodel.findById(id)

if(!foundUser){
  
    res.status(404).json({message:`student with ${id} not found`})
}else{
    
res.status(200).json({info:`kindly find below the requested user`,foundUser})
}

} catch (error) {
  res.status(500).json(error.message)  
}

})
//  get one by other details
// app.get("/getones/:email",async(req,res)=>{

//     try {
//         let email=req.params.email
//     console.log(email)
//     let foundUser=await mymodel.findOne({email})
    
//     res.status(200).json({info:`kindly find below the requested user`,foundUser})
//     } catch (error) {
//       res.status(500).json(error.message)  
//     }
    
//     })

//     update

//      app.put("/updateuser/:id",async(req,res)=>{

//         try {
// let id=req.params.id
// console.log(req.body)
//           let update=  await mymodel.findByIdAndUpdate(id,req.body,{new:true})

//             res.status(200).json({message:`user succesfully updated`,update
//           //  :await mymodel.findById(id)
//         })
            
//         } catch (error) {
//             res.status(500).json(error.message)
//         }
//     })

    // app.delete("/deleteuser/:id",async(req,res)=>{
    //     try{
    //      let id =req.params.id
    //    let userDeleted=await mymodel.findByIdAndDelete(id,req.body);
    //    //console.log(deleteUser)
    //     res.status(200).json({message:`user with id: ${id} has been successfully deleted` ,userDeleted});
    //     }catch(error){

    //         res.status(500).json(error.message)
    //     }
    // })


app.listen(PORT,()=>{
    console.log(`my app is listening to port: ${PORT}`)
});