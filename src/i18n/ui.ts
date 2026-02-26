export const languages = {
  es: "Español",
  en: "English",
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = "es";

export const ui = {
  es: {
    // Meta
    "meta.description":
      "Equipo de IA especializado en soluciones inteligentes. Conoce nuestras habilidades, proyectos y servicios.",

    // Nav & Footer
    "nav.home": "Inicio",
    "nav.backToHome": "Volver al inicio",
    "footer.rights": "Todos los derechos reservados.",

    // Hero Landing
    "hero.badge": "Soluciones de IA a medida",
    "hero.line1": "Construimos",
    "hero.line2": "Inteligencia Artificial",
    "hero.line3": "que transforma negocios",
    "hero.subtitle":
      "Somos un equipo especializado en diseño, desarrollo e integración de soluciones basadas en IA. Desde chatbots inteligentes hasta pipelines RAG y agentes autónomos.",
    "hero.cta.services": "Conoce nuestros servicios",
    "hero.cta.team": "Conoce al equipo",
    "hero.tech.agents": "Agentes Autónomos",

    // Team Section
    "team.label": "Nuestro equipo",
    "team.title": "Conoce a los expertos",
    "team.subtitle":
      "Un equipo comprometido con la excelencia en inteligencia artificial y desarrollo de software.",
    "team.viewPortfolio": "Ver portfolio",
    "team.jonathan.summary":
      "Especialista en agentes inteligentes, LangGraph y arquitecturas RAG.",
    "team.pablo.summary":
      "Desarrollo full-stack con foco en integración de modelos de IA y pipelines de datos.",

    // Services Section
    "services.label": "Servicios",
    "services.title": "Lo que podemos hacer por ti",
    "services.subtitle":
      "Soluciones end-to-end en inteligencia artificial, desde la idea hasta producción.",
    "services.chatbots.title": "Chatbots Inteligentes",
    "services.chatbots.description":
      "Asistentes conversacionales con IA generativa, integrados en web, WhatsApp o plataformas empresariales.",
    "services.rag.title": "Sistemas RAG",
    "services.rag.description":
      "Búsqueda semántica y generación aumentada por recuperación sobre tus propios datos y documentos.",
    "services.agents.title": "Agentes Autónomos",
    "services.agents.description":
      "Agentes multi-paso con LangGraph que razonan, planifican y ejecutan tareas complejas.",
    "services.pipelines.title": "Pipelines de Datos",
    "services.pipelines.description":
      "ETL inteligente, procesamiento de documentos y flujos de datos con integración de modelos ML/IA.",
    "services.apis.title": "Integración de APIs IA",
    "services.apis.description":
      "Conexión con OpenAI, Anthropic, Google y modelos open-source para tus aplicaciones.",
    "services.consulting.title": "Consultoría IA",
    "services.consulting.description":
      "Evaluación, diseño de arquitectura y estrategia de adopción de IA para tu empresa.",

    // Portfolio Hero
    "portfolio.hero.nameFallback": "Nombre del Developer",
    "portfolio.hero.roleFallback": "Rol profesional",
    "portfolio.hero.bioFallback": "Breve descripción profesional del developer.",

    // Portfolio Sections
    "portfolio.experience": "Experiencia",
    "portfolio.projects": "Proyectos",
    "portfolio.projects.code": "Código",
    "portfolio.stack": "Stack Tecnológico",
    "portfolio.stack.languages": "Lenguajes",
    "portfolio.stack.frameworks": "Frameworks",
    "portfolio.stack.tools": "Herramientas",

    // Chat Widget
    "chat.scopeGlobal": "Equipo",
    "chat.greeting": "¡Hola! ¿En qué puedo ayudarte?",
    "chat.greetingHint":
      "Pregúntame sobre nuestras habilidades, proyectos y servicios.",
    "chat.deleteConfirm": "¿Borrar la conversación?",
    "chat.cancel": "Cancelar",
    "chat.delete": "Borrar",
    "chat.ariaOpen": "Abrir chat",
    "chat.ariaClose": "Cerrar chat",
    "chat.ariaDelete": "Borrar conversación",
    "chat.limitReached": "Has alcanzado el límite diario de mensajes.",
    "chat.deleted": "Conversación borrada correctamente.",
    "chat.deleteError": "No se pudo borrar la conversación.",

    // Chat Input
    "chat.input.limitReached": "Límite diario alcanzado",
    "chat.input.placeholder": "Escribe tu mensaje...",
    "chat.input.ariaSend": "Enviar mensaje",

    // Suggestions
    "suggestions.global.1": "¿Qué servicios de IA ofrecen?",
    "suggestions.global.2": "¿Cuál es su experiencia con LLMs?",
    "suggestions.global.3": "¿Han trabajado con sistemas RAG?",
    "suggestions.global.4": "¿Cómo puedo contactarlos?",
    "suggestions.developer.1": "¿Cuáles son tus habilidades principales?",
    "suggestions.developer.2": "¿Qué proyectos de IA has desarrollado?",
    "suggestions.developer.3": "¿Con qué tecnologías trabajas?",
    "suggestions.developer.4": "Cuéntame sobre tu experiencia",

    // Theme Toggle
    "theme.switchTo": "Cambiar a modo",
    "theme.light": "claro",
    "theme.dark": "oscuro",
  },
  en: {
    // Meta
    "meta.description":
      "AI-specialized team building intelligent solutions. Discover our skills, projects, and services.",

    // Nav & Footer
    "nav.home": "Home",
    "nav.backToHome": "Back to home",
    "footer.rights": "All rights reserved.",

    // Hero Landing
    "hero.badge": "Custom AI Solutions",
    "hero.line1": "We Build",
    "hero.line2": "Artificial Intelligence",
    "hero.line3": "that transforms businesses",
    "hero.subtitle":
      "We are a team specialized in designing, developing, and integrating AI-based solutions. From intelligent chatbots to RAG pipelines and autonomous agents.",
    "hero.cta.services": "Explore our services",
    "hero.cta.team": "Meet the team",
    "hero.tech.agents": "Autonomous Agents",

    // Team Section
    "team.label": "Our team",
    "team.title": "Meet the experts",
    "team.subtitle":
      "A team committed to excellence in artificial intelligence and software development.",
    "team.viewPortfolio": "View portfolio",
    "team.jonathan.summary":
      "Specialist in intelligent agents, LangGraph, and RAG architectures.",
    "team.pablo.summary":
      "Full-stack development focused on AI model integration and data pipelines.",

    // Services Section
    "services.label": "Services",
    "services.title": "What we can do for you",
    "services.subtitle":
      "End-to-end artificial intelligence solutions, from idea to production.",
    "services.chatbots.title": "Intelligent Chatbots",
    "services.chatbots.description":
      "Conversational assistants powered by generative AI, integrated into web, WhatsApp, or enterprise platforms.",
    "services.rag.title": "RAG Systems",
    "services.rag.description":
      "Semantic search and retrieval-augmented generation over your own data and documents.",
    "services.agents.title": "Autonomous Agents",
    "services.agents.description":
      "Multi-step agents with LangGraph that reason, plan, and execute complex tasks.",
    "services.pipelines.title": "Data Pipelines",
    "services.pipelines.description":
      "Intelligent ETL, document processing, and data flows with ML/AI model integration.",
    "services.apis.title": "AI API Integration",
    "services.apis.description":
      "Connection with OpenAI, Anthropic, Google, and open-source models for your applications.",
    "services.consulting.title": "AI Consulting",
    "services.consulting.description":
      "Evaluation, architecture design, and AI adoption strategy for your company.",

    // Portfolio Hero
    "portfolio.hero.nameFallback": "Developer Name",
    "portfolio.hero.roleFallback": "Professional role",
    "portfolio.hero.bioFallback": "Brief professional description of the developer.",

    // Portfolio Sections
    "portfolio.experience": "Experience",
    "portfolio.projects": "Projects",
    "portfolio.projects.code": "Code",
    "portfolio.stack": "Tech Stack",
    "portfolio.stack.languages": "Languages",
    "portfolio.stack.frameworks": "Frameworks",
    "portfolio.stack.tools": "Tools",

    // Chat Widget
    "chat.scopeGlobal": "Team",
    "chat.greeting": "Hi! How can I help you?",
    "chat.greetingHint":
      "Ask me about our skills, projects, and services.",
    "chat.deleteConfirm": "Delete the conversation?",
    "chat.cancel": "Cancel",
    "chat.delete": "Delete",
    "chat.ariaOpen": "Open chat",
    "chat.ariaClose": "Close chat",
    "chat.ariaDelete": "Delete conversation",
    "chat.limitReached": "You have reached the daily message limit.",
    "chat.deleted": "Conversation deleted successfully.",
    "chat.deleteError": "Could not delete the conversation.",

    // Chat Input
    "chat.input.limitReached": "Daily limit reached",
    "chat.input.placeholder": "Type your message...",
    "chat.input.ariaSend": "Send message",

    // Suggestions
    "suggestions.global.1": "What AI services do you offer?",
    "suggestions.global.2": "What is your experience with LLMs?",
    "suggestions.global.3": "Have you worked with RAG systems?",
    "suggestions.global.4": "How can I contact you?",
    "suggestions.developer.1": "What are your main skills?",
    "suggestions.developer.2": "What AI projects have you developed?",
    "suggestions.developer.3": "What technologies do you work with?",
    "suggestions.developer.4": "Tell me about your experience",

    // Theme Toggle
    "theme.switchTo": "Switch to",
    "theme.light": "light",
    "theme.dark": "dark",
  },
} as const;

export type TranslationKey = keyof (typeof ui)[typeof defaultLang];
