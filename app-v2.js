/**
 * app-v2.js - Interactividad Liquid Glass, Galería de 3 Apartados y Envío AJAX a contacto-v2.php
 */

document.addEventListener('DOMContentLoaded', () => {
  // Año dinámico en footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =========================================================
     1. EFECTO ESPECULAR LIQUID GLASS (Seguimiento de Luz)
     ========================================================= */
  const liquidCards = document.querySelectorAll('.liquid-card');
  liquidCards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* =========================================================
     2. NAVEGACIÓN FLOTANTE CON INDICADOR LÍQUIDO DESLIZANTE
     ========================================================= */
  const navLinksContainer = document.getElementById('navLinks');
  const navIndicator = document.getElementById('navIndicator');
  const navAnchors = document.querySelectorAll('.nav-links a[data-section]');
  const mobileToggle = document.getElementById('mobileToggle');
  const sections = document.querySelectorAll('main section[id]');

  function moveNavIndicator(activeLink) {
    if (!activeLink || !navIndicator || window.innerWidth <= 760) return;
    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = navLinksContainer.getBoundingClientRect();
    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.left = `${linkRect.left - containerRect.left}px`;
  }

  // Posicionar indicador al cargar
  const initialActive = document.querySelector('.nav-links a.active');
  if (initialActive) {
    setTimeout(() => moveNavIndicator(initialActive), 80);
  }

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav-links a.active');
    moveNavIndicator(currentActive);
  });

  // Menú móvil
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
    });

    navAnchors.forEach((anchor) => {
      anchor.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // Detectar sección visible al hacer scroll
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach((link) => {
            const isMatch = link.getAttribute('data-section') === id;
            link.classList.toggle('active', isMatch);
            if (isMatch) moveNavIndicator(link);
          });
        }
      });
    },
    { rootMargin: '-38% 0px -52% 0px', threshold: 0.05 }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));

  /* =========================================================
     3. ANIMACIONES DE APARICIÓN (SCROLL REVEAL)
     ========================================================= */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* =========================================================
     4. FILTRADO DE GALERÍA (3 APARTADOS) Y MODAL LIGHTBOX
     ========================================================= */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden-item');
        } else {
          item.classList.add('hidden-item');
        }
      });
    });
  });

  // EDITA AQUÍ EL DETALLE DE TUS PROYECTOS PARA EL MODAL LIGHTBOX
  const projectsData = [
    {
      category: 'Python',
      title: 'Juego buscaminas recreado con python',
      description:
        'Proyecto académico en colaboración con compañeros para la nota final del curso Fundamentos de programación.',
      tags: [, 'Python', 'Responsive'],
      url: 'https://github.com/Fabrix-11/Buscaminas_Python'
    },
    {
      category: 'Desarrollo Web',
      title: 'Atelier Coffee',
      description:
        'Desarrollo de Página web completa en colaboración para gestión de una cafetería, productos y cobro.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'BOOSTRAP'],
      url: 'https://cafeteria-atelier.netlify.app/'
    },
    {
      category: 'Sistema & Base de Datos',
      title: 'Proximamente...',
      description:
        'Proyecto en desarrollo.',
      tags: ['JS', 'UX Research', 'XAMPP', 'Design System', 'POO', 'MySQL' ],
    },
    {
      category: 'Desarrollo Web',
      title: 'E-Commerce & Vitrina Digital',
      description:
        'Tienda virtual con buscador instantáneo, filtrado por categorías, vista rápida de productos y cierre de pedidos integrado.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'E-Commerce', 'UX']
    },
    {
      category: 'Sistemas & Apps',
      title: 'Sistema Web de Citas & Agenda',
      description:
        'Plataforma de reservas online con validación de disponibilidad horaria, panel de administración y confirmación automática.',
      tags: ['PHP', 'MySQL', 'APIs', 'Automatización']
    },
    {
      category: 'Diseño UI/UX',
      title: 'Interfaz Móvil Estilo Glassmorphism',
      description:
        'Diseño de experiencia móvil con tarjetas translúcidas, navegación intuitiva y microinteracciones fluidas.',
      tags: ['Mobile UI', 'Glassmorphism', 'Wireframes', 'Interacción']
    }
  ];

  const modal = document.getElementById('galleryModal');
  const modalClose = document.getElementById('modalClose');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalTags = document.getElementById('modalTags');
  const modalQuoteBtn = document.getElementById('modalQuoteBtn');
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');

  let currentProjectIndex = 0;

  function openProjectModal(index) {
    currentProjectIndex = (index + projectsData.length) % projectsData.length;
    const project = projectsData[currentProjectIndex];
    if (!project || !modal) return;

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalTags.innerHTML = project.tags.map((t) => `<span class="chip">${t}</span>`).join('');

    if (modalQuoteBtn) {
    modalQuoteBtn.href = project.url || '#';
  }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index') || '0', 10);
      openProjectModal(idx);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalQuoteBtn) modalQuoteBtn.addEventListener('click', closeProjectModal);
  if (prevBtn) prevBtn.addEventListener('click', () => openProjectModal(currentProjectIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => openProjectModal(currentProjectIndex + 1));

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeProjectModal();
    if (e.key === 'ArrowLeft') openProjectModal(currentProjectIndex - 1);
    if (e.key === 'ArrowRight') openProjectModal(currentProjectIndex + 1);
  });

  /* =========================================================
     5. FORMULARIO DE CONTACTO ASÍNCRONO (AJAX -> contacto-v2.php)
     ========================================================= */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const email = document.getElementById('email').value.trim();
      const consulta = document.getElementById('consulta').value.trim();

      if (!nombre || !telefono || !email || !consulta) {
        showStatus('Por favor, completa todos los campos obligatorios (*).', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Por favor, ingresa un correo electrónico válido.', 'error');
        return;
      }

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando mensaje...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('contacto-v2.php', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showStatus(data.message || '¡Tu mensaje ha sido enviado con éxito! Te responderé pronto.', 'success');
          contactForm.reset();
        } else {
          showStatus(data.message || 'No se pudo procesar el envío. Inténtalo nuevamente.', 'error');
        }
      } catch (error) {
        showStatus(
          'Nota: Para procesar contacto-v2.php ejecuta el proyecto en un servidor PHP (XAMPP, Laragon o php -S localhost:8000).',
          'error'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }
});
