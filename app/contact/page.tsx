'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-primary text-secondary">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-accent animate-fade-in">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Let's create something extraordinary together
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent mb-6">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  We'd love to hear from you. Whether you have a question about our products, 
                  need assistance with an order, or want to discuss a custom creation, 
                  our team is here to help.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-accent-light mb-2">
                      Visit Our Studio
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      123 Luxury Lane<br />
                      Beverly Hills, CA 90210<br />
                      United States
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-accent-light mb-2">
                      Call Us
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      +1 (555) 123-4567<br />
                      Toll-free: +1 (800) 555-LUXZ
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-accent-light mb-2">
                      Email Us
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      info@luxzoracraft.com<br />
                      orders@luxzoracraft.com
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-accent-light mb-2">
                      Business Hours
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: By appointment only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-dark p-8 rounded-lg">
              <h2 className="font-serif text-3xl font-bold text-accent mb-6">
                Send a Message
              </h2>
              
              {submitted ? (
                <div className="bg-gradient-gold p-6 rounded-lg text-center">
                  <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                    Thank You!
                  </h3>
                  <p className="text-primary">
                    Your message has been sent successfully. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-accent-light mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-primary border border-gray-600 rounded-lg focus:outline-none focus:border-accent text-secondary placeholder-gray-400"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-accent-light mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-primary border border-gray-600 rounded-lg focus:outline-none focus:border-accent text-secondary placeholder-gray-400"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-accent-light mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-primary border border-gray-600 rounded-lg focus:outline-none focus:border-accent text-secondary placeholder-gray-400"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-accent-light mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-primary border border-gray-600 rounded-lg focus:outline-none focus:border-accent text-secondary placeholder-gray-400 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent-light text-primary px-8 py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent mb-4">
              Find Our Studio
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Located in the heart of Beverly Hills, our studio welcomes visitors by appointment.
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="relative h-96 bg-primary rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold text-accent mb-2">
                  Interactive Map
                </h3>
                <p className="text-gray-300">
                  Map integration coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-dark p-6 rounded-lg">
              <h3 className="font-serif text-xl font-semibold text-accent-light mb-3">
                Do you offer custom designs?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Yes! We specialize in custom creations. Our skilled artisans work closely with you 
                to bring your vision to life, creating unique pieces that reflect your personal style.
              </p>
            </div>

            <div className="bg-gray-dark p-6 rounded-lg">
              <h3 className="font-serif text-xl font-semibold text-accent-light mb-3">
                What is your return policy?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We offer a 30-day return policy for all non-custom items. Custom pieces are final sale 
                due to their personalized nature. All returns must be in original condition with packaging.
              </p>
            </div>

            <div className="bg-gray-dark p-6 rounded-lg">
              <h3 className="font-serif text-xl font-semibold text-accent-light mb-3">
                How long does shipping take?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days. 
                Custom orders typically require 2-4 weeks for completion before shipping.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
