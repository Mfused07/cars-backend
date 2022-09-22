const express = require('express');
const indexRouter = require('./routes/index');
const cors = require('cors');
const app = express();

app.use(cors())
app.use(express.json());
app.use('/', indexRouter);

app.listen(5555, () => {
    console.log('listening on port 5555');
})