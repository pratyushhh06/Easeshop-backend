const express = require('express');
const dotnev = require('dotenv').config();
const dbConnect = require('./Database/dbConnect');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const categoryRoutes = require('./routes/categoryRoute');
const productRoutes = require('./routes/productRoute')

const app = express();

dbConnect();

//important middlewares
app.use(express.json());



app.use(cors({
    origin: 'http://localhost:3000', // React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials (cookies, auth headers, etc.)
}));


app.use('/api/v1/auth' ,authRoutes);
app.use('/api/v1/category' , categoryRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/payment', productRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`The server has been started at Port ${PORT}`);
})