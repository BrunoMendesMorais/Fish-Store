import express from "express"
import router from "./routes/router"
import cookieparse from 'cookie-parser';
import { inicializarBanco } from "./database/mysql"

import 'dotenv/config'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieparse());
app.use("/api", router)


async function startServer() {
    await inicializarBanco();

    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

startServer();