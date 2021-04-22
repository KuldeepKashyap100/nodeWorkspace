import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from "jsonwebtoken";
import routes from './src/routes/crmRoutes';

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://root:38AzamslJAZXJ5Tx@cluster0.zgpxi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//jwt setup
app.use((req, res, next) => {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0] === "JWT") {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "RESTFUL_API_S", (err, decodeUser) => {
            if(err) req.user = undefined;
            req.user = decodeUser;
            next();
        });
    }
    else {
        req.user = undefined;
        next();
    }
})

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`your server is running on port ${PORT}`)
);