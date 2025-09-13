import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import PingPongGame from './PingPongGame';
import { translations } from './translation';
import './index.css';

// Импортируем изображения
import iconReactGame from './react.jpg';
import iconThreeJS from './ThreeJS.jpg';
import iconUnityIf from './unityIf.png';
import iconUnityWenture from './TheWenture.jpg';
import iconpyLearning from './pylearning.png';
import iconNuvia from './Nuvia.png';

function App() {
  // Состояние для хранения текущего индекса изображения.
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Состояние для хранения текущего языка (по умолчанию английский)
  const [language, setLanguage] = useState<'en' | 'ru'>('en');

  // Функция для переключения языка
  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'ru' : 'en'));
  };

  // Функция для получения текста по ключу в текущем языке
  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };


  // Состояние для интерактивности
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Функция для эффекта волны при наведении
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Создаем или обновляем элемент волны
    let waveElement = card.querySelector('.wave-effect') as HTMLElement;
    if (!waveElement) {
      waveElement = document.createElement('div');
      waveElement.className = 'wave-effect';
      card.appendChild(waveElement);
    }
    
    // Устанавливаем позицию относительно карточки
    waveElement.style.left = `${x}px`;
    waveElement.style.top = `${y}px`;
    waveElement.style.transform = 'translate(-50%, -50%)';
    waveElement.style.width = '200px';
    waveElement.style.height = '200px';
  };

  // Функция для удаления эффекта волны при уходе курсора
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const waveElement = card.querySelector('.wave-effect') as HTMLElement;
    if (waveElement) {
      waveElement.remove();
    }
    setHoveredSkill(null);
  };

  // Функция для наведения на навык
  const handleSkillHover = (skillName: string) => {
    setHoveredSkill(skillName);
  };



     // Группировка навыков по категориям с детальной информацией
   const skillCategories = {
     frontend: {
       title: t('frontend'),
       skills: [
         { name: 'React', description: t('skill_react_desc'), tags: ['Hooks', 'Context', 'Router'] },
         { name: 'Vue', description: t('skill_vue_desc'), tags: ['Composition API', 'Vuex', 'Nuxt'] },
         { name: 'TypeScript', description: t('skill_typescript_desc'), tags: ['Types', 'Interfaces', 'Generics'] },
         { name: 'JavaScript', description: t('skill_javascript_desc'), tags: ['ES6+', 'Async/Await', 'Modules'] },
         { name: 'HTML/CSS', description: t('skill_html_css_desc'), tags: ['Semantic HTML', 'Flexbox', 'Grid'] },
         { name: 'Three JS', description: t('skill_threejs_desc'), tags: ['WebGL', 'Scenes', 'Animations'] },
         { name: 'Drei', description: t('skill_drei_desc'), tags: ['Helpers', 'Hooks', 'Components'] },
         { name: 'Vite', description: t('skill_vite_desc'), tags: ['HMR', 'ES Modules', 'Plugins'] }
       ]
     },
     backend: {
       title: t('backend'),
       skills: [
         { name: 'Go', description: t('skill_go_desc'), tags: ['Goroutines', 'Channels', 'Gin'] },
         { name: 'FastAPI', description: t('skill_fastapi_desc'), tags: ['Async', 'Pydantic', 'OpenAPI'] },
         { name: 'Python', description: t('skill_python_desc'), tags: ['Django', 'Flask', 'Data Science'] },
         { name: 'MySQL', description: t('skill_mysql_desc'), tags: ['Queries', 'Indexes', 'Optimization'] },
         { name: 'PostgreSQL', description: t('skill_postgresql_desc'), tags: ['JSON', 'Full-text Search', 'Extensions'] }
       ]
     },
     other: {
       title: t('other'),
       skills: [
         { name: 'Blender', description: t('skill_blender_desc'), tags: ['Modeling', 'Rendering', 'Animation'] },
         { name: 'C#', description: t('skill_csharp_desc'), tags: ['.NET', 'Unity', 'LINQ'] },
         { name: 'Unity', description: t('skill_unity_desc'), tags: ['C#', 'Physics', 'Networking'] },
         { name: 'C++', description: t('skill_cpp_desc'), tags: ['Memory Management', 'STL', 'Performance'] },
         { name: 'Git', description: t('skill_git_desc'), tags: ['Branches', 'Merge', 'GitHub'] }
       ]
     }
  };

  const projectData = [
    {
      image: iconNuvia,
      link: 'https://react-black-two.vercel.app/',
      title: t('project_nuvia_title')
    },
    {
      image: iconpyLearning,
      link: 'https://learning-nine-cyan.vercel.app/',
      title: t('project_pylearning_title')
    },
    {
      image: iconReactGame,
      link: 'https://react4-spoon221s-projects.vercel.app/',
      title: t('project_react_title')
    },
    {
      image: iconUnityWenture,
      link: 'https://github.com/Spoon221/IFdead',
      title: t('project_unity_wenture_title')
    },
    {
      image: iconThreeJS,
      link: 'https://simakovevgeny.vercel.app/',
      title: t('project_threejs_title')
    },
    {
      image: iconUnityIf,
      link: 'https://github.com/Spoon221/IFdead',
      title: t('project_unity_if_title')
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
      
      // Анимация для карточек навыков при скролле
      const skillCards = document.querySelectorAll('.skill-card');
      skillCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && card instanceof HTMLElement) {
          card.style.animationDelay = `${index * 100}ms`;
          card.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
      });

      // Анимация для временной шкалы при скролле
      const timelineSection = document.querySelector('.timeline-section');
      if (timelineSection) {
        const rect = timelineSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
          timelineSection.classList.add('animate');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Стиль для параллакс-эффекта.
  const parallaxStyle = {
    transform: `scale(${1 + scrollY * 0.0005})`,
    opacity: Math.max(1 - scrollY * 0.002, 0)
  };

  // Функция для анимации прогресс-баров
  useEffect(() => {
    const animateProgressBars = () => {
      const skillFills = document.querySelectorAll('.skill-fill');
      skillFills.forEach((fill) => {
        const width = fill.getAttribute('data-width');
        if (width) {
          (fill as HTMLElement).style.setProperty('--skill-width', `${width}%`);
        }
      });
    };

    // Запускаем анимацию через небольшую задержку
    const timer = setTimeout(animateProgressBars, 1000);
    return () => clearTimeout(timer);
  }, []);



  return (
    <div className="min-h-screen bg-white">
      {/* Language Switch */}
      <button
        className="language-switcher"
        onClick={toggleLanguage}
        aria-label={`Switch to ${language === 'en' ? 'Russian' : 'English'}`}
      >
        {t('change_language')}
      </button>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 overflow-hidden"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl hero-content" style={parallaxStyle}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 space-gradient-text pt-2 pb-3">
            {t('name')}
          </h1>
          <p className="text-2xl md:text-3xl mb-8 space-subtitle">
            {t('role')}
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
             <div className="flex items-center gap-4">
            <a
              href="https://simakovevgeny.vercel.app/"
              className="social-icon text-white hover:text-gray-300 transition-all nav-link px-3 py-1 rounded-full bg-white/10 backdrop-blur"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('projects')}
            </a>
                                <a
                   href="https://disk.yandex.ru/i/k-RgCLyiC-N4Ew"
                   className="resume-download-btn px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                   target="_blank"
                   rel="noopener noreferrer"
                 >
                   📄 {t('download_resume')}
                 </a>
             </div>
          </div>
        </div>
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </header>

      {/* About Section */}
       <section className="py-12 sm:py-20 px-4 md:px-8 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
                     <div className="flex items-center gap-3 mb-6 sm:mb-8">
             <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
               <User className="text-white sm:w-7 sm:h-7" size={24} />
             </div>
             <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">{t('about_me')}</h2>
          </div>
                     <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8 sm:mb-12 max-w-3xl">
            {t('about_text')}
          </p>

          {/* Image Carousel */}
           <div className="relative h-[300px] sm:h-[400px] md:h-[600px] overflow-hidden rounded-lg shadow-xl">
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

                       {/* Interactive Timeline */}
            <div className="mt-20 timeline-section">
                             
                             <div className="timeline-container">
                 <div className="timeline-item" data-year="2021">
                   <div className="timeline-marker"></div>
                   <div className="timeline-content">
                     <h4 className="timeline-title text-lg sm:text-xl">{t('timeline_2021_title')}</h4>
                     <p className="timeline-description text-sm sm:text-base">{t('timeline_2021_description')}</p>
                     <div className="timeline-skills">
                       <span className="timeline-skill">Unity</span>
                       <span className="timeline-skill">C#</span>
                       <span className="timeline-skill">Client-Server</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="timeline-item" data-year="2022">
                   <div className="timeline-marker"></div>
                   <div className="timeline-content">
                     <h4 className="timeline-title text-lg sm:text-xl">{t('timeline_2022_title')}</h4>
                     <p className="timeline-description text-sm sm:text-base">{t('timeline_2022_description')}</p>
                     <div className="timeline-skills">
                       <span className="timeline-skill">React</span>
                       <span className="timeline-skill">Next.js</span>
                       <span className="timeline-skill">TypeScript</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="timeline-item" data-year="2023">
                   <div className="timeline-marker"></div>
                   <div className="timeline-content">
                     <h4 className="timeline-title text-lg sm:text-xl">{t('timeline_2023_title')}</h4>
                     <p className="timeline-description text-sm sm:text-base">{t('timeline_2023_description')}</p>
                     <div className="timeline-skills">
                       <span className="timeline-skill">Python</span>
                       <span className="timeline-skill">Go</span>
                       <span className="timeline-skill">AI Bots</span>
                     </div>
                   </div>
                 </div>
          </div>
        </div>
      </section>

         

         {/* Golf Game Section */}
      {/*
        <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🏌️ Interactive Golf Game
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Navigate through obstacles and get your ball in the hole! Works perfectly on both desktop and mobile.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
           <GolfGame />
          </div>
        </div>
      </section>
      */}
      

      {/* Experience Section */}
       <section className="py-12 sm:py-20 px-4 md:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto">
                     <div className="flex items-center gap-2 mb-8 sm:mb-12">
             <Briefcase size={20} className="sm:w-6 sm:h-6" />
             <h2 className="text-2xl sm:text-3xl font-bold">{t('work_experience')}</h2>
          </div>
          <div className="space-y-12 experience-timeline">
            <div className="experience-item">
              <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full -left-[9px] top-0 border-2 border-white shadow-lg"></div>
              <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{t('fullstack_dev')}</h3>
              <p className="text-gray-300 mb-2 font-medium">{t('fullstack_period')}</p>
              <p className="text-gray-400 leading-relaxed">{t('fullstack_description')}</p>
            </div>
            <div className="experience-item">
              <div className="absolute w-4 h-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full -left-[9px] top-0 border-2 border-white shadow-lg"></div>
              <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">{t('backend_dev')}</h3>
              <p className="text-gray-300 mb-2 font-medium">{t('backend_period')}</p>
              <p className="text-gray-400 leading-relaxed">{t('backend_description')}</p>
            </div>
            <div className="experience-item">
              <div className="absolute w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full -left-[9px] top-0 border-2 border-white shadow-lg"></div>
              <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('frontend_dev')}</h3>
              <p className="text-gray-300 mb-2 font-medium">{t('frontend_period')}</p>
              <p className="text-gray-400 leading-relaxed">{t('frontend_description')}</p>
            </div>
            <div className="experience-item">
              <div className="absolute w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full -left-[9px] top-0 border-2 border-white shadow-lg"></div>
              <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{t('frontend_it_element_dev')}</h3>
              <p className="text-gray-300 mb-2 font-medium">{t('frontend_it_element_period')}</p>
              <p className="text-gray-400 leading-relaxed">{t('frontend_it_element_description')}</p>
            </div>
          </div>
        </div>
      </section>

             {/* Skills Section */}
       <section 
         className="py-12 sm:py-20 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-white skills-section relative overflow-hidden" 
         style={{ opacity: 0, animation: 'fadeInUp 1s ease-out 0.5s forwards' }}
       >
         
         {/* Анимированный текст "пересобирай" */}
         {hoveredSkill && (
           <div className="rebuild-text">
             <div className="rebuild-text-content">
               <span className="rebuild-letter">п</span>
               <span className="rebuild-letter">е</span>
               <span className="rebuild-letter">р</span>
               <span className="rebuild-letter">е</span>
               <span className="rebuild-letter">с</span>
               <span className="rebuild-letter">о</span>
               <span className="rebuild-letter">б</span>
               <span className="rebuild-letter">и</span>
               <span className="rebuild-letter">р</span>
               <span className="rebuild-letter">а</span>
               <span className="rebuild-letter">й</span>
             </div>
           </div>
         )}

        <div className="max-w-6xl mx-auto">
                     <div className="flex items-center gap-3 mb-8 sm:mb-12">
             <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
               <Code size={24} className="text-white sm:w-7 sm:h-7" />
             </div>
             <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">{t('skills')}</h2>
           </div>
          <div className="space-y-12">
            {Object.entries(skillCategories).map(([categoryKey, category], categoryIndex) => (
              <div key={categoryKey} className="skill-category" style={{ animationDelay: `${categoryIndex * 200}ms` }}>
                {/* Заголовок категории */}
                <div className="skill-category-header">
                  <h3 className="skill-category-title">{category.title}</h3>
                  <div className="skill-category-divider"></div>
                </div>
                
                {/* Сетка навыков */}
                <div className="skills-grid">
                  {category.skills.map((skill, skillIndex) => (
                    <div 
                      key={skill.name} 
                      className={`skill-card ${hoveredSkill === skill.name ? 'skill-hovered' : ''}`}
                      style={{
                        animationDelay: `${(categoryIndex * 200) + (skillIndex * 100)}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      onMouseEnter={() => handleSkillHover(skill.name)}
                    >
                      <div className="skill-card-content">
                        <h4 className="skill-name mb-4">{skill.name}</h4>
                        
                        <p className="skill-description mb-4">{skill.description}</p>
                        
                        <div className="skill-tags">
                          {skill.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="skill-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
          </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
       <section className="py-12 sm:py-20 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white education-section">
        <div className="max-w-4xl mx-auto">
                     <div className="flex items-center gap-3 mb-8 sm:mb-12">
             <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
               <GraduationCap size={24} className="text-white sm:w-7 sm:h-7" />
             </div>
             <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{t('education')}</h2>
          </div>
          <div className="experience-item">
            <div className="absolute w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full -left-[10px] top-0 border-3 border-white shadow-xl"></div>
            <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{t('engineer')}</h3>
            <p className="text-gray-300 mb-2 font-medium text-lg">{t('university')}</p>
            <p className="text-gray-400 leading-relaxed">{t('degree')}</p>
          </div>
        </div>
      </section>

      {/* Ping Pong Game Section */}
      <PingPongGame language={language} />

      {/* Footer */}
         <footer className="py-12 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-200">
           <div className="max-w-4xl mx-auto">
             {/* Социальные сети и ссылки */}
             <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-8">
               {/* Социальные иконки */}
               <div className="flex items-center gap-3">
                 <a 
                   href="https://github.com/Spoon221" 
                   className="social-link github-link"
                   aria-label="GitHub Profile"
                 >
                   <Github size={20} />
                 </a>
                 <a 
                   href="https://www.linkedin.com/in/евгений-симаков-7680b0345/" 
                   className="social-link linkedin-link"
                   aria-label="LinkedIn Profile"
                 >
                   <Linkedin size={20} />
                 </a>
                 <a 
                   href="mailto:simakov.jenja@gmail.com" 
                   className="social-link email-link"
                   aria-label="Send Email"
                 >
                   <Mail size={20} />
                 </a>
               </div>
               
               {/* Разделитель */}
               <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
               
               {/* Навигационные ссылки */}
               <div className="flex items-center gap-3">
                 <a 
                   href="https://simakovevgeny.vercel.app/" 
                   className="nav-link"
                   target="_blank"
                   rel="noopener noreferrer"
                 >
                   {t('projects')}
                 </a>
                 <a 
                   href="https://disk.yandex.ru/i/k-RgCLyiC-N4Ew" 
                   className="resume-link"
                   target="_blank" 
                   rel="noopener noreferrer"
                 >
                   <span className="resume-icon">📄</span>
                   <span className="resume-text">{t('download_resume')}</span>
                 </a>
               </div>
             </div>
             
             {/* Copyright */}
             <div className="text-center">
               <p className="text-gray-500 text-sm">{t('copyright')}</p>
          </div>
        </div>
         </footer>
    </div>
  );
}

export default App;