import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import dalleRoutes from "./routes/dalle.routes.js";

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json({ limit: '50mb' }));

app.get("/", (req, res) => {    

    res.status(200).json({
        message: "Hello from server"
    })
})
app.use("/api/v1/dalle", dalleRoutes)

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))