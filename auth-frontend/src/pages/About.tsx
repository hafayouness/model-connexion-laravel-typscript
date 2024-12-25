import React from "react";

const About: React.FC = () => {
  return (
    <section className="h-screen bg-gray-100 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
          About Our Educational Platform
        </h2>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          We have created an innovative educational platform with the aim of
          simplifying access to information and fostering a better understanding
          for everyone. This platform offers interactive tools and educational
          resources designed to meet the specific needs of students and
          learners. It aims to make learning more accessible, clear, and
          engaging while facilitating the exchange of ideas and knowledge among
          users. By focusing on simplicity and efficiency, we strive to
          contribute to a modern and inclusive educational environment where
          everyone can progress at their own pace and achieve their goals.
        </p>
      </div>
    </section>
  );
};

export default About;
