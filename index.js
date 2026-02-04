const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT;
const AUTH_HEADERS = {
    Authorization: "Token 9b7661d9292aab2c339b95bf251063791c2a62ff",
    "Content-Type": "application/json",
};

app.use(cors());

app.get("/api/BDF/pdv", async (req, res) => {
    try {
        const response = await fetch(
            "https://botai.smartdataautomation.com/api_backend_ai/dinamic-db/report/119/PDV_BDF",
            { headers: AUTH_HEADERS }
        );
        
        // Debug: Log status y headers
        console.log("Status:", response.status);
        console.log("Content-Type:", response.headers.get("content-type"));
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const textResponse = await response.text();
            console.error("Error response body:", textResponse.substring(0, 500));
            return res.status(response.status).json({ 
                error: `Error del servidor remoto: ${response.status}`,
                details: textResponse.substring(0, 200)
            });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Error en el proxy BDF PDV:", err);
        res.status(500).json({ error: "Error al obtener datos de BDF PDV", details: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
