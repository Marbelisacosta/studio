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
              alt="Abstract background for Click Shop" 
              layout="fill"
              objectFit="cover"
              className="opacity-30"
              data-ai-hint="abstract modern"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="h-16 w-16 text-white mb-4" />
              <CardTitle className="text-5xl font-headline font-bold text-white">
                About Click Shop
              </CardTitle>
              <p className="text-xl text-white/90 mt-2">Discover Our Story</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-8 text-lg">
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-4 text-primary">Our Mission</h2>
            <p className="text-foreground/90 leading-relaxed">
              Welcome to Click Shop, your premier destination for an easy and delightful online shopping experience. 
              Our mission is to provide a curated selection of high-quality products with a seamless, user-friendly interface.
              We believe in making quality accessible to everyone, simplifying your search for the perfect items.
            </p>
          </section>
          
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-4 text-primary">Our Vision</h2>
            <p className="text-foreground/90 leading-relaxed">
              Founded on the principles of simplicity and customer satisfaction, Click Shop aims to be the go-to platform
              for your everyday needs and special finds. We envision a world where online shopping is not just a transaction, 
              but a genuinely enjoyable journey of discovery. We champion a minimalist approach, focusing on what truly matters:
              great products, transparent practices, and an exceptional customer experience.
            </p>
          </section>
          
          <div className="grid md:grid-cols-2 gap-8 pt-6">
            <div className="flex justify-center items-center">
              <Image 
                src="https://placehold.co/400x300.png" 
                alt="Click Shop team or workspace" 
                width={400} 
                height={300} 
                className="rounded-lg shadow-md object-cover"
                data-ai-hint="team workspace"
              />
            </div>
            <section>
              <h3 className="text-2xl font-headline font-semibold mb-4 text-accent">Connect With Us</h3>
              <ul className="space-y-4 text-foreground/80">
                <li className="flex items-start">
                  <Building className="h-6 w-6 mr-3 mt-1 text-primary shrink-0" />
                  <span>123 Shopping Lane, Commerce City, CS 12345, Digital Realm</span>
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
            <h3 className="text-2xl font-headline font-semibold mb-4 text-accent">Acknowledgements</h3>
            <p className="text-foreground/90 leading-relaxed">
              This application was lovingly crafted with modern technologies to bring you the best experience. 
              Special thanks to the open-source community, our dedicated team of innovators, and you - our valued customer - 
              for being part of the Click Shop journey.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
