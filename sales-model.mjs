import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handle connection events
db.on('error', (error) => {
    console.error('Error: Unable to connect to the database.', error);
});

db.once('open', () => {
    console.log('Connected to the Sales Tracker database.');
});

// SCHEMA: Define the collection's schema
const salesSchema = mongoose.Schema({
    product_name: { type: String, required: true },
    date_bought: { 
        type: Date, 
        required: true, 
        validate: {
            validator: function (value) {
                return value < this.date_sold;
            },
            message: 'date_bought must be before date_sold',
        },
    },
    date_sold: { type: Date, required: true },
    price_bought_for: { 
        type: Number, 
        required: true, 
        min: [0, 'price_bought_for must be positive'],
    },
    price_sold_for: { 
        type: Number, 
        required: true, 
        min: [0, 'price_sold_for must be positive'],
    },
});

// Compile the model from the schema
const sales = mongoose.model('Sales', salesSchema);

// CREATE model
const createSale = async (saleData) => {
    const sale = new sales(saleData);
    return sale.save();
};

// RETRIEVE all sales
const retrieveSales = async () => {
    return sales.find().exec();
};

// RETRIEVE by ID
const retrieveSaleByID = async (_id) => {
    return sales.findById(_id).exec();
};

// UPDATE model
const updateSale = async (_id, saleData) => {
    return sales.findByIdAndUpdate(_id, saleData, { new: true });
};

// DELETE model
const deleteSaleById = async (_id) => {
    const result = await sales.deleteOne({ _id });
    return result.deletedCount;
};

export { createSale, retrieveSales, retrieveSaleByID, updateSale, deleteSaleById };