import React from 'react'
import { Activity, Calendar, Clock, Users } from "lucide-react";
import {Link} from 'react-router-dom'

function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full bg-white/30 backdrop-blur-md shadow-md">
            <div className="container mx-auto flex h-16 items-center px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Activity className="h-6 w-6 text-blue-600" />
                <span>HealthCare Pro</span>
              </Link>
              <nav className="ml-auto flex gap-6">
                <Link href="/patients" className="text-sm font-medium hover:underline">Patients</Link>
                <Link href="/appointments" className="text-sm font-medium hover:underline">Appointments</Link>
                <Link href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>
              </nav>
              <div className="ml-4">
                <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Login
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold sm:text-5xl">Secure Healthcare Management</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  Manage patient records, schedule appointments, and track healthcare metrics with our HIPAA-compliant platform.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Get Started
                  </Link>
                  <Link href="/about" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white">
                    Learn More
                  </Link>
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold sm:text-5xl">Key Features</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  Our platform provides everything you need to manage your healthcare practice efficiently and securely.
                </p>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="p-6 border rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-blue-600" />
                      <h3 className="text-xl font-semibold">Patient Management</h3>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Securely store and manage patient records with HIPAA-compliant storage and access controls.
                    </p>
                  </div>
                  <div className="p-6 border rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <h3 className="text-xl font-semibold">Appointment Scheduling</h3>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Easily schedule, reschedule, and manage appointments with an intuitive calendar interface.
                    </p>
                  </div>
                  <div className="p-6 border rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-blue-600" />
                      <h3 className="text-xl font-semibold">Real-time Analytics</h3>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Track key metrics and generate reports to optimize your practice's performance.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer className="w-full border-t py-6 bg-gray-50">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4">
              <p className="text-sm text-gray-600">© 2025 HealthCare Pro. All rights reserved.</p>
              <nav className="flex gap-4">
                <Link href="/terms" className="text-sm font-medium hover:underline">Terms of Service</Link>
                <Link href="/privacy" className="text-sm font-medium hover:underline">Privacy Policy</Link>
                <Link href="/contact" className="text-sm font-medium hover:underline">Contact</Link>
              </nav>
            </div>
          </footer>
        </div>
      );
}

export default LandingPage
