import React from 'react';
import {
  Search,
  TrendingUp,
  Building2,
  Bookmark,
  Sparkles,
  FileText,
  Target,
  ArrowUpRight
} from 'lucide-react';

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, iconColor }) => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300">

      {/* Icon Container */}
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-[#111111] border border-white/10 shadow-sm">
        <Icon
          className={`w-6 h-6 ${iconColor || "text-white"}`}
          strokeWidth={1.5}
        />
      </div>

      {/* Text Content */}
      <div>
        <h3 className="text-white font-medium text-[15px] mb-1">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find your ideal job with advanced filters.",
      iconColor: "text-purple-300"
    },
    {
      icon: TrendingUp,
      title: "Salary Insights",
      description: "Get real salary data to negotiate confidently.",
      iconColor: "text-purple-300"
    },
    {
      icon: Building2,
      title: "Top Companies",
      description: "Apply to vetted companies that are hiring.",
      iconColor: "text-purple-300"
    },
    {
      icon: Bookmark,
      title: "Saved Jobs",
      description: "Manage apps & favorites on your dashboard.",
      iconColor: "text-purple-300"
    },
    {
      icon: Sparkles,
      title: "One-Click Apply",
      description: "Simplify your job applications for an easier process!",
      iconColor: "text-purple-300"
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description: "Create professional resumes with modern templates.",
      iconColor: "text-purple-300"
    },
    {
      icon: Target,
      title: "Skill-Based Matching",
      description: "Discover jobs that match your skills and experience.",
      iconColor: "text-purple-300"
    },
    {
      icon: ArrowUpRight,
      title: "Career Growth Resources",
      description: "Boost your career with quick interview tips.",
      iconColor: "text-purple-300"
    }
  ];

  return (
    <section className="bg-[#0a0a0a] py-24 px-6 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-16">

          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>

            <span className="text-blue-500 text-xs font-semibold tracking-[0.2em] uppercase">
              Features Job
            </span>

            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          </div>

          {/* Title */}
          <h2 className="text-white text-4xl md:text-5xl font-semibold tracking-tight max-w-lg leading-[1.2]">
            Everything you need to succeed
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;