import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import PingPongGame from './PingPongGame';
import iconReactGame from './react.jpg';
import iconThreeJS from './ThreeJS.jpg';
import iconUnityIf from './unityIf.png';
import iconUnityWenture from './TheWenture.jpg';

function App() {
  // Состояние для хранения текущего индекса изображения.
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const projectData = [
    {
      image: iconReactGame,
      link: 'https://react4-spoon221s-projects.vercel.app/',
      title: 'React Portfolio'
    },
    {
      image: iconUnityWenture,
      link: 'https://github.com/Spoon221/IFdead',
      title: 'Dotimo Project'
    },
    {
      image: iconThreeJS,
      link: 'https://simakovevgeny.vercel.app/',
      title: 'Three.js Portfolio'
    },
    {
      image: iconUnityIf,
      link: 'https://github.com/Spoon221/IFdead',
      title: 'Dotimo Project'
    },
  ];

  // Эффект для автоматического переключения изображений.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % projectData.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Обработчик клика по изображению.
  const handleImageClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // Состояние для хранения текущей позиции скролла.
  const [scrollY, setScrollY] = useState(0);

  // Эффект для отслеживания позиции скролла.
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Стиль для параллакс-эффекта.
  const parallaxStyle = {
    transform: `scale(${1 + scrollY * 0.0005})`,
    opacity: Math.max(1 - scrollY * 0.002, 0)
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 overflow-hidden"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl hero-content" style={parallaxStyle}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 space-gradient-text pt-2 pb-3">
            Evgeniy Simakov
          </h1>
          <p className="text-2xl md:text-3xl mb-8 space-subtitle">
            Frontend Developer
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="flex items-center gap-6">
              <a href="https://github.com/Spoon221" className="hover:text-gray-300 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/евгений-симаков-7680b0345/" className="hover:text-gray-300 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:simakov.jenja@gmail.com" className="hover:text-gray-300 transition-colors">
                <Mail size={24} />
              </a>
            </div>
            <a
              href="https://simakovevgeny.vercel.app/"
              className="social-icon text-white hover:text-gray-300 transition-all nav-link px-3 py-1 rounded-full bg-white/10 backdrop-blur"
              target="_blank"
              rel="noopener noreferrer"
            >
              Projects
            </a>
          </div>
        </div>
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <User className="text-black" size={24} />
            <h2 className="text-3xl font-bold">About me</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-12">
            I am a frontend developer specializing in web applications using Three.js and React. Additionally, I develop games using Unity, and I have a diverse technology stack.
          </p>

          {/* Image Carousel */}
          <div className="relative h-[400px] md:h-[600px] overflow-hidden rounded-lg shadow-xl">
            <div
              className="absolute inset-0 flex flex-col transition-transform duration-500"
              style={{ transform: `translateY(-${currentImageIndex * 100}%)` }}
            >
              {projectData.map((project, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 relative cursor-pointer group"
                  onClick={() => handleImageClick(project.link)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-contain bg-gray-900"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ExternalLink className="text-white" size={32} />
                  </div>
                </div>
              ))}
            </div>
            {/* Navigation dots */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
              {projectData.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${currentImageIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            {/* Left/Right navigation arrows */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev - 1 + projectData.length) % projectData.length);
              }}
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev + 1) % projectData.length);
              }}
              aria-label="Next image"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 md:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <Briefcase size={24} />
            <h2 className="text-3xl font-bold">Work experience</h2>
          </div>
          <div className="space-y-12">
            <div className="border-l-2 border-white pl-8 relative">
              <div className="absolute w-4 h-4 bg-white rounded-full -left-[9px] top-0"></div>
              <h3 className="text-xl font-bold mb-2">Full stack Developer</h3>
              <p className="text-gray-400 mb-2">Learn&Grow • Remote •  2024 - Current Period</p>
              <p className="text-gray-300">Development of a web application using Go and integration with a Telegram bot.</p>
            </div>
            <div className="border-l-2 border-white pl-8 relative">
              <div className="absolute w-4 h-4 bg-white rounded-full -left-[9px] top-0"></div>
              <h3 className="text-xl font-bold mb-2">Frontend Developer</h3>
              <p className="text-gray-400 mb-2">Dotimo • Ekaterinburg • 2023 - 2024</p>
              <p className="text-gray-300">Designing user interfaces and enhancing interactivity, as well as providing support for existing projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb- 12">
            <Code size={24} />
            <h2 className="text-3xl font-bold">Skills</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {['React', 'Vue', 'TypeScript', 'JavaScript', 'Three JS', 'HTML/CSS', 'Blender', 'Drei', 'Python', 'MySQL', 'C#', 'Unity', 'C++', 'Vite', 'Git'].map((skill) => (
              <div key={skill} className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <p className="text-lg font-medium">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 px-4 md:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <GraduationCap size={24} />
            <h2 className="text-3xl font-bold">Education</h2>
          </div>
          <div className="border-l-2 border-white pl-8 relative">
            <div className="absolute w-4 h-4 bg-white rounded-full -left-[9px] top-0"></div>
            <h3 className="text-xl font-bold mb-2">Software Engineer</h3>
            <p className="text-gray-400 mb-2">Institute of Radio Engineering at Ural Federal University • 2021 - 2025</p>
            <p className="text-gray-300">Bachelor</p>
          </div>
        </div>
      </section>

      {/* Ping Pong Game Section */}
      <PingPongGame />

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://github.com/Spoon221" className="text-black hover:text-gray-600 transition-colors"><Github size={24} /></a>
            <a href="https://www.linkedin.com/in/евгений-симаков-7680b0345/" className="text-black hover:text-gray-600 transition-colors"><Linkedin size={24} /></a>
            <a href="mailto:simakov.jenja@gmail.com" className="text-black hover:text-gray-600 transition-colors"><Mail size={24} /></a>
            <a href="https://simakovevgeny.vercel.app/" className="text-black hover:text-gray-600 transition-colors">Project</a>
          </div>
          <p className="text-gray-600">© 2025 Evgeniy Simakov</p>
        </div>
      </footer>
    </div>
  );
}

export default App;