"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCategoria, updateCategoria } from "@/lib/categoriaService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function EditarCategoriaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [categoria, setCategoria] = useState<any>(null)
  const [newImage, setNewImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const categoryId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  })

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const data = await getCategoria(categoryId)
        const categoriaData = data.category || data
        setCategoria(categoriaData)
        setFormData({
          name: categoriaData.name || "",
          description: categoriaData.description || "",
          slug: categoriaData.slug || "",
        })
        if (categoriaData.imageUrl) {
          setImagePreview(categoriaData.imageUrl)
        }
      } catch (err) {
        setError("Erro ao carregar categoria")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategoria()
    }
  }, [categoryId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Arquivo deve ser uma imagem válida",
          variant: "destructive",
        })
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Imagem deve ter no máximo 5MB",
          variant: "destructive",
        })
        return
      }

      setNewImage(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setNewImage(null)
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Token de autenticação não encontrado")
        setSaving(false)
        return
      }

      let imageUrl = categoria?.imageUrl || ""

      // Upload da nova imagem se houver
      if (newImage) {
        const imageFormData = new FormData()
        imageFormData.append("image", newImage)
        
        const uploadRes = await fetch("http://localhost:8001/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      // Atualizar categoria
      const updateData = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        imageUrl: imageUrl,
      }

      await updateCategoria(categoryId, updateData)

      toast({
        title: "Categoria atualizada",
        description: "Categoria foi atualizada com sucesso!",
      })

      setTimeout(() => {
        router.push(`/admin/categorias/${categoryId}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar categoria")
      toast({
        title: "Erro",
        description: err.message || "Erro ao atualizar categoria",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          <span className="ml-2">Carregando categoria...</span>
        </div>
      </div>
    )
  }

  if (error || !categoria) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Categoria não encontrada</h2>
            <p className="text-gray-600 mb-4">{error || "A categoria solicitada não existe."}</p>
            <Link href="/admin/categorias">
              <Button>Voltar às Categorias</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/admin/categorias/${categoryId}`} className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Categoria
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Editar Categoria</h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Informações da Categoria</CardTitle>
            <CardDescription>Atualize os dados da categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Nome da Categoria *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Roupas Femininas"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-semibold text-gray-700">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="Ex: roupas-femininas"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                  <p className="text-xs text-gray-500">
                    URL amigável (opcional)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva a categoria..."
                  rows={4}
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              {/* Upload de imagem */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700">
                  Imagem da Categoria
                </Label>
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview da imagem"
                        className="w-48 h-48 object-cover rounded-lg border border-pink-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
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
                        handleImageChange(event)
                      }
                    }}
                  >
                    <Upload className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Arraste uma imagem aqui ou clique para selecionar</p>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="image-upload"
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

              {/* Mensagens de erro */}
              {error && (
                <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Link href={`/admin/categorias/${categoryId}`}>
                  <Button type="button" variant="outline" className="border-gray-300">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 