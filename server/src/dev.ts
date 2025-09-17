import dotenv from "dotenv";
dotenv.config();

import app from "./app";
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
