/**
 * ABDUL QUDOOS SALL — PROFESSIONAL CIVIL ENGINEER PORTFOLIO
 * Vanilla JavaScript (ES6+) — Core Interactive Features
 * 
 * Features:
 * 1. Sticky Header & Scroll Elevation
 * 2. Mobile Navigation Drawer & Accessibility
 * 3. Active Link State Automation
 * 4. Project Category Filtering System
 * 5. Animated Number Counters for Statistics
 * 6. Scroll Reveal Observer for Elements
 * 7. Case Study Modal Viewer
 * 8. Contact Form Live Validation & Accessible Submission Alerts
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Sticky Header & Elevation
     ========================================================================== */
  const siteHeader = document.querySelector('.site-header');

  const handleHeaderScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('nav-scrolled');
    } else {
      siteHeader.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ==========================================================================
     2. Mobile Navigation Drawer & Hamburger Toggle
     ========================================================================== */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileToggle && mainNav) {
    const toggleMenu = (forceClose = false) => {
      const isOpen = forceClose ? false : !mainNav.classList.contains('is-open');
      
      if (isOpen) {
        mainNav.classList.add('is-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileToggle.setAttribute('aria-label', 'Close navigation menu');
        // Render Close (X) SVG
        mobileToggle.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
        document.body.style.overflow = 'hidden';
      } else {
        mainNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation menu');
        // Render Hamburger SVG
        mobileToggle.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
        document.body.style.overflow = '';
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking on any nav link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleMenu(true);
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(true);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        toggleMenu(true);
        mobileToggle.focus();
      }
    });
  }

  /* ==========================================================================
     3. Active Navigation Link Highlighting
     ========================================================================== */
  const highlightActiveLink = () => {
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath === '') currentPath = 'index.html';

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPath = href.split('/').pop();
        if (linkPath === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      }
    });
  };

  highlightActiveLink();

  /* ==========================================================================
     4. Project Category Filtering System
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterButtons.length > 0 && projectItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter') || 'all';

        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter projects
        projectItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('is-hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 30);
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* ==========================================================================
     5. Animated Number Counters for Statistics
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const targetStr = el.getAttribute('data-target');
      if (!targetStr) return;

      const target = parseInt(targetStr, 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const padZero = el.hasAttribute('data-pad-zero');

      let current = 0;
      const duration = 1400; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quadratic
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        current = Math.floor(easeProgress * target);

        let formatted = current.toString();
        if (padZero && current < 10) {
          formatted = '0' + formatted;
        }

        el.innerHTML = `${prefix}${formatted}<span class="stat-accent">${suffix}</span>`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          let finalFormatted = target.toString();
          if (padZero && target < 10) {
            finalFormatted = '0' + finalFormatted;
          }
          el.innerHTML = `${prefix}${finalFormatted}<span class="stat-accent">${suffix}</span>`;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });
  }

  /* ==========================================================================
     6. Scroll Reveal Observer for Elements
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-fade');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     6b. Three Services Showcase Staggered Entrance Observer
     ========================================================================== */
  const serviceCards = document.querySelectorAll('.service-card');

  if (serviceCards.length > 0 && 'IntersectionObserver' in window) {
    const servicesObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    serviceCards.forEach(card => servicesObserver.observe(card));
  } else {
    serviceCards.forEach(card => card.classList.add('is-visible'));
  }

  /* ==========================================================================
     7. Case Study Modal Viewer
     ========================================================================== */
  const caseStudyData = {
    'riverside-commercial': {
      title: 'Riverside Commercial Complex',
      category: 'Structural Engineering',
      year: '2025',
      location: 'Freetown, Sierra Leone',
      image: 'images/projects/project-commercial.jpg',
      tools: ['AutoCAD', 'ETABS', 'SAP2000', 'Revit'],
      overview: 'A multi-storey commercial development requiring comprehensive structural analysis, frame modeling, and design coordination. The engineering scope included reinforced concrete framed systems, multi-bay lateral stability analysis, and deep foundation detailing.',
      role: 'Structural Design Support — assisted senior engineers with computational structural modeling, dead and live load assessments, shear wall placement, and construction drawing production.',
      challenge: 'The coastal urban site featured variable soil bearing capacity and adjacent existing structures, mandating strict settlement tolerances and optimized column sizing for commercial tenant flexibility.',
      approach: 'Conducted rigorous load combinations under BS 8110 / Eurocode 2 standards, created full 3D finite element structural frames in ETABS, coordinated geotechnical borehole data with mat and isolated footing designs, and issued clash-checked CAD drawings.',
      solution: 'Engineered a ductile reinforced concrete moment frame combined with strategically positioned elevator shear cores to mitigate lateral wind shears, reducing structural concrete volume while maintaining safety margins.',
      outcome: 'Successfully produced permit-ready structural documentation and reinforcement bar bending schedules, facilitating timely regulatory approval and efficient construction layout.'
    },
    'urban-road': {
      title: 'Urban Road Rehabilitation',
      category: 'Transportation Engineering',
      year: '2024',
      location: 'Freetown, Sierra Leone',
      image: 'images/projects/project-transportation.jpg',
      tools: ['AutoCAD', 'Civil 3D', 'SketchUp'],
      overview: 'An urban road renewal initiative addressing heavy pavement degradation, poor roadside drainage, and severe erosion along a major urban commuter corridor during tropical rainy seasons.',
      role: 'Engineering Assistant — assisted with field topography surveys, cross-sectional roadway alignments, stormwater runoff calculations, and quantity take-offs.',
      challenge: 'High tropical rainfall intensity caused recurring roadway flooding and base failure, while heavy traffic volumes required a phased construction strategy to prevent complete corridor shutdown.',
      approach: 'Mapped catchment hydrology, evaluated existing culvert capacities, designed trapezoidal stone-pitched stormwater side drains, and prepared horizontal and vertical roadway geometric alignments in Civil 3D.',
      solution: 'Specified an upgraded crushed stone base course with asphaltic concrete surfacing, supplemented by precast concrete culvert crossings and energy-dissipating outfall structures.',
      outcome: 'Delivered an executable rehabilitation drawing set with clear construction staging notes, significantly reducing projected localized flood risks and enhancing vehicular transit safety.'
    },
    'modern-residential': {
      title: 'Modern Residential Development',
      category: 'Structural Design',
      year: '2024',
      location: 'Sierra Leone',
      image: 'images/projects/project-residential.jpg',
      tools: ['AutoCAD', 'STAAD.Pro', 'Revit', 'SketchUp'],
      overview: 'Structural design and technical detailing for an upscale multi-unit residential housing community, emphasizing architectural elegance, open-span living spaces, and natural ventilation integration.',
      role: 'Structural Documentation — modeled framing systems, analyzed two-way slab deflection criteria, detailed reinforced concrete staircases, and prepared comprehensive structural layouts.',
      challenge: 'Achieving expansive column-free living areas while maintaining cost-effective concrete member dimensions and complying with local seismic and wind exposure guidelines.',
      approach: 'Employed high-performance continuous beam designs and two-way reinforced concrete slab systems, ensuring that structural depths aligned flush with interior architectural ceiling drops.',
      solution: 'Developed standardized reinforcement schedules and modular beam-column connection details that simplified rebar fabrication on-site and accelerated formwork cycling.',
      outcome: 'Full structural submission drawings approved with zero contractor RFIs regarding rebar congestion, enabling smooth on-schedule structural framing.'
    },
    'stormwater-drainage': {
      title: 'Municipal Stormwater & Drainage Upgrade',
      category: 'Water & Environmental Engineering',
      year: '2024',
      location: 'Freetown, Sierra Leone',
      image: 'images/projects/project-drainage.jpg',
      tools: ['Civil 3D', 'AutoCAD', 'EPA SWMM', 'Hydraulic Modeling'],
      overview: 'Comprehensive stormwater management project designed to eliminate flash-flood hazards in a dense municipal sector, including retention basins, channel grading, and culvert resizing.',
      role: 'Technical Contributor — performed watershed runoff estimations using the Rational Method, prepared longitudinal drain profiles, and drafted culvert structural reinforcements.',
      challenge: 'High sediment transport during peak monsoon storms threatened to silt up drainage channels, demanding self-cleansing hydraulic gradients within a confined public right-of-way.',
      approach: 'Calculated 10-year and 25-year flood return hydrographs, graded channel bed slopes for optimum velocity, and designed silt-trap sediment catchpits at critical confluence points.',
      solution: 'Engineered reinforced concrete U-box culverts with removable maintenance covers and rip-rap protected outfall dissipators.',
      outcome: 'Provided municipal authorities with a comprehensive drainage master plan that effectively mitigates downstream community flooding.'
    },
    'geotechnical-slope': {
      title: 'Hillside Foundation & Slope Stabilization',
      category: 'Geotechnical Engineering',
      year: '2023',
      location: 'Western Area, Sierra Leone',
      image: 'images/projects/project-geotechnical.jpg',
      tools: ['GEO5', 'AutoCAD', 'Soil Mechanics Analysis', 'MS Excel'],
      overview: 'Geotechnical site investigation and slope stabilization design for hillside infrastructure constructed on weathered granitic terrain prone to slope creep and rainfall saturation.',
      role: 'Site Support & Analysis — collected soil sample data, plotted borehole logs, evaluated soil shear parameters (c and phi), and prepared slope reinforcement cross-sections.',
      challenge: 'Steep natural grades and deep tropical weathering profiles presented severe slip-circle failure risks under heavy monsoon soil saturation.',
      approach: 'Calculated factor-of-safety margins under dry and fully saturated conditions, evaluated gravity vs. stepped reinforced concrete retaining wall configurations, and specified subsurface weep drainage.',
      solution: 'Designed a tiered reinforced concrete retaining wall system anchored with sub-horizontal perforated PVC drain pipes to relieve hydrostatic pressure behind the wall face.',
      outcome: 'Eliminated landslide vulnerability, protecting adjacent building foundations and establishing a stable platform for subsequent civil development.'
    },
    'cad-drafting-bim': {
      title: 'High-Precision Structural CAD Drafting & Detailing',
      category: 'Engineering Design & CAD',
      year: '2023',
      location: 'Freetown, Sierra Leone',
      image: 'images/projects/project-drafting.jpg',
      tools: ['AutoCAD', 'Revit', 'BIM 360', 'Standard CAD Layers'],
      overview: 'Multi-disciplinary technical drafting and BIM modeling package for complex civil structures, establishing standardized layer hierarchies, drawing templates, and bar bending schedules.',
      role: 'Lead CAD Drafter / Modeler — authored 2D production drawings, 3D structural wireframes, rebar callouts, and coordinated MEP penetrations through concrete structural elements.',
      challenge: 'Multiple design revisions from architectural and mechanical disciplines required strict version control and zero tolerance for structural drawing discrepancies.',
      approach: 'Implemented standard ISO/BS CAD layering protocols, automated dynamic rebar blocks, and developed cross-sectional details with explicit dimensioning.',
      solution: 'Delivered an integrated set of general arrangement (GA) drawings, foundation layouts, rebar schedules, and structural framing plans with standardized title blocks.',
      outcome: 'Achieved complete clarity for on-site construction trades, drastically cutting fabrication errors and verifying 100% drawing compliance.'
    }
  };

  const modalBackdrop = document.querySelector('#case-study-modal');
  const modalContainer = modalBackdrop ? modalBackdrop.querySelector('.modal-container') : null;
  const modalBody = modalBackdrop ? modalBackdrop.querySelector('.modal-body') : null;
  const modalCloseBtn = modalBackdrop ? modalBackdrop.querySelector('.modal-close-btn') : null;

  const openCaseStudy = (projectId) => {
    const data = caseStudyData[projectId];
    if (!data || !modalBody || !modalBackdrop) return;

    modalBody.innerHTML = `
      <div class="case-study-header-modal">
        <span class="label-technical gold-text">${data.category}</span>
        <h2 style="font-size: clamp(1.6rem, 3vw, 2.2rem); margin: 0.5rem 0 1.25rem 0;">${data.title}</h2>
        <div class="case-study-meta-bar" style="margin-top: 0; margin-bottom: 2rem;">
          <div class="meta-bar-item">
            <span class="meta-bar-label">Discipline</span>
            <span class="meta-bar-val">${data.category}</span>
          </div>
          <div class="meta-bar-item">
            <span class="meta-bar-label">Year</span>
            <span class="meta-bar-val">${data.year}</span>
          </div>
          <div class="meta-bar-item">
            <span class="meta-bar-label">Location</span>
            <span class="meta-bar-val">${data.location}</span>
          </div>
          <div class="meta-bar-item">
            <span class="meta-bar-label">Status</span>
            <span class="meta-bar-val" style="color: var(--color-success); font-weight: 700;">Completed & Verified</span>
          </div>
        </div>
      </div>

      <div class="case-study-main-image" style="margin: 1.5rem 0 2rem 0; max-height: 380px;">
        <img src="${data.image}" alt="${data.title}" style="height: 360px; object-fit: cover; width: 100%; border-radius: var(--radius-md);">
      </div>

      <div class="case-study-content-grid">
        <div class="case-study-main-text">
          <div class="case-study-section-block">
            <h3>Project Overview</h3>
            <p>${data.overview}</p>
          </div>

          <div class="case-study-section-block">
            <h3>Engineering Role & Scope</h3>
            <p>${data.role}</p>
          </div>

          <div class="case-study-section-block">
            <h3>Key Technical Challenge</h3>
            <p>${data.challenge}</p>
          </div>

          <div class="case-study-section-block">
            <h3>Engineering Approach & Methodology</h3>
            <p>${data.approach}</p>
          </div>

          <div class="case-study-section-block">
            <h3>Technical Solution</h3>
            <p>${data.solution}</p>
          </div>

          <div class="case-study-section-block">
            <h3>Deliverables & Verified Outcome</h3>
            <p>${data.outcome}</p>
          </div>
        </div>

        <div class="case-study-sidebar">
          <div class="sidebar-box">
            <h4>Engineering Software & Tools</h4>
            <div class="tools-pill-list">
              ${data.tools.map(t => `<span class="tool-pill">${t}</span>`).join('')}
            </div>
          </div>

          <div class="sidebar-box" style="background-color: var(--color-bg-offwhite);">
            <h4>Standards & Codes</h4>
            <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.6;">
              <li>BS 8110 / Eurocode 2 (Structures)</li>
              <li>AASHTO / Local Highway Standards</li>
              <li>British Standard BS 5930 (Site Investigation)</li>
              <li>OSHA Health & Site Safety Codes</li>
            </ul>
          </div>

          <div class="sidebar-box">
            <h4>Inquiries Regarding This Project</h4>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 1rem;">Interested in technical documentation or drawings for similar work?</p>
            <a href="contact.html" class="btn btn-primary btn-sm" style="width: 100%;">Discuss Project Requirements</a>
          </div>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    modalBackdrop.focus();
  };

  const closeCaseStudy = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  // Attach modal trigger listeners
  const caseStudyTriggers = document.querySelectorAll('[data-case-study-trigger]');
  caseStudyTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-case-study-trigger');
      openCaseStudy(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCaseStudy);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeCaseStudy();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('is-active')) {
        closeCaseStudy();
      }
    });
  }

  /* ==========================================================================
     8. Contact Form Live Validation & Accessible Submission Alerts
     ========================================================================== */
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    const nameInput = document.querySelector('#contact-name');
    const emailInput = document.querySelector('#contact-email');
    const subjectInput = document.querySelector('#contact-subject');
    const messageInput = document.querySelector('#contact-message');
    const statusAlert = document.querySelector('#form-status-alert');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Validation patterns & rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (field, isValid) => {
      if (isValid) {
        field.classList.remove('is-invalid');
        field.setAttribute('aria-invalid', 'false');
      } else {
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
      }
      return isValid;
    };

    const checkName = () => {
      if (!nameInput) return true;
      const isValid = nameInput.value.trim().length >= 2;
      return validateField(nameInput, isValid);
    };

    const checkEmail = () => {
      if (!emailInput) return true;
      const val = emailInput.value.trim();
      const isValid = val.length > 0 && emailRegex.test(val);
      return validateField(emailInput, isValid);
    };

    const checkSubject = () => {
      if (!subjectInput) return true;
      const isValid = subjectInput.value.trim().length >= 3;
      return validateField(subjectInput, isValid);
    };

    const checkMessage = () => {
      if (!messageInput) return true;
      const isValid = messageInput.value.trim().length >= 10;
      return validateField(messageInput, isValid);
    };

    // Live validation on blur
    if (nameInput) nameInput.addEventListener('blur', checkName);
    if (emailInput) emailInput.addEventListener('blur', checkEmail);
    if (subjectInput) subjectInput.addEventListener('blur', checkSubject);
    if (messageInput) messageInput.addEventListener('blur', checkMessage);

    // Form submit handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = checkName();
      const isEmailValid = checkEmail();
      const isSubjectValid = checkSubject();
      const isMessageValid = checkMessage();

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (!isFormValid) {
        if (statusAlert) {
          statusAlert.className = 'form-status-alert error';
          statusAlert.innerHTML = `
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Validation Error:</strong> Please review and correct the marked fields before submitting.
            </div>
          `;
          statusAlert.style.display = 'flex';
          statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Focus first invalid element
        if (!isNameValid && nameInput) nameInput.focus();
        else if (!isEmailValid && emailInput) emailInput.focus();
        else if (!isSubjectValid && subjectInput) subjectInput.focus();
        else if (!isMessageValid && messageInput) messageInput.focus();

        return;
      }

      // Valid state: simulate transmission feedback
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        Transmitting Message...
      `;

      setTimeout(() => {
        const clientName = nameInput.value.trim();
        contactForm.reset();

        // Remove invalid classes
        [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
          if (inp) inp.classList.remove('is-invalid');
        });

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (statusAlert) {
          statusAlert.className = 'form-status-alert success';
          statusAlert.innerHTML = `
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
              <strong>Message Sent Successfully!</strong> Thank you, ${clientName}. Your inquiry has been documented. Abdul Qudoos Sall will review your project details and reply promptly.
            </div>
          `;
          statusAlert.style.display = 'flex';
          statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 750);
    });
  }
});
