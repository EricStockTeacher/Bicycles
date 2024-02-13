import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bicycleData =  { name: "Red Bike", color: "Red", "image": "RedBike.png" };

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.PORT || 8080;

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.get('/api/bicycle', (req, res) => {
        return res.json(bicycleData);
})

app.post('/api/updateBicycle', async (req, res) => {
    const name = req.body.name;
    const color = req.body.color;
    const image = req.body.image;

    if( !name || !color || !image ) {
        return res.status(400);
    }
    else {
        bicycleData.name = name;
        bicycleData.color = color;
        bicycleData.image = image;
        return res.json(bicycleData);
        
        //return res.redirect("/");
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})