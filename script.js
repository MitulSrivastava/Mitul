document.addEventListener("DOMContentLoaded", () => {
  
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // ==================== Navbar Scroll Styling ====================
  const navContainer = document.getElementById("navbar-container");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navContainer.className = "fixed top-0 w-full z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/70 backdrop-blur-md border-b border-zinc-100/80 py-3 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.03)]";
    } else {
      navContainer.className = "fixed top-0 w-full z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-transparent py-6";
    }
  });

  // ==================== Nav Pill Dynamic Slider & Scrollspy ====================
  const navLinks = document.querySelectorAll(".nav-link");
  const slidingPill = document.getElementById("nav-sliding-pill");
  const desktopMenu = document.getElementById("desktop-menu");
  
  let currentActiveLink = null;

  const movePillTo = (link) => {
    if (!link) {
      slidingPill.style.opacity = "0";
      return;
    }
    const rect = link.getBoundingClientRect();
    const parentRect = desktopMenu.getBoundingClientRect();
    slidingPill.style.width = `${rect.width}px`;
    slidingPill.style.left = `${rect.left - parentRect.left}px`;
    slidingPill.style.opacity = "1";
  };

  const setActiveLink = (targetId) => {
    currentActiveLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
    navLinks.forEach(link => {
      if (link === currentActiveLink) {
        link.classList.add("text-black");
        link.classList.remove("text-zinc-500");
      } else {
        link.classList.add("text-zinc-500");
        link.classList.remove("text-black");
      }
    });
    // Move pill if not hovering menu
    if (!desktopMenu.matches(':hover')) {
      movePillTo(currentActiveLink);
    }
  };

  navLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
      movePillTo(link);
    });
  });

  desktopMenu.addEventListener("mouseleave", () => {
    movePillTo(currentActiveLink);
  });

  // Intersection Observer for Scrollspy
  const sections = document.querySelectorAll("section[id]");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // triggers when section is around middle of screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // ==================== Mobile Navigation Drawer ====================
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const menuOverlay = document.getElementById("mobile-menu-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const mobileFooter = document.getElementById("mobile-menu-footer");
  const bar1 = document.getElementById("hamburger-bar-1");
  const bar2 = document.getElementById("hamburger-bar-2");
  const bar3 = document.getElementById("hamburger-bar-3");

  let isMenuOpen = false;

  const toggleMobileMenu = () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      menuOverlay.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
      menuOverlay.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
      
      bar1.classList.add("rotate-45", "translate-x-[3px]", "-translate-y-[1px]");
      bar2.classList.add("opacity-0");
      bar3.classList.add("-rotate-45", "translate-x-[3px]", "translate-y-[1px]");

      mobileLinks.forEach((link, idx) => {
        setTimeout(() => {
          link.classList.remove("translate-y-8", "opacity-0");
          link.classList.add("translate-y-0", "opacity-100");
        }, idx * 60 + 150);
      });

      setTimeout(() => {
        mobileFooter.classList.remove("translate-y-4", "opacity-0");
        mobileFooter.classList.add("translate-y-0", "opacity-100");
      }, 550);

    } else {
      closeMobileMenu();
    }
  };

  const closeMobileMenu = () => {
    isMenuOpen = false;
    document.body.style.overflow = "unset";
    menuOverlay.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
    menuOverlay.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
    
    bar1.classList.remove("rotate-45", "translate-x-[3px]", "-translate-y-[1px]");
    bar2.classList.remove("opacity-0");
    bar3.classList.remove("-rotate-45", "translate-x-[3px]", "translate-y-[1px]");

    mobileLinks.forEach((link) => {
      link.classList.add("translate-y-8", "opacity-0");
      link.classList.remove("translate-y-0", "opacity-100");
    });
    mobileFooter.classList.add("translate-y-4", "opacity-0");
    mobileFooter.classList.remove("translate-y-0", "opacity-100");
  };

  menuToggle.addEventListener("click", toggleMobileMenu);
  mobileLinks.forEach(link => link.addEventListener("click", closeMobileMenu));
  document.getElementById("mobile-connect-link").addEventListener("click", closeMobileMenu);


  // ==================== Project Filter & View More ====================
  const filterBtnAll = document.getElementById("filter-btn-all");
  const filterBtnWeb = document.getElementById("filter-btn-web");
  const filterBtnDesign = document.getElementById("filter-btn-design");
  const projectBoxes = document.querySelectorAll(".project-box");
  const viewMoreBtn = document.getElementById("view-more-btn");
  const viewMoreContainer = document.getElementById("view-more-container");

  let currentFilter = "all";
  let isExpanded = false;

  const updateProjectVisibility = () => {
    let visibleCount = 0;
    projectBoxes.forEach(box => {
      const boxType = box.getAttribute("data-type");
      const matchesFilter = (currentFilter === "all" || boxType === currentFilter);
      
      if (matchesFilter) {
        if (isExpanded) {
          box.classList.remove("hidden");
        } else {
          if (visibleCount < 4) {
            box.classList.remove("hidden");
          } else {
            box.classList.add("hidden");
          }
        }
        visibleCount++;
      } else {
        box.classList.add("hidden");
      }
    });

    let totalMatches = 0;
    projectBoxes.forEach(box => {
      const boxType = box.getAttribute("data-type");
      if (currentFilter === "all" || boxType === currentFilter) {
        totalMatches++;
      }
    });

    const viewMoreText = document.getElementById("view-more-text");
    const viewMoreIcon = document.getElementById("view-more-icon");

    if (totalMatches <= 4) {
      viewMoreContainer.style.display = "none";
    } else {
      viewMoreContainer.style.display = "flex";
      if (isExpanded) {
        if (viewMoreText) viewMoreText.innerText = "View Less";
        if (viewMoreIcon) {
          viewMoreIcon.setAttribute("data-lucide", "chevron-up");
          viewMoreIcon.className = "w-5 h-5 group-hover:-translate-y-1 transition-transform";
        }
      } else {
        if (viewMoreText) viewMoreText.innerText = "View More Projects";
        if (viewMoreIcon) {
          viewMoreIcon.setAttribute("data-lucide", "chevron-down");
          viewMoreIcon.className = "w-5 h-5 group-hover:translate-y-1 transition-transform";
        }
      }
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  };

  const setActiveFilter = (activeBtn, filter) => {
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.className = "filter-btn flex items-center justify-center gap-2 px-3 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300 text-gray-500 hover:text-black";
    });
    activeBtn.className = "filter-btn flex items-center justify-center gap-2 px-3 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300 bg-black text-white shadow-md";
    currentFilter = filter;
    updateProjectVisibility();
  };

  if (filterBtnAll) filterBtnAll.addEventListener("click", () => setActiveFilter(filterBtnAll, "all"));
  if (filterBtnWeb) filterBtnWeb.addEventListener("click", () => setActiveFilter(filterBtnWeb, "web"));
  if (filterBtnDesign) filterBtnDesign.addEventListener("click", () => setActiveFilter(filterBtnDesign, "design"));
  if (viewMoreBtn) viewMoreBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;
    updateProjectVisibility();
    if (!isExpanded) {
      document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
    }
  });

  updateProjectVisibility();


  // ==================== GitHub Heatmap Generator ====================
  const generatePulseHeatmap = () => {
    const grid = document.getElementById("github-heatmap-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    const totalCells = 371; // 53 cols * 7 rows
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      const rand = Math.random();
      let bgClass = "bg-zinc-100 border border-zinc-200/30";
      let count = 0;
      if (rand > 0.9) {
        count = 12;
        bgClass = "bg-emerald-950";
      } else if (rand > 0.8) {
        count = 7;
        bgClass = "bg-emerald-700";
      } else if (rand > 0.6) {
        count = 4;
        bgClass = "bg-emerald-500";
      } else if (rand > 0.4) {
        count = 2;
        bgClass = "bg-emerald-300";
      }
      cell.className = `w-[9px] h-[9px] md:w-[11px] md:h-[11px] rounded-[1px] transition-all duration-200 ${bgClass}`;
      
      const dateMock = new Date();
      dateMock.setDate(dateMock.getDate() - (totalCells - i));
      const formattedDate = dateMock.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      cell.setAttribute("title", `${count === 0 ? 'No' : count} contributions on ${formattedDate}`);
      
      grid.appendChild(cell);
    }
  };
  generatePulseHeatmap();


  // ==================== Insights (Blogs) Content & Viewer ====================
  const blogsData = {
    1: {
      title: "From Idea to MVP: How Starting Small Changed the Way I Build",
      category: "Frontend Development",
      date: "Jan 15, 2026",
      content: `For a long time, I believed building something real required readiness. A proper plan. Clear architecture. Confidence in my skills. I thought shipping was something you did "after" everything made sense. Until then, ideas stayed safely in my head or inside notes.

Most of my time went into thinking, not building. Planning felt productive. Watching others ship impressive projects felt inspiring and quietly intimidating. I convinced myself I was preparing, when in reality I was avoiding the risk of starting.

What changed wasn’t a sudden burst of motivation. It was a small, almost careless decision to start something. Just a simple frontend screen for a problem that mildly annoyed me. No roadmap. No expectation. Just code on a dark screen late at night.

I still remember sitting at 1 AM, staring at a small bug that refused to go away. It wasn’t a big feature or an important release—just a button behaving slightly wrong. But in that moment, the project felt real. I wasn’t thinking about best practices or future scalability. I just wanted that one thing to work.

And somewhere between fixing that bug and refreshing the browser for the tenth time, something clicked. Once something exists—even imperfectly—it starts talking back. The UI shows you what’s missing. The flow exposes what doesn’t make sense. Ideas stop being theoretical and start becoming obvious. Small changes suggest bigger improvements. Not because you planned them, but because the product demands them.

Before this, I believed ideas came first and execution followed. Now I know execution "creates" ideas. As I kept building, the project grew but not in the way I used to imagine. It didn’t explode into complexity. It evolved naturally. Each enhancement came from friction I felt while using it myself. Features stopped feeling exciting just because they were possible. They felt necessary or unnecessary based on reality.`
    },
    2: {
      title: "The Truth About E-commerce Speed Optimization",
      category: "Performance / SEO",
      date: "Feb 28, 2026",
      content: `In digital retail, speed isn’t just a technical metric; it is directly tied to revenue. Studies consistently show that a page load delay of even one second can decrease conversion rates by up to 20%.

Most e-commerce platforms suffer from bloated scripts, massive unoptimized assets, and slow server response times. Over-reliance on third-party plugins adds dozens of external requests that block parsing.

How to optimize for Core Web Vitals:
1. Critical CSS Inlining: Ensure the above-the-fold content loads instantaneously.
2. Asset Compression: Transition all product mockups to modern WebP formats and load them with explicit dimensions.
3. Lazy Loading & Script Deferral: Defer non-critical analytics and chat widgets so the browser focuses first on DOM rendering.

By auditing and eliminating render-blocking operations, you create frictionless buyer journeys that retain users and increase sales.`
    },
    3: {
      title: "Why Clean Code Beats Complex Architectures Every Single Time",
      category: "Software Engineering",
      date: "Mar 10, 2026",
      content: `How prioritizing readability, minimal dependencies, and simple state management keeps projects maintainable over the long run.

In software engineering, there is a constant temptation to build for future complexity. Developers spend days designing abstract frameworks, highly modularized plugin patterns, and layered architectures for features that might never be built.

This is known as over-engineering, and it carries a heavy cost: readability drops, onboarding developers takes longer, and debugging simple issues becomes a multi-file tracing hunt.

True architectural quality lies in simplicity. Clean, readable code that solves the immediate problem directly is always easier to refactor than a complex framework built on predictions.

Principles of functional simplicity:
1. Don't add layers of abstraction until they are actually needed.
2. Rely on native browser features and vanilla solutions before importing packages.
3. Document why code does something, keeping the "how" clear and readable.

By coding with functional minimalism, you ensure that the project remains light, easy to modify, and robust against software rot.`
    }
  };

  const blogsListContainer = document.getElementById("blogs-list-container");
  const blogViewer = document.getElementById("blog-viewer");
  const blogViewerCategory = document.getElementById("blog-viewer-category");
  const blogViewerDate = document.getElementById("blog-viewer-date");
  const blogViewerTitle = document.getElementById("blog-viewer-title");
  const blogViewerContent = document.getElementById("blog-viewer-content");
  const blogBackBtn = document.getElementById("blog-back-btn");

  const blogRows = document.querySelectorAll(".blog-row");
  blogRows.forEach(row => {
    row.addEventListener("click", () => {
      const id = row.getAttribute("data-id");
      const data = blogsData[id];
      if (data) {
        blogViewerCategory.textContent = data.category;
        blogViewerDate.textContent = data.date;
        blogViewerTitle.textContent = data.title;
        
        // Render content dynamically splitting by paragraph for better spacing and formatting
        const paragraphs = data.content.split(/\n\n+/);
        let htmlContent = "";
        paragraphs.forEach((p, index) => {
          const trimmedText = p.trim();
          if (trimmedText) {
            if (index === 0) {
              htmlContent += `<p class="blog-viewer-lead">${trimmedText}</p>`;
            } else {
              htmlContent += `<p class="blog-viewer-paragraph">${trimmedText}</p>`;
            }
          }
        });
        blogViewerContent.innerHTML = htmlContent;
        
        blogsListContainer.style.display = "none";
        blogViewer.classList.remove("hidden");
        blogViewer.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  if (blogBackBtn) {
    blogBackBtn.addEventListener("click", () => {
      blogViewer.classList.add("hidden");
      blogsListContainer.style.display = "flex";
      document.getElementById("blogs").scrollIntoView({ behavior: "smooth" });
    });
  }


  // ==================== Form Submissions & Dynamic CTA Links ====================
  const heroCollaborate = document.getElementById("hero-collaborate-cta");
  const heroResume = document.getElementById("hero-resume-cta");
  const hiringTypeSelect = document.getElementById("hiringType");
  const contactForm = document.getElementById("contact-form");
  const successMsg = document.getElementById("success-message");
  const errorMsg = document.getElementById("error-message");

  if (heroCollaborate) {
    heroCollaborate.addEventListener("click", () => {
      if (hiringTypeSelect) hiringTypeSelect.value = "freelance";
    });
  }

  if (heroResume) {
    heroResume.addEventListener("click", () => {
      if (hiringTypeSelect) hiringTypeSelect.value = "job";
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        hiringType: hiringTypeSelect.value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
      };

      if (typeof emailjs !== "undefined") {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
          .then(() => {
            successMsg.classList.remove("hidden");
            errorMsg.classList.add("hidden");
            contactForm.reset();
          }, (err) => {
            console.error('EmailJS Error:', err);
            errorMsg.classList.remove("hidden");
            successMsg.classList.add("hidden");
          });
      } else {
        // Mock fallback if EmailJS is not fully initialized
        console.log("Submit Form Data (Offline fallback):", formData);
        successMsg.classList.remove("hidden");
        errorMsg.classList.add("hidden");
        contactForm.reset();
      }
    });
  }


  // ==================== Scroll to Top Progress Indicator ====================
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollToTopBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-10", "scale-50");
      scrollToTopBtn.classList.add("opacity-100", "pointer-events-auto", "translate-y-0", "scale-100");
    } else {
      scrollToTopBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-10", "scale-50");
      scrollToTopBtn.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0", "scale-100");
    }
  });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==================== Hero Entrance Animations ====================
  const heroAnimateElements = document.querySelectorAll(".hero-animate");
  setTimeout(() => {
    heroAnimateElements.forEach((el) => {
      el.classList.remove("opacity-0", "-translate-x-10", "translate-y-4", "translate-y-10");
    });
  }, 100);

  // ==================== Dark/Light Theme Toggle ====================
  const themeToggleBtn = document.getElementById("theme-toggle");
  
  // Apply saved theme or system preferred theme
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark" || (!currentTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("theme", theme);
    });
  }

  // ==========================================
  // Case Study Modal Logic
  // ==========================================
  const modalOverlay = document.getElementById("case-study-modal");
  const modalContent = document.getElementById("case-study-content");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const openModalBtns = document.querySelectorAll(".open-modal-btn");

  if (modalOverlay && modalContent) {
    const openModal = (btn) => {
      // Populate Title & Category
      document.getElementById("modal-title").innerText = btn.dataset.title || "";
      const subtitleText = document.getElementById("modal-subtitle-text");
      if (subtitleText) {
        subtitleText.innerText = btn.dataset.category || "Project Detail";
      }

      // Handle Section Visibility
      const updateSection = (id, content) => {
        const container = document.getElementById(`modal-${id}-container`);
        if (container) {
          if (content) {
            document.getElementById(`modal-${id}`).innerText = content;
            container.classList.remove("hidden");
          } else {
            container.classList.add("hidden");
          }
        }
      };

      // Populate New Format Sections
      updateSection("overview", btn.dataset.overview);
      updateSection("problem", btn.dataset.problem);
      updateSection("solution", btn.dataset.solution);
      updateSection("features", btn.dataset.features);

      // Populate Legacy Format Sections
      updateSection("about", btn.dataset.about);
      updateSection("contribution", btn.dataset.contribution);

      // Populate Stats Row (Traffic / Leads / Bounce)
      const statsRow = document.getElementById("modal-stats-row");
      if (btn.dataset.traffic || btn.dataset.leads || btn.dataset.bounce) {
        statsRow.classList.remove("hidden");
        document.getElementById("modal-stat1-value").innerText = btn.dataset.traffic || "—";
        document.getElementById("modal-stat1-sub").innerText = btn.dataset.trafficLabel || "Traffic Increase";
        document.getElementById("modal-stat2-value").innerText = btn.dataset.leads || "—";
        document.getElementById("modal-stat2-sub").innerText = btn.dataset.leadsLabel || "Lead Generation";
        document.getElementById("modal-stat3-value").innerText = btn.dataset.bounce || "—";
        document.getElementById("modal-stat3-sub").innerText = btn.dataset.bounceLabel || "Bounce Rate Drop";
      } else {
        statsRow.classList.add("hidden");
      }

      // Populate Client / Category / Date Info Bar
      const infoBar = document.getElementById("modal-info-bar");
      if (btn.dataset.client || btn.dataset.category || btn.dataset.date) {
        infoBar.classList.remove("hidden");
        document.getElementById("modal-client").innerText = btn.dataset.client || "—";
        document.getElementById("modal-category").innerText = btn.dataset.category || "—";
        document.getElementById("modal-date").innerText = btn.dataset.date || "—";
      } else {
        infoBar.classList.add("hidden");
      }

      // Populate Key Results Box
      const keyResultContainer = document.getElementById("modal-key-result-container");
      if (btn.dataset.results) {
        keyResultContainer.classList.remove("hidden");
        document.getElementById("modal-results").innerText = btn.dataset.results;
      } else {
        keyResultContainer.classList.add("hidden");
      }

      // Populate Buttons
      const liveLink = document.getElementById("modal-link-live");
      if (btn.dataset.link) {
        liveLink.href = btn.dataset.link;
        liveLink.classList.remove("hidden");
      } else {
        liveLink.classList.add("hidden");
      }
      
      const sourceLink = document.getElementById("modal-link-source");
      if (btn.dataset.sourceLink) {
        sourceLink.href = btn.dataset.sourceLink;
        sourceLink.classList.remove("hidden");
      } else {
        sourceLink.classList.add("hidden");
      }

      // Populate Software Pills
      const softwareSection = document.getElementById("modal-software-section");
      const softwareContainer = document.getElementById("modal-software-container");
      softwareContainer.innerHTML = "";
      if (btn.dataset.software) {
        softwareSection.classList.remove("hidden");
        const softwares = btn.dataset.software.split(",");
        softwares.forEach(sw => {
          const span = document.createElement("span");
          span.className = "px-4 py-1.5 rounded-full modal-new-pill text-[10px] font-bold tracking-widest uppercase border";
          span.innerText = sw.trim();
          softwareContainer.appendChild(span);
        });
      } else {
        softwareSection.classList.add("hidden");
      }

      // Show Modal
      modalOverlay.classList.remove("opacity-0", "pointer-events-none");
      modalContent.classList.remove("scale-95", "opacity-0");
      modalContent.classList.add("scale-100", "opacity-100");
      document.body.classList.add("modal-open");
    };

    const closeModal = () => {
      modalOverlay.classList.add("opacity-0", "pointer-events-none");
      modalContent.classList.remove("scale-100", "opacity-100");
      modalContent.classList.add("scale-95", "opacity-0");
      document.body.classList.remove("modal-open");
    };

    openModalBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest(".external-link")) {
          return; // Let the link work normally
        }
        e.preventDefault();
        e.stopPropagation();
        openModal(btn);
      });
    });

    closeModalBtn?.addEventListener("click", closeModal);

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("modal-open")) {
        closeModal();
      }
    });
  }

});
