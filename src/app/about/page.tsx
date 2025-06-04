import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-3xl mx-auto shadow-xl overflow-hidden rounded-lg border">
        <CardHeader className="p-0">
           <div className="relative w-full h-64 bg-gradient-to-r from-primary to-accent">
            <Image 
              src="https://placehold.co/800x400.png" 
              alt="Fondo abstracto para Click Shop" 
              layout="fill"
              objectFit="cover"
              className="opacity-30"
              data-ai-hint="abstracto moderno"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="h-16 w-16 text-white mb-4" />
              <CardTitle className="text-5xl font-headline font-bold text-white">
                Sobre Click Shop
              </CardTitle>
              <p className="text-xl text-white/90 mt-2">Descubre Nuestra Historia</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-8 text-lg">
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-4 text-primary">Nuestra Misión</h2>
            <p className="text-foreground/90 leading-relaxed">
              Bienvenido a Click Shop, tu destino principal para una experiencia de compra en línea fácil y encantadora. 
              Nuestra misión es proporcionar una selección curada de productos de alta calidad con una interfaz fluida y fácil de usar.
              Creemos en hacer la calidad accesible para todos, simplificando tu búsqueda de los artículos perfectos.
            </p>
          </section>
          
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-4 text-primary">Nuestra Visión</h2>
            <p className="text-foreground/90 leading-relaxed">
              Fundada en los principios de simplicidad y satisfacción del cliente, Click Shop aspira a ser la plataforma de referencia
              para tus necesidades diarias y hallazgos especiales. Visualizamos un mundo donde las compras en línea no sean solo una transacción, 
              sino un viaje de descubrimiento genuinamente agradable. Defendemos un enfoque minimalista, centrándonos en lo que realmente importa:
              excelentes productos, prácticas transparentes y una experiencia de cliente excepcional.
            </p>
          </section>
          
          <div className="grid md:grid-cols-2 gap-8 pt-6">
            <div className="flex justify-center items-center">
              <Image 
                src="https://placehold.co/400x300.png" 
                alt="Equipo o espacio de trabajo de Click Shop" 
                width={400} 
                height={300} 
                className="rounded-lg shadow-md object-cover"
                data-ai-hint="equipo oficina"
              />
            </div>
            <section>
              <h3 className="text-2xl font-headline font-semibold mb-4 text-accent">Conéctate Con Nosotros</h3>
              <ul className="space-y-4 text-foreground/80">
                <li className="flex items-start">
                  <Building className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                  <span>Calle de Compras 123, Ciudad Comercio, CC 12345, Reino Digital</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-6 w-6 mr-3 text-primary shrink-0" />
                  <a href="mailto:info@clickshop.example.com" className="hover:text-accent transition-colors duration-300">
                    info@clickshop.example.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-6 w-6 mr-3 text-primary shrink-0" />
                  <a href="tel:+1234567890" className="hover:text-accent transition-colors duration-300">
                    (123) 456-7890
                  </a>
                </li>
              </ul>
            </section>
          </div>

          <section className="pt-6">
            <h3 className="text-2xl font-headline font-semibold mb-4 text-accent">Agradecimientos</h3>
            <p className="text-foreground/90 leading-relaxed">
              Esta aplicación fue cuidadosamente creada con tecnologías modernas para brindarte la mejor experiencia. 
              Un agradecimiento especial a la comunidad de código abierto, a nuestro dedicado equipo de innovadores, y a ti - nuestro valioso cliente - 
              por ser parte del viaje de Click Shop.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
