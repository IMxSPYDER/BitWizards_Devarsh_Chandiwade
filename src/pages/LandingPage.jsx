import React, { useState } from 'react'
import { Activity, Calendar, Clock, Users } from "lucide-react";
import {Link} from 'react-router-dom'
import image from '../assets/land.png'
import { useTranslation } from "react-i18next";

// Contains the value and text for the options
const languages = [
    { value: "", text: "Select Language" },
    { value: "en", text: "English" },
    { value: "hi", text: "Hindi" },
    { value: "bn", text: "Bengali" },
    { value: "mr", text: "Marathi"},
    { value: "fr", text: "French"}
];

function LandingPage() {
    const { t } = useTranslation();

    const [lang, setLang] = useState("");

    // This function put query that helps to
    // change the language
    const handleChange = (e) => {
        setLang(e.target.value);
        let loc = "http://localhost:5173/";
        window.location.replace(
            loc + "?lng=" + e.target.value
        );
    };

    return (
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full bg-white/30 backdrop-blur-md shadow-md">
            <div className="container mx-auto flex h-16 items-center px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Activity className="h-6 w-6 text-blue-600" />
                <span>HealthCare Pro</span>
              </Link>
              <nav className="ml-auto flex gap-6">
                <Link href="/patients" className="text-sm font-medium hover:underline">{t("Patients")}</Link>
                <Link href="/appointments" className="text-sm font-medium hover:underline">{t("Appointments")}</Link>
                <Link href="/dashboard" className="text-sm font-medium hover:underline">{t("Dashboard")}</Link>
                <select value={lang} onChange={handleChange}>
                {languages.map((item) => {
                    return (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.text}
                        </option>
                    );
                })}
            </select>

              </nav>
              <div className="ml-4">
                <Link to="/login" className="px-4 py-2 text-align-center bg-blue-600 font-medium text-white rounded-md hover:bg-blue-700">
                  {t("Login")}
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1">
          <section className="w-full px-10 flex flex-col md:flex-row items-center justify-center gap-8 py-12 md:py-24 lg:py-32 bg-gray-100 mx-auto text-center">
        <div className="container px-4 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl font-bold sm:text-5xl">{t("Secure Healthcare Management")}</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            {t("Manage patient records, schedule appointments, and track healthcare metrics with our HIPAA-compliant platform.")}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {t("Get Started")}
            </Link>
            <a href="#about" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white">
                {t("Learn More")}
            </a>
            </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
            <img src={image} className="h-[350px] w-[350px]" alt="" />
        </div>
        </section>

            <section id='about' className="w-full py-12 md:py-24 lg:py-32">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold sm:text-5xl">{t("Key Features")}</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  {t("Our platform provides everything you need to manage your healthcare practice efficiently and securely.")}
                </p>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="p-6 border rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-blue-600" />
                      <h3 className="text-xl font-semibold">{t("Patient Management")}</h3>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {t("Securely store and manage patient records with HIPAA-compliant storage and access controls.")}
                    </p>
                  </div>
                  <div className="p-6 border rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <h3 className="text-xl font-semibold">{t("Appointment Scheduling")}</h3>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {t("Easily schedule, reschedule, and manage appointments with an intuitive calendar interface.")}
                    </p>
                  </div>
                  <div className="p-6 border rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-blue-600" />
                      <h3 className="text-xl font-semibold">{t("Real-time Analytics")}</h3>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {t("Track key metrics and generate reports to optimize your practice's performance.")}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer className="w-full border-t py-6 bg-gray-50">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4">
              <p className="text-sm text-gray-600">{t("© 2025 HealthCare Pro. All rights reserved.")}</p>
              <nav className="flex gap-4">
                <Link href="/terms" className="text-sm font-medium hover:underline">{t("Terms of Service")}</Link>
                <Link href="/privacy" className="text-sm font-medium hover:underline">{t("Privacy Policy")}</Link>
                <Link href="/contact" className="text-sm font-medium hover:underline">{t("Contact")}</Link>
              </nav>
            </div>
          </footer>
        </div>
      );
}

export default LandingPage
