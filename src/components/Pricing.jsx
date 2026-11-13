import React from 'react';
import { Crown, BarChart3, Zap, Plus, ArrowRight } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      icon: Crown,
      price: "0",
      description: "Start building your insights hub:",
      features: [
        "Daily AI match brief (top 5)",
        "Verified salary bands",
        "Company insight dashboards",
        "1-click apply, unlimited"
      ],
      isPopular: false,
    },
    {
      name: "Growth",
      icon: BarChart3,
      price: "17",
      description: "Start building your insights hub:",
      features: [
        "Daily AI match brief (top 5)",
        "Verified salary bands",
        "Company insight dashboards",
        "1-click apply, unlimited"
      ],
      isPopular: true, // এই প্ল্যানটি হাইলাইট করা হবে
    },
    {
      name: "Premium",
      icon: Zap,
      price: "99",
      description: "Start building your insights hub:",
      features: [
        "Everything in Pro",
        "Multi-profile career portfolios",
        "Shared talent rooms",
        "Recruiter view (read-only)"
      ],
      isPopular: false,
    }
  ];

  return (
    <section className="bg-[#0a0a0a] py-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-blue-500 text-xs font-semibold tracking-[0.2em] uppercase">
              Pricing
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          </div>
          
          {/* Title */}
          <h2 className="text-white text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl leading-[1.15]">
            Pay for the leverage, <br /> not the listings
          </h2>
        </div>

        {/* Toggle Button (Monthly / Yearly) */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center p-1 rounded-full bg-[#1a1a1a] border border-white/10">
            <button className="px-6 py-2 rounded-full bg-white text-black text-sm font-semibold transition-all">
              Monthly
            </button>
            <button className="flex items-center gap-2 px-6 py-2 rounded-full text-zinc-400 hover:text-white text-sm font-medium transition-all">
              Yearly
              <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div 
                key={index}
                className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300
                  ${plan.isPopular 
                    ? 'bg-[#151515] border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]' 
                    : 'bg-[#0f0f0f] border-white/10 hover:border-white/20'
                  }
                `}
              >
                {/* Card Header (Icon + Title + Price) */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
                      <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-white font-medium text-lg">{plan.name}</h3>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-white text-3xl font-bold">${plan.price}</span>
                    <span className="text-zinc-500 text-xs font-medium">/month</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-300 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-sm text-zinc-400">
                      <Plus className="w-4 h-4 shrink-0 text-zinc-500 mt-0.5" strokeWidth={2.5} />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button 
                  className={`flex items-center justify-between w-full py-3.5 px-5 rounded-xl text-sm font-medium transition-all group
                    ${plan.isPopular 
                      ? 'bg-white text-black hover:bg-zinc-200' 
                      : 'bg-[#1a1a1a] text-white border border-white/10 hover:bg-[#222]'
                    }
                  `}
                >
                  Choose This Plan
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;