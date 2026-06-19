const app = require('../beckend/src/app');
const connectDB = require('../beckend/src/db/db');

connectDB();

app.listen(3000, ()=>{
    console.log('server is running on port 3000');
})