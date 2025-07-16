"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

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
      const formData = new FormData()
      formData.append("name", nome)
      formData.append("description", descricao)
      formData.append("slug", nome.toLowerCase().replace(/ /g, "-"))
      if (imagem) {
        formData.append("image", imagem)
      }
      const res = await fetch("http://localhost:8001/api/categories", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json()
        setErro(data.error || "Erro ao cadastrar categoria")
        setLoading(false)
        return
      }
      setSucesso("Categoria cadastrada com sucesso!")
      setTimeout(() => router.push("/"), 1500)
    } catch (err) {
      setErro("Erro de conexão com o servidor")
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
          <Label htmlFor="imagem">Imagem</Label>
          <Input id="imagem" type="file" accept="image/*" onChange={handleImagemChange} required />
          {preview && <img src={preview} alt="Prévia" className="mt-2 w-32 h-32 object-cover rounded-lg border border-pink-200 mx-auto" />}
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