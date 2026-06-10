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
  const filterBtnAI = document.getElementById("filter-btn-ai");
  const filterBtnWeb = document.getElementById("filter-btn-web");

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
  if (filterBtnAI) filterBtnAI.addEventListener("click", () => setActiveFilter(filterBtnAI, "ai"));
  if (filterBtnWeb) filterBtnWeb.addEventListener("click", () => setActiveFilter(filterBtnWeb, "web"));

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
      title: "How I Built a Production Voice Agent for Real Estate (Twilio + OpenAI + RAG)",
      category: "AI Voice Agents",
      date: "May 28, 2026",
      content: `Real estate teams lose qualified leads to delayed response times. The standard fix is a chatbot — and I've shipped enough of them to know they don't solve the actual problem. Visitors who reach out by phone want to talk to someone. A chatbot saying "let us know your details and we'll get back to you" is exactly the moment conversion drops.

The architecture I now ship for inbound real-estate calls:
1. Twilio picks up the call and streams audio to my backend in real time.
2. OpenAI's realtime API handles speech-to-speech with sub-second latency.
3. A RAG layer retrieves property knowledge — inventory, pricing, location details — from a Pinecone vector store that re-embeds whenever listings change.
4. An n8n workflow orchestrates lead capture, CRM sync, and hand-off back to a human.

The hand-off logic is what most builds get wrong. The agent shouldn't try to close the deal. It should qualify intent in natural conversation, capture context, and route high-value calls to a human with the full transcript and a summary attached. Hot leads ring sales directly. Cold ones get an automated follow-up email.

What I've learned shipping this stack:

Latency matters more than you think. Anything above 800ms feels robotic. Streaming audio both ways is non-negotiable.

RAG beats fine-tuning for property knowledge. Listings change weekly; embeddings are cheap to refresh. Fine-tuning is expensive to maintain.

Always record the call. The audit trail saves you when something breaks, and it gives the human picking up the lead full context.

Edge cases will eat your week. The hand-off threshold needs constant tuning for the first month — too eager and you wake sales at midnight; too cautious and Hot leads cool off.

If you're building anything with voice + AI for a business that actually sells over the phone, this is the stack I'd recommend over any off-the-shelf voice-agent platform. The pieces are mature; the wiring is where the value lives.`
    },
    2: {
      title: "Zero-Touch Lead Qualification: How GPT-4o-mini and n8n Replaced Manual Lead Triage",
      category: "AI Automation",
      date: "Apr 22, 2026",
      content: `Most B2B businesses I work with have the same problem: sales reps spend 30–40% of their week triaging leads that should have been pre-scored before they ever hit the inbox. The fix isn't more salespeople — it's removing the human from triage entirely.

The n8n workflow I built for this:

Trigger: a Google Form submission (you can swap for Typeform, HubSpot, anything with a webhook).

AI Qualification node: GPT-4o-mini scores the lead against a rubric — opportunity value, lead stage, company info, email quality, completeness. It returns structured JSON with a score (0–100), priority tier, and recommended action items.

Parse + Save: error-handling on bad JSON, then a write to a status sheet for tracking.

Categorize: Hot (70+), Warm (40–69), Cold (<40).

CRM Sync: contact created or updated in HighLevel automatically.

Notification: the sales rep gets an email with lead details, the AI's score breakdown, and suggested next steps.

The rubric is the unsexy part that decides whether this works. Spend a day with the sales team writing it. Mine for a real-estate client weighted opportunity value (+30) based on self-reported budget and intent signals, lead stage (+25) for explicit "ready to buy" vs "still exploring", company info (+20) for B2B context, completeness (+15) because more fields filled means more serious, and professional email (+10) because @company.com signals more than @gmail.com.

What changed after deployment: response time on Hot leads dropped from hours to under five minutes. About 80% of Cold leads stopped reaching the sales team entirely — they got routed into an automated nurture sequence instead. The team had a full audit trail for every scoring decision, so they could tune the rubric weekly without guessing.

Total stack cost: under $20/month. The most expensive part is the Azure OpenAI tokens, and that's still nothing compared to one rep's hour.`
    },
    3: {
      title: "Building a $0 SEO Rank Tracker with n8n, MCP, and Google Sheets",
      category: "AI Automation",
      date: "Mar 18, 2026",
      content: `I was paying $99/month for an SEO rank tracker. Then I built one in n8n in an afternoon. Here's the exact workflow.

The stack:

Trigger: a cron node, daily or weekly depending on how often the team wants the data.

Input: a keyword + domain pair that lives in a Google Sheet so adding more is friction-free.

SERP Scraper: an MCP-powered agent that grabs Google search results for the keyword.

OpenAI Chat Model: ranks the results, identifies the target domain's position, and extracts SERP-feature data (featured snippets, People Also Ask, etc).

Auto-Fixing Output Parser: enforces structured JSON output. If the model returns malformed data, it retries instead of crashing the run.

Format SERP Results: a small JS node that normalizes the output into the schema the sheet expects.

Log to Google Sheets: appendOrUpdate writes the new ranking to a tracking sheet ready for charting.

The MCP integration is the unlock. Before MCP, SERP scraping meant maintaining your own scraper, handling CAPTCHAs, rotating proxies. With MCP, the scraper agent is a tool the model calls. The model decides when to use it, gets structured results back, and your workflow stays clean.

Tracking results over time: the sheet has columns for date, keyword, domain, position, top 3 competitors, and detected SERP features. Conditional formatting flags position changes. A pivot table or Looker Studio dashboard turns that into a rank graph over time.

The whole thing runs for the cost of the OpenAI tokens — under $5/month for tracking 50 keywords daily.

Why I'm sharing the build: the gap between "pay for a tool" and "build your own" is shrinking fast. If you're a marketing team that already has n8n running for other workflows, adding rank tracking is two hours of work. That's a $1,200/year recurring saving for half a Saturday.`
    },
    4: {
      title: "Grah Kalyan: Architecting a Multi-Role Marketplace with Custom WooCommerce Plugins",
      category: "Business Platforms",
      date: "Feb 15, 2026",
      content: `Grah Kalyan is a religious marketplace that connects customers, administrators, managers, and pandits through a single operational system. When I started building it, the temptation was obvious: stack a few off-the-shelf WooCommerce extensions and call it a day. I shipped a custom-plugin architecture instead. Here's why.

The problem: four distinct user roles, each with completely different workflows. An admin needs system-wide order visibility. A manager handles a region's pandit network. A pandit sees only their own bookings. A customer sees a clean booking flow. WooCommerce's default permission model can't express this cleanly. The plugin ecosystem can — but stitching five extensions together for one use case creates a fragile system where any single plugin update can break everything.

The architecture I shipped:

WordPress + WooCommerce as the foundation, because the client's team was already comfortable with it.

A custom PHP plugin for role-based access control that wraps WooCommerce capabilities and adds region-scoped permissions on top.

Three dashboards (admin, manager, pandit) built as separate plugin modules, each rendered conditionally based on the logged-in user's role.

Custom post types for puja bookings, pandit availability, and temple inventory.

A WooCommerce extension that hooks into the order lifecycle and routes orders to the correct manager, who routes them to the correct pandit.

Why this beat off-the-shelf:

One plugin to update, not five. Stability ages well.

All business logic lives in one place — easier to audit, easier to extend.

The dashboards share a design system, so they read as one product instead of a Frankenstein.

When the client asks for a new role or workflow, it's a feature branch, not a plugin hunt.

What I'd do differently next time:

I'd build the role-permission layer first, before any UI. I rebuilt it twice because the early role assumptions changed once real users started flowing through.

I'd write the order-routing tests up front. Multi-stakeholder workflows fail silently if you don't, and "silently broken" is the worst kind of bug to catch in production.

The platform now handles temple service operations across multiple stakeholders. Custom plugins were the right call.`
    },
    5: {
      title: "What I Learned Shipping 18 Production Websites Across 7 Verticals",
      category: "Lessons",
      date: "Jan 10, 2026",
      content: `Over the past three years I've shipped 18+ production websites and platforms across real estate, healthcare, e-commerce, consulting, investment, architecture, and religious services. A retrospective on the patterns that worked across all of them — and the three I'll never reuse.

What worked everywhere:

Lead the design with one number the client cares about. Real-estate clients care about qualified leads per month. Healthcare cares about appointment booking rate. Consultancies care about discovery-call requests. Build the visual hierarchy around that one number. Everything else is secondary.

The hero is a promise, not a description. Most client briefs start with "tell people what we do." The sites that converted started with "tell people what they get." The difference is the bounce rate.

Mobile-first, but mobile-equal. "Mobile-first" usually means designed on mobile and audited on desktop. Equal-priority means the mobile experience is shipped, tested, and iterated like the desktop one. Half my clients' traffic is mobile; treating it as a derivative is leaving conversions on the table.

SEO is structure, not keywords. Every site that ranked got there through clean URL structure, semantic HTML, schema markup, and fast Core Web Vitals — not keyword density. The pages I'm proudest of don't read like they were written for search engines.

Build for the team that will run it, not the team that built it. Especially on WordPress builds. If the client's marketing person can't update the homepage hero in under 60 seconds, the site will get stale within a quarter.

What I'll never reuse:

Page builders for anything beyond a brochure. They feel productive on day one and become an albatross by month six. Custom code stays maintainable; Elementor's plugin sprawl doesn't.

Off-the-shelf "premium" themes for serious clients. They make you fight the theme to ship a brand. Cleaner to build to spec.

Over-architected component systems for sites under 20 pages. The setup cost dwarfs the maintenance benefit at that size. I default to flat structure now and refactor when complexity earns it.

The biggest lesson across 18 builds: the best portfolios I've made were the ones where I pushed back hardest on the brief. Clients don't always know what they need. Pushing back, with evidence, is part of the job.`
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

  // ============================================================
  // CONTACT FORM → Google Sheets via Apps Script Web App
  // ------------------------------------------------------------
  // 1. Create a Google Sheet with these headers in row 1 of the
  //    "Contacts" tab:
  //       Timestamp | First Name | Last Name | Email |
  //       Hiring Type | Subject | Message | User Agent
  // 2. Extensions → Apps Script → paste the Code.gs from the
  //    punch-list PDF → Deploy as Web App
  //    (Execute as: Me, Access: Anyone)
  // 3. Paste the deployment URL below.
  // ============================================================
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdLKuMrpci_MkX29bg6ExCGK_sutId9IKriQj97W50bnOqFs9_wTe3XZ983lQpbf1_Pw/exec";

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending…";
      }

      const formData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        hiringType: hiringTypeSelect.value,
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim(),
        userAgent: navigator.userAgent
      };

      try {
        if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith("PASTE_")) {
          throw new Error("Apps Script URL not configured");
        }

        // no-cors required because Apps Script Web Apps don't return
        // proper CORS headers. The POST still lands; we just can't
        // read the response.
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(formData)
        });

        successMsg.classList.remove("hidden");
        errorMsg.classList.add("hidden");
        contactForm.reset();
      } catch (err) {
        console.error("Contact form error:", err);
        errorMsg.classList.remove("hidden");
        successMsg.classList.add("hidden");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
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


      // Populate Proof Image (Similarweb, n8n workflow, dashboard, etc.)
      const proofContainer = document.getElementById("modal-proof-container");
      if (proofContainer) {
        if (btn.dataset.proofImage) {
          proofContainer.classList.remove("hidden");
          document.getElementById("modal-proof-image").src = btn.dataset.proofImage;
          document.getElementById("modal-proof-caption").innerText = btn.dataset.proofCaption || "";
        } else {
          proofContainer.classList.add("hidden");
        }
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
