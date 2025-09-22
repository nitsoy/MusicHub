// src/modules/playlists/actions/queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/api/musicApi'

export type Track = {
  id: string
  title: string
  artist: string
  duration?: number
  coverUrl?: string
}
export type Playlist = {
  id: string
  ownerId: string
  name: string
  description?: string
  coverUrl?: string
  isPublic: boolean
  tracks: Track[]
}

export const keys = {
  all: ['playlists'] as const,
  detail: (id: string) => ['playlists', id] as const,
}

export function usePlaylists() {
  return useQuery({
    queryKey: keys.all,
    queryFn: async (): Promise<Playlist[]> => (await http.get('/playlists')).data,
  })
}

export function useCreatePlaylist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: { name: string; description?: string }) =>
      (await http.post('/playlists', dto)).data as Playlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function useDeletePlaylist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => http.delete(`/playlists/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  })
}

export function usePlaylist(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: async (): Promise<Playlist> => (await http.get(`/playlists/${id}`)).data,
    enabled: !!id,
  })
}

// Añadir canción
export function useAddTrack(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: { title: string; artist: string; duration?: number }) =>
      (await http.post(`/playlists/${id}/tracks`, dto)).data as Track,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(id) }),
  })
}

// Eliminar canción
export function useRemoveTrack(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (trackId: string) => http.delete(`/playlists/${id}/tracks/${trackId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.detail(id) }),
  })
}

export function useUpdatePlaylist(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: { name?: string; description?: string; isPublic?: boolean }) =>
      (await http.put(`/playlists/${id}`, dto)).data as Playlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.detail(id) })
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}
