const express =  require('express')
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()


// middleware

app.use(cors())
app.use(express.json())






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ngsjczb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();


    const craftCollection = client.db('craftDB').collection('craftInfo')
 

    app.get('/category', async (req, res) => {
      const catagoryCollection = client.db('categoryDB').collection('categoryInfo')
 
      const cursor = catagoryCollection.find();
      const result = await cursor.toArray();
    
      res.send(result);
  });

app.get('/catagory_items/:catagory_name', async(req, res)=>{
  const cataName = req.params.catagory_name
const query = { catagory: cataName}
const result = await craftCollection.find(query).toArray()
res.send(result)
})

    app.delete('/delete/:id',async (req, res)=>{

      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/update/:id',async(req, res)=>{

const id = req.params.id;
console.log(id);
console.log(req.body)
const craftsData = req.body
const filter = {_id : new ObjectId(id)}
const option = {upsert: true }
const updatedCraftsdata = {


  $set:{

    items_name: craftsData.items_name,
    photo : craftsData.photo,
    stock_status: craftsData.stock_status,
    prosessing_time :craftsData. prosessing_time,
      customization :craftsData.customization,
       rating: craftsData.rating,
        description :craftsData.description,
         catagory :craftsData.catagory,
         price :craftsData.price

  }
}

const result = await craftCollection.updateOne(filter, updatedCraftsdata, option)
res.send(result)


    })

    app.get('/details/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id :new ObjectId(id)}
      const result = await craftCollection.findOne(query);
      res.send(result)
    
    })

    app.get('/craft/:email', async(req, res)=>{
      const email = req.params.email
      const query = {email : email}
      const result = await craftCollection.find(query).toArray();
      res.send(result)
    
    })
  
    app.get('/craft', async(req, res)=>{
      const cursor = craftCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/add_craft', async(req, res)=>{
const craftData = req.body
      console.log(req.body);
      const result = await craftCollection.insertOne(craftData);
      res.send(result)

    })



// 662bb61da5554b943c4045f3
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{

    res.send("A-10 server site ready to work")
})


app.listen(port,()=>{
    console.log(`This port is ${port}`);
})