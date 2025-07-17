"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/lib/config"
import { Upload, X } from "lucide-react"

export default function CadastroCategoriaPage() {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [imagem, setImagem] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const router = useRouter()

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImagem(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro("")
    setSucesso("")
    try {
      let imageUrl = ""
      
      // Upload da imagem se houver
      if (imagem) {
        const imageFormData = new FormData()
        imageFormData.append("image", imagem)
        
        const uploadRes = await fetch(API_ENDPOINTS.UPLOAD, {
          method: "POST",
          body: imageFormData,
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.imageUrl
        } else {
          const errorData = await uploadRes.json()
          throw new Error(`Erro ao fazer upload da imagem: ${errorData.error || uploadRes.statusText}`)
        }
      }

      // Criar categoria
      const categoryData = {
        name: nome,
        description: descricao,
        slug: nome.toLowerCase().replace(/ /g, "-"),
        imageUrl: imageUrl || null,
      }

      const res = await fetch(API_ENDPOINTS.CATEGORIES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setErro(data.error || "Erro ao cadastrar categoria")
        setLoading(false)
        return
      }
      setSucesso("Categoria cadastrada com sucesso!")
      setTimeout(() => router.push("/"), 1500)
    } catch (err: any) {
      setErro(err.message || "Erro de conexão com o servidor")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-pink-100">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-4">Cadastrar Categoria</h2>
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Vestidos" />
        </div>
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Input id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} required placeholder="Descrição da categoria" />
        </div>
        <div>
          <Label htmlFor="imagem">Imagem da Categoria</Label>
          {preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img 
                  src={preview} 
                  alt="Prévia" 
                  className="mt-2 w-48 h-48 object-cover rounded-lg border border-pink-200" 
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagem(null)
                    setPreview("")
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors"
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('border-pink-500', 'bg-pink-50')
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('border-pink-500', 'bg-pink-50')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('border-pink-500', 'bg-pink-50')
                const files = Array.from(e.dataTransfer.files)
                if (files[0]) {
                  const event = { target: { files: [files[0]] } } as any
                  handleImagemChange(event)
                }
              }}
            >
              <Upload className="h-8 w-8 text-pink-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Arraste uma imagem aqui ou clique para selecionar</p>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="imagem"
                />
                <Button type="button" variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50 pointer-events-none">
                  Selecionar Imagem
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
              </p>
            </div>
          )}
        </div>
        {erro && <div className="text-red-500 text-center font-semibold">{erro}</div>}
        {sucesso && <div className="text-green-600 text-center font-semibold">{sucesso}</div>}
        <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg py-3" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </div>
  )
} 