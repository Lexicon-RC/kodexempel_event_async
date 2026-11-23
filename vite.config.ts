// Gör att /api/saknas svarar 404 och /api/fel svarar 500, så att vi kan visa riktiga serverfel.
// (Vites egen server svarar annars 200 med startsidan på adresser som inte finns.)
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "demo-serverfel",
      configureServer(server) {
        server.middlewares.use("/api/saknas", (_req, res) => {
          res.statusCode = 404;
          res.end("Finns inte");
        });
        server.middlewares.use("/api/fel", (_req, res) => {
          res.statusCode = 500;
          res.end("Serverfel");
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use("/api/saknas", (_req, res) => {
          res.statusCode = 404;
          res.end("Finns inte");
        });
        server.middlewares.use("/api/fel", (_req, res) => {
          res.statusCode = 500;
          res.end("Serverfel");
        });
      },
    },
  ],
});
