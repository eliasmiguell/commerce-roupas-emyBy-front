"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/config"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductVariant {
  size: string
  color: string
  stock: number
}

export default function NovoProdutoPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.CATEGORIES)
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || data)
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
    }
  }

  const handleFiles = (files: File[]) => {
    // Validar arquivos
    const validFiles = files.filter(file => {
      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert(`Arquivo ${file.name} não é uma imagem válida`)
        return false
      }
      
      // Verificar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`Arquivo ${file.name} é muito grande. Tamanho máximo: 5MB`)
        return false
      }
      
      return true
    })
    
    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles])
      
      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants(prev => [...prev, { size: "", color: "", stock: 0 }])
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Token de autenticação não encontrado")
        setLoading(false)
        return
      }

      // Upload das imagens primeiro
      const imageUrls: string[] = []
      
      for (const image of images) {
        console.log("Fazendo upload da imagem:", image.name)
        const imageFormData = new FormData()
        imageFormData.append("image", image)
        
        const uploadRes = await fetch(API_ENDPOINTS.UPLOAD, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageFormData,
        })

        console.log("Resposta do upload:", uploadRes.status, uploadRes.statusText)
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          console.log("Upload bem-sucedido:", uploadData)
          imageUrls.push(uploadData.imageUrl)
        } else {
          const errorData = await uploadRes.json()
          console.error("Erro no upload:", errorData)
          throw new Error(`Erro ao fazer upload da imagem: ${errorData.error || uploadRes.statusText}`)
        }
      }

      // Criar o produto
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        imageUrl: imageUrls[0] || "", // Primeira imagem como principal
        variants: variants.filter(v => v.size && v.color && v.stock > 0),
      }

      console.log("Dados do produto a serem enviados:", productData)
      console.log("URLs das imagens:", imageUrls)

      const res = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Erro ao criar produto")
        setLoading(false)
        return
      }

      setSuccess("Produto criado com sucesso!")
      setTimeout(() => {
        router.push("/admin/produtos")
      }, 1500)
    } catch (err) {
      setError("Erro de conexão com o servidor")
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Adicionar Novo Produto</h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Informações do Produto</CardTitle>
            <CardDescription>Preencha os dados do novo produto</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Nome do Produto *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Vestido Floral"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700">
                    Preço *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm font-semibold text-gray-700">
                  Categoria *
                </Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  placeholder="Descreva o produto..."
                  rows={4}
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              {/* Upload de imagens */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700">
                  Imagens do Produto
                </Label>
                
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
                    handleFiles(files)
                  }}
                >
                  <Upload className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Arraste as imagens aqui ou clique para selecionar</p>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="image-upload"
                    />
                    <Button type="button" variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50 pointer-events-none">
                      Selecionar Imagens
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                  </p>
                </div>

                {/* Preview das imagens */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-pink-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variantes do produto */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">
                    Variantes do Produto
                  </Label>
                  <Button
                    type="button"
                    onClick={addVariant}
                    variant="outline"
                    size="sm"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Variante
                  </Button>
                </div>

                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-pink-200 rounded-lg">
                    <div>
                      <Label className="text-xs text-gray-600">Tamanho</Label>
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(index, "size", e.target.value)}
                        placeholder="Ex: P, M, G"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Cor</Label>
                      <Input
                        value={variant.color}
                        onChange={(e) => updateVariant(index, "color", e.target.value)}
                        placeholder="Ex: Azul, Vermelho"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Estoque</Label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={() => removeVariant(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensagens de erro/sucesso */}
              {error && (
                <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-sm font-semibold text-center bg-green-50 p-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                >
                  {loading ? "Criando produto..." : "Criar Produto"}
                </Button>
                <Link href="/admin/produtos">
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