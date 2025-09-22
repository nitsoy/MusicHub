import express from "express";
import cors from "cors";
import * as Auth from "./handlers/auth.handlers";
import * as Playlists from "./handlers/playlists.handlers";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/docs", (_req, res) => {
  res.json({
    name: "MusicHub Mock",
    endpoints: {
      "POST /auth/register": { body: "{name,email,password}" },
      "POST /auth/login": { body: "{email,password}" },
      "GET /playlists": "auth",
      "POST /playlists": "auth",
      "GET /playlists/:id": "auth",
      "PUT /playlists/:id": "auth",
      "DELETE /playlists/:id": "auth",
      "POST /playlists/:id/tracks": "auth",
      "DELETE /playlists/:id/tracks/:trackId": "auth",
    },
    demo: { email: "demo@musichub.com", password: "password123" },
  });
});

app.post("/auth/register", Auth.register);
app.post("/auth/login", Auth.login);

app.get("/playlists", Playlists.listMine);
app.post("/playlists", Playlists.create);
app.get("/playlists/:id", Playlists.getById);
app.put("/playlists/:id", Playlists.update);
app.delete("/playlists/:id", Playlists.remove);
app.post("/playlists/:id/tracks", Playlists.addTrack);
app.delete("/playlists/:id/tracks/:trackId", Playlists.deleteTrack);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Mock backend on http://localhost:${PORT}`));
