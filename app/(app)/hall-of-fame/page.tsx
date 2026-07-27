"use client";

import { useState } from "react";
import { Search, Trophy, ChevronDown, ChevronUp, Mountain, MapPin, Award } from "lucide-react";
import { HOF_DATA, HofInductee } from "@/lib/hofData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HallOfFamePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEra, setSelectedEra] = useState<string>("All Eras");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["All", "Pioneers", "Downhill Champions", "Cross Country Legends", "Endurance & Altitude Records", "Trailbuilders & Conservationists"];
  const eras = ["All Eras", "1980s", "1990s", "2000s", "2010s", "2020s"];

  const filteredData = HOF_DATA.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesEra = selectedEra === "All Eras" || item.era === selectedEra;
    return matchesSearch && matchesCategory && matchesEra;
  }).sort((a, b) => {
    return sortOrder === "asc" ? a.yearInducted - b.yearInducted : b.yearInducted - a.yearInducted;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-900 py-20 px-6 sm:px-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative max-w-6xl mx-auto z-10 flex flex-col items-center text-center">
          <Trophy className="w-16 h-16 text-emerald-400 mb-6" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Nepalese MTB Hall of Fame
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl font-medium">
            Honoring the legends, pioneers, record-holders, and defining moments of mountain biking in Nepal.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Left Column: Timeline & Inductees (Span 3) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search legends, events..." 
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <select 
                className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              
              <button 
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-4 py-2 whitespace-nowrap rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                {sortOrder === "asc" ? "Oldest First ⬇" : "Newest First ⬆"}
              </button>
            </div>
          </div>

          {/* Timeline Jump Bar */}
          <div className="flex overflow-x-auto bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 p-1 shadow-sm hide-scrollbar">
            {eras.map(era => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-semibold transition-all ${selectedEra === era ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {era}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
            {filteredData.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                No legends found matching your criteria.
              </div>
            )}
            {filteredData.map((inductee) => (
              <div key={inductee.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline Marker */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-emerald-500 text-white font-bold text-sm shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mx-auto">
                  {inductee.yearInducted}
                </div>

                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === inductee.id ? null : inductee.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">{inductee.category}</Badge>
                      {expandedId === inductee.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{inductee.name}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">{inductee.role}</p>
                    
                    <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 mb-4 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
                      {inductee.quote}
                    </blockquote>
                    
                    <div className="h-48 w-full relative rounded-lg overflow-hidden mt-4 hidden md:block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={inductee.imageUrl} alt={inductee.name} className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500" />
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {expandedId === inductee.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-300">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                        {inductee.description}
                      </p>
                      
                      <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-amber-500" /> Key Highlights
                      </h4>
                      <ul className="space-y-2">
                        {inductee.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span className="text-emerald-500 mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Trophy className="w-24 h-24" />
             </div>
             <h3 className="text-xl font-bold mb-6 relative z-10">Legacy in Numbers</h3>
             <div className="space-y-6 relative z-10">
               <div>
                 <p className="text-slate-400 text-sm mb-1">Total Inductees</p>
                 <p className="text-3xl font-black text-emerald-400">{HOF_DATA.length}</p>
               </div>
               <div>
                 <p className="text-slate-400 text-sm mb-1 flex items-center gap-1"><Mountain className="w-4 h-4"/> Highest Altitude Ride</p>
                 <p className="text-xl font-bold text-white">5,416m <span className="text-sm font-normal text-slate-300">(Thorong La)</span></p>
               </div>
               <div>
                 <p className="text-slate-400 text-sm mb-1 flex items-center gap-1"><Trophy className="w-4 h-4"/> Most Asian DH Titles</p>
                 <p className="text-xl font-bold text-white">4 <span className="text-sm font-normal text-slate-300">(Rajesh Magar)</span></p>
               </div>
               <div>
                 <p className="text-slate-400 text-sm mb-1 flex items-center gap-1"><MapPin className="w-4 h-4"/> First Expedition</p>
                 <p className="text-xl font-bold text-white">1988</p>
               </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Nominate a Legend</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Know someone who has significantly impacted the mountain biking scene in Nepal? Let us know.
            </p>
            <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg">
              Submit Nomination
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
