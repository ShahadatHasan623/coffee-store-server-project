const express =require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app =express()
const port =process.env.PORT || 3000;


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.off1efx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = "mongodb+srv://shahadat:1502268753@cluster0.off1efx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCoffees =client.db("coffeesDB").collection("coffees")
    const userCollection =client.db("coffeesBD").collection("users")
    
    app.post('/coffees',async(req,res)=>{
      const newCoffee =req.body;
      const result =await userCoffees.insertOne(newCoffee);
      res.send(result)
    })

    app.delete('/coffees/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id: new ObjectId(id)};
      const result =await userCoffees.deleteOne(query)
      res.send(result)
    })

    app.get('/coffees',async(req,res)=>{
      const result=await userCoffees.find().toArray()
      res.send(result)
    })
    app.get('/coffees/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result =await userCoffees.findOne(query)
      res.send(result)
    })

    // update section 
    app.put('/coffees/:id',async(req,res)=>{
      const id =req.params.id;
      const filter ={_id: new ObjectId(id)};
      const updateCoffee =req.body;
      const options = { upsert: true }; 
      const updateDoc={
        $set:updateCoffee
      };
      const result =await userCoffees.updateOne(filter,updateDoc,options)
      res.send(result)
    })

    // user Db 
    app.get('/users',async(req,res)=>{
      const result =await userCollection.find().toArray()
      res.send(result)
    })

    // delete user 
    app.delete('/users/:id',async(req,res)=>{
      const id =req.params.id;
      const query ={_id: new ObjectId(id)};
      const result=await userCollection.deleteOne(query);
      res.send(result)
    })

    // update one by data base 
    app.patch('/users',async(req,res)=>{
      const {email,lastSignInTime}=req.body;
      const filter ={email:email};
      const updateDoc ={
        $set:{
          lastSignInTime:lastSignInTime
        }
      };
      const result = await userCollection.updateOne(filter,updateDoc)
      res.send(result)
    })
    
    app.post('/users',async(req,res)=>{
      const user =req.body
      const result=await userCollection.insertOne(user)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("coffee store server is hotter")
})
app.listen(port,()=>{
    console.log(`server is running at:${port}`)
})
