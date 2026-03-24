import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function About() {
  return (
    <div className="min-h-screen bg-primary text-secondary">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-accent animate-fade-in">
              About LuxZoraCraft
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Crafting Excellence, Defining Luxury
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Story Content */}
            <div className="space-y-6 animate-slide-up">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                <p>
                  Founded on the principles of exceptional craftsmanship and timeless elegance, 
                  LuxZoraCraft has been at the forefront of luxury creation for over a decade. 
                  We believe that true luxury lies not just in the materials we use, but in 
                  the passion and precision that goes into every piece we create.
                </p>
                <p>
                  Our journey began with a simple vision: to create products that transcend 
                  mere functionality and become cherished heirlooms. Each item in our collection 
                  tells a story of dedication, artistry, and an unwavering commitment to excellence.
                </p>
                <p>
                  From the initial concept to the final finishing touches, every step of our 
                  process is guided by our core values of quality, innovation, and sustainability. 
                  We work with skilled artisans who share our passion for perfection, ensuring 
                  that each piece meets our exacting standards.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src="/images/about/1.jpg"
                  alt="LuxZoraCraft craftsmanship"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative lg:order-1">
              <div className="aspect-square overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src="/images/about/2.jpg"
                  alt="LuxZoraCraft values"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Values Content */}
            <div className="space-y-6 lg:order-2">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent">
                Our Values
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-semibold text-accent-light">
                    Excellence
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We never compromise on quality. Every piece is meticulously crafted 
                    to exceed expectations and stand the test of time.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-semibold text-accent-light">
                    Innovation
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We embrace cutting-edge techniques while respecting traditional craftsmanship, 
                    creating pieces that are both timeless and contemporary.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-semibold text-accent-light">
                    Sustainability
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We are committed to responsible sourcing and sustainable practices, 
                    ensuring our luxury doesn't come at the expense of our planet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent mb-8">
            Our Mission
          </h2>
          <div className="bg-gradient-gold p-8 rounded-lg">
            <p className="text-xl md:text-2xl text-primary leading-relaxed font-medium">
              To create extraordinary experiences through exceptional craftsmanship, 
              transforming the ordinary into the extraordinary, one masterpiece at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent mb-6">
            Experience the Difference
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Discover our collection and become part of the LuxZoraCraft legacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-accent hover:bg-accent-light text-primary px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              View Collection
            </a>
            <a
              href="/contact"
              className="border border-accent hover:bg-accent hover:text-primary text-accent px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
