export default function AboutSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Sobre <span className="text-pink-600">Emy-by</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <img
              src="/placeholder.svg?height=400&width=400"
              alt="Esterfanny - Dona da loja"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="order-1 md:order-2 space-y-4 md:space-y-6">
            <h3
              className="text-xl md:text-2xl font-bold text-pink-600 mb-4 md:mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Loja
            </h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Olá meu nome é Esterfanny, sou proprietária da loja Emy, que é abreviação do meu nome. Há um tempo sou
              empreendedora e sempre gostei do ramo de beleza e eleva autoestima das mulheres.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Agora resolvi divulgar aos meus clientes para continuarem investindo em si com frequência e as novas
              passem a valorizar a beleza que tem de forma modesta e com estilo.
            </p>
            <p className="text-lg md:text-xl text-center font-semibold text-gray-800 mt-6 md:mt-8">
              Invista em <span className="text-xl md:text-2xl text-pink-600">Você</span> com mais frequência
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
