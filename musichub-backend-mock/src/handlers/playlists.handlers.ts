import { Request, Response } from "express";
import playlists from "../data/playlists.json";
import { verifyToken } from "../utils/jwt.utils";

type Track = {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  coverUrl?: string;
};
type Playlist = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  coverUrl?: string;
  isPublic: boolean;
  tracks: Track[];
};

function requireAuth(req: Request, res: Response) {
  const payload = verifyToken(req.headers.authorization);
  if (!payload) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  return payload;
}

export const listMine = (req: Request, res: Response) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const mine = (playlists as Playlist[]).filter(
    (p) => p.ownerId === payload.sub
  );
  res.json(mine);
};

export const getById = (req: Request, res: Response) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const item = (playlists as Playlist[]).find(
    (p) => p.id === req.params.id && p.ownerId === payload.sub
  );
  if (!item) return res.status(404).json({ message: "No encontrada" });
  res.json(item);
};

export const create = (req: Request, res: Response) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ message: "Título requerido" });
  const p: Playlist = {
    id: "p" + Date.now(),
    ownerId: payload.sub,
    name,
    description,
    isPublic: false,
    coverUrl: "",
    tracks: [],
  };
  (playlists as Playlist[]).push(p);
  res.status(201).json(p);
};

export const update = (req: Request, res: Response) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const idx = (playlists as Playlist[]).findIndex(
    (p) => p.id === req.params.id && p.ownerId === payload.sub
  );
  if (idx === -1) return res.status(404).json({ message: "No encontrada" });
  (playlists as Playlist[])[idx] = {
    ...(playlists as Playlist[])[idx],
    ...(req.body || {}),
  };
  res.json((playlists as Playlist[])[idx]);
};

export const remove = (req: Request, res: Response) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const idx = (playlists as Playlist[]).findIndex(
    (p) => p.id === req.params.id && p.ownerId === payload.sub
  );
  if (idx === -1) return res.status(404).json({ message: "No encontrada" });
  (playlists as Playlist[]).splice(idx, 1);
  res.status(204).send();
};

export const addTrack = (req: Request, res: Response) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const p = (playlists as Playlist[]).find(
    (p) => p.id === req.params.id && p.ownerId === payload.sub
  );
  if (!p) return res.status(404).json({ message: "No encontrada" });
  const { title, artist, duration } = req.body || {};
  if (!title || !artist)
    return res.status(400).json({ message: "Título y artista requeridos" });
  const t: Track = { id: "t" + Date.now(), title, artist, duration };
  p.tracks.push(t);
  res.status(201).json(t);
};

export const deleteTrack = (req: Request, res: Response) => {
  const payload = requireAuth(req, res);
  if (!payload) return;
  const p = (playlists as Playlist[]).find(
    (p) => p.id === req.params.id && p.ownerId === payload.sub
  );
  if (!p) return res.status(404).json({ message: "No encontrada" });
  p.tracks = p.tracks.filter((t) => t.id !== req.params.trackId);
  res.status(204).send();
};
