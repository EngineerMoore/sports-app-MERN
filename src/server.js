const express = require('express');
/* mongoose is ODM for MongoDB */
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(cors())
app.use(express.json())


try {
  // connects to the external db
  mongoose.connect(process.env.MONGO_DB_CONNECTION)
  console.log('MongoDB connected')
} catch(error) {
  console.log(error);
}

app.use("/files", express.static(path.resolve(__dirname, "..", "files")))
app.use(routes);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})