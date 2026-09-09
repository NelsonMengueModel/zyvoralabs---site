(function () {
  "use strict";

  var root = document.documentElement;
  var header = document.querySelector("[data-header]");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-nav]");
  var themePicker = document.querySelector("[data-theme-picker]");
  var themeOptions = document.querySelectorAll("[data-theme-option]");
  var themeColor = document.querySelector('meta[name="theme-color"]');

  var themeMetaColors = {
    viva: "#07100e",
    noite: "#080d0b",
    contraste: "#080b12"
  };

  function updateThemeControls(theme) {
    themeOptions.forEach(function (option) {
      option.setAttribute("aria-pressed", String(option.dataset.themeOption === theme));
    });

    if (themeColor) {
      themeColor.setAttribute("content", themeMetaColors[theme] || themeMetaColors.viva);
    }
  }

  function setTheme(theme) {
    if (!Object.prototype.hasOwnProperty.call(themeMetaColors, theme)) return;

    root.dataset.theme = theme;
    updateThemeControls(theme);

    try {
      localStorage.setItem("zyvora-site-theme", theme);
    } catch (error) {}

    if (themePicker) themePicker.open = false;
  }

  updateThemeControls(root.dataset.theme || "viva");

  themeOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      setTheme(option.dataset.themeOption);
    });
  });

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  document.addEventListener("click", function (event) {
    if (themePicker && themePicker.open && !themePicker.contains(event.target)) {
      themePicker.open = false;
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    if (themePicker) themePicker.open = false;
    if (menuToggle && nav) {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });

  var scenarios = {
    atraso: {
      kicker: "Risco de atraso",
      title: "Dois pedidos precisam de atenção.",
      copy: "A máquina 03 desacelerou. Repriorizar a fila hoje preserva os prazos mais críticos.",
      source: "Produção + pedidos",
      priority: "Prioridade alta",
      boardState: "Atenção coordenada",
      boardArea: "Produção + pedidos",
      boardHeadline: "Fila recalculada em tempo real",
      heroMetricOneLabel: "Pedidos ativos",
      heroMetricOne: "18",
      heroMetricOneNote: "2 exigem atenção",
      heroMetricTwoLabel: "Ritmo da fila",
      heroMetricTwo: "76%",
      heroMetricTwoNote: "máquina 03 abaixo do previsto",
      heroMetricThreeLabel: "Prazo protegido",
      heroMetricThree: "16",
      heroMetricThreeNote: "pedidos dentro da janela",
      heroRouteOne: "Pedido #1042",
      heroRouteTwo: "Máquina 03",
      heroRouteThree: "Prazo",
      boardFeed: "Impacto cruzado com os pedidos confirmados",
      chipOne: "Produção · 76%",
      chipTwo: "Prazo · atenção",
      metricOneLabel: "Pedidos em risco",
      metricOne: "02",
      metricOneNote: "de 18 ativos",
      metricTwoLabel: "Folga mínima",
      metricTwo: "4h",
      metricTwoNote: "antes do prazo",
      event: "A máquina 03 opera abaixo do ritmo previsto e afeta dois pedidos da mesma fila.",
      guidance: "Antecipe a troca de fila e priorize o pedido com menor folga.",
      reason: "Os outros pedidos compartilham material e podem ser redistribuídos sem aumentar custo.",
      sources: "Produção · Pedidos · Prazos"
    },
    estoque: {
      kicker: "Cobertura crítica",
      title: "O filamento branco cobre só seis dias.",
      copy: "Quatro pedidos confirmados usam o mesmo material. A compra precisa acontecer antes do próximo ciclo.",
      source: "Estoque + vendas",
      priority: "Comprar hoje",
      boardState: "Reposição recomendada",
      boardArea: "Estoque + vendas",
      boardHeadline: "Cobertura projetada até o próximo ciclo",
      heroMetricOneLabel: "Cobertura atual",
      heroMetricOne: "6d",
      heroMetricOneNote: "no ritmo previsto",
      heroMetricTwoLabel: "Pedidos vinculados",
      heroMetricTwo: "04",
      heroMetricTwoNote: "usam filamento branco",
      heroMetricThreeLabel: "Compra sugerida",
      heroMetricThree: "Hoje",
      heroMetricThreeNote: "antes da ruptura projetada",
      heroRouteOne: "Saldo atual",
      heroRouteTwo: "Fila confirmada",
      heroRouteThree: "Compra",
      boardFeed: "Consumo futuro confrontado com o saldo disponível",
      chipOne: "Estoque · 6 dias",
      chipTwo: "Compra · hoje",
      metricOneLabel: "Cobertura atual",
      metricOne: "6d",
      metricOneNote: "no ritmo previsto",
      metricTwoLabel: "Pedidos afetados",
      metricTwo: "04",
      metricTwoNote: "já confirmados",
      event: "O consumo projetado ultrapassa o saldo disponível antes da conclusão da fila confirmada.",
      guidance: "Reponha o filamento branco hoje e preserve a reserva dos quatro pedidos.",
      reason: "A compra antecipada evita parada, troca de material e renegociação de prazo com clientes.",
      sources: "Estoque · Vendas · Compras"
    },
    financeiro: {
      kicker: "Pressão no caixa",
      title: "Sexta-feira concentra o maior risco financeiro.",
      copy: "Dois recebimentos atrasados coincidem com três compromissos de curto prazo.",
      source: "Recebimentos + caixa",
      priority: "Revisar hoje",
      boardState: "Caixa sob observação",
      boardArea: "Recebimentos + caixa",
      boardHeadline: "Compromissos e entradas conectados",
      heroMetricOneLabel: "Recebimentos",
      heroMetricOne: "02",
      heroMetricOneNote: "fora do prazo",
      heroMetricTwoLabel: "Impacto previsto",
      heroMetricTwo: "18%",
      heroMetricTwoNote: "do caixa semanal",
      heroMetricThreeLabel: "Janela crítica",
      heroMetricThree: "Sexta",
      heroMetricThreeNote: "maior concentração",
      heroRouteOne: "Recebimentos",
      heroRouteTwo: "Compromissos",
      heroRouteThree: "Caixa",
      boardFeed: "Efeito dos atrasos calculado na projeção semanal",
      chipOne: "Caixa · -18%",
      chipTwo: "Cobrança · hoje",
      metricOneLabel: "Recebimentos",
      metricOne: "2",
      metricOneNote: "fora do prazo",
      metricTwoLabel: "Impacto previsto",
      metricTwo: "18%",
      metricTwoNote: "do caixa semanal",
      event: "A postergação de dois clientes reduz a cobertura dos compromissos previstos para sexta-feira.",
      guidance: "Antecipe a cobrança dos dois títulos e reprograme apenas o compromisso de menor impacto.",
      reason: "A medida preserva fornecedores críticos e reduz a necessidade de capital de emergência.",
      sources: "Contas a receber · Caixa · Compras"
    }
  };

  var scenarioOrder = ["atraso", "estoque", "financeiro"];
  var currentScenario = 0;
  var scenarioTimer;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var heroTabs = document.querySelectorAll("[data-scenario]");
  var actionTabs = document.querySelectorAll("[data-action-scenario]");
  var briefing = document.querySelector(".live-briefing");
  var heroBoard = document.querySelector(".v19-app-window") || document.querySelector(".stage-dashboard");
  var actionDetail = document.querySelector(".action-detail");

  function setText(selector, value) {
    var element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function restartScenarioProgress() {
    var progress = document.querySelector(".scenario-progress i");
    if (!progress) return;
    progress.style.animation = "none";
    void progress.offsetWidth;
    progress.style.animation = "";
  }

  function applyScenario(name, animate) {
    var data = scenarios[name];
    if (!data) return;

    currentScenario = scenarioOrder.indexOf(name);
    heroTabs.forEach(function (button) {
      button.setAttribute("aria-selected", String(button.dataset.scenario === name));
    });
    actionTabs.forEach(function (button) {
      var active = button.dataset.actionScenario === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });

    setText("[data-briefing-kicker]", data.kicker);
    setText("[data-briefing-title]", data.title);
    setText("[data-briefing-copy]", data.copy);
    setText("[data-briefing-source]", data.source);
    setText("[data-briefing-priority]", data.priority);
    setText("[data-hero-board-state]", data.boardState);
    setText("[data-hero-board-area]", data.boardArea);
    setText("[data-hero-board-headline]", data.boardHeadline);
    setText("[data-hero-metric-one-label]", data.heroMetricOneLabel);
    setText("[data-hero-metric-one]", data.heroMetricOne);
    setText("[data-hero-metric-one-note]", data.heroMetricOneNote);
    setText("[data-hero-metric-two-label]", data.heroMetricTwoLabel);
    setText("[data-hero-metric-two]", data.heroMetricTwo);
    setText("[data-hero-metric-two-note]", data.heroMetricTwoNote);
    setText("[data-hero-metric-three-label]", data.heroMetricThreeLabel);
    setText("[data-hero-metric-three]", data.heroMetricThree);
    setText("[data-hero-metric-three-note]", data.heroMetricThreeNote);
    setText("[data-hero-route-one]", data.heroRouteOne);
    setText("[data-hero-route-two]", data.heroRouteTwo);
    setText("[data-hero-route-three]", data.heroRouteThree);
    setText("[data-hero-board-feed]", data.boardFeed);
    setText("[data-hero-chip-one]", data.chipOne);
    setText("[data-hero-chip-two]", data.chipTwo);
    setText("[data-metric-one-label]", data.metricOneLabel);
    setText("[data-metric-one]", data.metricOne);
    setText("[data-metric-one-note]", data.metricOneNote);
    setText("[data-metric-two-label]", data.metricTwoLabel);
    setText("[data-metric-two]", data.metricTwo);
    setText("[data-metric-two-note]", data.metricTwoNote);
    setText("[data-action-event]", data.event);
    setText("[data-action-guidance]", data.guidance);
    setText("[data-action-reason]", data.reason);
    setText("[data-action-sources]", data.sources);

    if (animate) {
      [briefing, heroBoard, actionDetail].forEach(function (element) {
        if (!element) return;
        element.classList.remove("is-updating");
        void element.offsetWidth;
        element.classList.add("is-updating");
      });
    }
    restartScenarioProgress();
  }

  function scheduleScenarios() {
    window.clearInterval(scenarioTimer);
    if (reducedMotion.matches || document.hidden) return;
    scenarioTimer = window.setInterval(function () {
      currentScenario = (currentScenario + 1) % scenarioOrder.length;
      applyScenario(scenarioOrder[currentScenario], true);
    }, 5000);
  }

  heroTabs.forEach(function (button) {
    button.addEventListener("click", function () {
      applyScenario(button.dataset.scenario, true);
      scheduleScenarios();
    });
  });

  actionTabs.forEach(function (button) {
    button.addEventListener("click", function () {
      applyScenario(button.dataset.actionScenario, true);
      scheduleScenarios();
    });
  });

  applyScenario(scenarioOrder[currentScenario], false);
  scheduleScenarios();

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      window.clearInterval(scenarioTimer);
    } else {
      scheduleScenarios();
    }
  });

  var flowSteps = document.querySelectorAll("[data-flow-step]");
  var flowIndex = 0;
  if (flowSteps.length && !reducedMotion.matches) {
    flowSteps[0].classList.add("is-active");
    window.setInterval(function () {
      flowSteps[flowIndex].classList.remove("is-active");
      flowIndex = (flowIndex + 1) % flowSteps.length;
      flowSteps[flowIndex].classList.add("is-active");
    }, 1100);
  }

  var v19Modules = document.querySelectorAll("[data-v19-module]");
  var v19EventSteps = document.querySelectorAll("[data-v19-flow-step]");
  var v19MotionIndex = 0;

  if (v19Modules.length && v19EventSteps.length && !reducedMotion.matches) {
    window.setInterval(function () {
      v19Modules.forEach(function (item) { item.classList.remove("is-current"); });
      v19EventSteps.forEach(function (item) { item.classList.remove("is-current"); });

      v19MotionIndex = (v19MotionIndex + 1) % v19Modules.length;
      v19Modules[v19MotionIndex].classList.add("is-current");
      v19EventSteps[Math.min(v19MotionIndex, v19EventSteps.length - 1)].classList.add("is-current");
    }, 1350);
  }

  var processItems = document.querySelectorAll("[data-process-track] li");
  var processIndex = 0;
  var processTimer;
  var processStatus = document.querySelector("[data-process-status]");
  var processNarrative = document.querySelector("[data-process-narrative]");
  var processProgress = document.querySelector("[data-process-progress]");

  function renderProcessStep() {
    var item = processItems[processIndex];
    processItems.forEach(function (processItem) {
      processItem.classList.remove("is-current");
      processItem.removeAttribute("aria-current");
    });
    item.classList.add("is-current");
    item.setAttribute("aria-current", "step");
    if (processStatus) processStatus.textContent = item.dataset.processLabel;
    if (processNarrative) processNarrative.textContent = item.dataset.processCopy;
    if (processProgress) processProgress.style.width = (((processIndex + 1) / processItems.length) * 100) + "%";
  }

  function startProcessMotion() {
    if (!processItems.length || processTimer || reducedMotion.matches) return;
    renderProcessStep();
    processTimer = window.setInterval(function () {
      processIndex = (processIndex + 1) % processItems.length;
      renderProcessStep();
    }, 2200);
  }

  if ("IntersectionObserver" in window && processItems.length) {
    var processObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        startProcessMotion();
        processObserver.disconnect();
      }
    }, { threshold: 0.25 });
    processObserver.observe(document.querySelector("[data-process-track]"));
  } else {
    startProcessMotion();
  }

  var hero = document.querySelector("[data-hero]");
  var stage = document.querySelector("[data-zy-stage]");
  if (hero && stage && window.matchMedia("(pointer: fine)").matches && !reducedMotion.matches) {
    hero.addEventListener("pointermove", function (event) {
      var bounds = hero.getBoundingClientRect();
      var x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
      var y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
      stage.style.setProperty("--stage-x", x.toFixed(2) + "px");
      stage.style.setProperty("--stage-y", y.toFixed(2) + "px");
    });
    hero.addEventListener("pointerleave", function () {
      stage.style.setProperty("--stage-x", "0px");
      stage.style.setProperty("--stage-y", "0px");
    });
  }

  var navLinks = document.querySelectorAll(".main-nav a[href^='#']");
  var observedSections = Array.prototype.map.call(navLinks, function (link) {
    return document.getElementById(link.getAttribute("href").slice(1));
  }).filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-24% 0px -66%", threshold: 0 });

    observedSections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

}());
