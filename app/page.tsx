import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search-bar'
import { FeatureCard } from '@/components/feature-card'
import { PropertyCard } from '@/components/property-card'
import { 
  Globe, 
  Shield, 
  Users, 
  Zap, 
  Star, 
  MapPin,
  CreditCard,
  Bitcoin
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-nomadiqe-900/90 via-nomadiqe-800/80 to-purple-900/90" />
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
            alt="Travel background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">Nomadiqe</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in">
            Fairer Stays, Deeper Connections
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto animate-fade-in">
            Revolutionize your travel experience with blockchain-powered bookings, 
            lower fees, and authentic local connections.
          </p>

          {/* Search Bar */}
          <div className="mb-8 animate-fade-in">
            <SearchBar />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="bg-nomadiqe-600 hover:bg-nomadiqe-700">
              <Link href="/search">
                Start Exploring
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-nomadiqe-900">
              <Link href="/host">
                Become a Host
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Nomadiqe?</h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of travel booking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Lower Fees"
              description="Only 5% commission vs 15-30% on traditional platforms"
            />
            <FeatureCard
              icon={<Bitcoin className="w-8 h-8" />}
              title="Crypto Payments"
              description="Pay with Bitcoin, Ethereum, and other cryptocurrencies"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Local Connections"
              description="Connect with hosts and discover authentic experiences"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Booking"
              description="Book instantly with secure blockchain escrow"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Global Network"
              description="Properties and experiences worldwide"
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Verified Hosts"
              description="All hosts are verified and reviewed by our community"
            />
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-xl text-muted-foreground">
              Discover unique stays from our verified hosts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample properties - in real app, these would come from the database */}
            <PropertyCard
              id="1"
              title="Cozy Mountain Cabin"
              location="Swiss Alps"
              price={120}
              rating={4.8}
              image="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={4}
              bedrooms={2}
            />
            <PropertyCard
              id="2"
              title="Modern City Loft"
              location="Barcelona, Spain"
              price={85}
              rating={4.9}
              image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={2}
              bedrooms={1}
            />
            <PropertyCard
              id="3"
              title="Beachfront Villa"
              location="Bali, Indonesia"
              price={200}
              rating={4.7}
              image="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={6}
              bedrooms={3}
            />
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/search">
                View All Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-bg">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of travelers and hosts already using Nomadiqe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/signup">
                Get Started
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-nomadiqe-900">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
