import { Sparkles, Heart, Shirt, Sun } from "lucide-react"

const tips = [
  {
    icon: <Sparkles className="h-8 w-8 text-pink-600" />,
    title: "Limpeza Adequada",
    description:
      "Use produtos específicos para o material do seu calçado. Evite água em excesso para couros e camurças.",
  },
  {
    icon: <Heart className="h-8 w-8 text-pink-600" />,
    title: "Armazenamento Correto",
    description:
      "Guarde seus sapatos em locais arejados, longe da umidade e da luz solar direta. Use formas para manter o formato.",
  },
  {
    icon: <Shirt className="h-8 w-8 text-pink-600" />,
    title: "Alternar o Uso",
    description: "Evite usar o mesmo par de sapatos todos os dias. Deixe-os 'respirar' para prolongar a vida útil.",
  },
  {
    icon: <Sun className="h-8 w-8 text-pink-600" />,
    title: "Proteção Extra",
    description: "Considere usar sprays impermeabilizantes para proteger seus calçados contra água e manchas.",
  },
]

export default function CareTips() {
  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Dicas de <span className="text-pink-600">Cuidado</span> para seus Calçados
          </h2>
          <p className="text-lg text-gray-600">Mantenha seus calçados sempre novos com estas dicas essenciais.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">{tip.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                {tip.title}
              </h3>
              <p className="text-gray-600 text-sm">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
