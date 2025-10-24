["load", "resize"].forEach((event) => {
  window.addEventListener(event, function () {
    let headerHeight = header.clientHeight;
    const main = document.querySelector(".main");
    const plashka = header.querySelector(".header-top");
    if (plashka) {
      var originalHeightPlashka = plashka.offsetHeight;
    }
    window.onscroll = function (e) {
      if (window.scrollY > headerHeight) {
        if (!header.classList.contains("fixed")) {
          header.classList.add("fixed");
          main.removeAttribute("style");
        }
        main.style.marginTop = headerHeight + "px";
      } else {
        if (plashka) {
          plashka.style.height = originalHeightPlashka + "px";
          plashka.classList.remove("hide");
        }
        header.classList.remove("show-plashka");
        header.classList.remove("fixed");
        main.removeAttribute("style");
      }
    };
  });
});

/* show-more */
function initShowMoreForContainer(showMoreInner) {
  if (!showMoreInner || showMoreInner.dataset.showMoreInitialized === "true") {
    return;
  }

  const showMoreItems = showMoreInner.querySelectorAll(".show-more-item");
  const showMoreBtn = showMoreInner.querySelector(".show-more-btn");

  const isGalleryPage = showMoreInner.classList.contains("gallery-page");
  const hideBtnText = "Скрыть";
  const originalBtnText = showMoreBtn ? showMoreBtn.textContent.trim() : "";
  const initialVisibleCount = isGalleryPage ? 6 : 8;
  const itemsPerClick = isGalleryPage ? 6 : 8;
  let visibleItemsCount = initialVisibleCount;

  function updateVisibility() {
    showMoreItems.forEach((item, index) => {
      if (index < visibleItemsCount) {
        item.classList.remove("latent");
      } else {
        item.classList.add("latent");
      }
    });

    if (!showMoreBtn) return;

    if (visibleItemsCount >= showMoreItems.length) {
      showMoreBtn.classList.remove("latent");
      showMoreBtn.classList.add("visible");
      showMoreBtn.classList.add("expanded");
      if (showMoreBtn.textContent.trim() !== hideBtnText) {
        showMoreBtn.textContent = hideBtnText;
      }
    } else {
      showMoreBtn.classList.remove("expanded");
      showMoreBtn.classList.remove("latent");
      if (showMoreItems.length > initialVisibleCount) {
        showMoreBtn.classList.add("visible");
      } else {
        showMoreBtn.classList.remove("visible");
      }
      if (originalBtnText && showMoreBtn.textContent.trim() !== originalBtnText) {
        showMoreBtn.textContent = originalBtnText;
      }
    }
  }

  updateVisibility();

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", function () {
      if (showMoreBtn.classList.contains("expanded")) {
        visibleItemsCount = initialVisibleCount;
        updateVisibility();
        return;
      }
      visibleItemsCount += itemsPerClick;
      updateVisibility();
    });

    if (showMoreItems.length > initialVisibleCount) {
      showMoreBtn.classList.remove("latent");
      showMoreBtn.classList.add("visible");
      showMoreBtn.textContent = originalBtnText || showMoreBtn.textContent;
    } else {
      showMoreBtn.classList.remove("visible");
      showMoreBtn.classList.remove("expanded");
      showMoreBtn.classList.add("latent");
    }
  }

  showMoreInner.dataset.showMoreInitialized = "true";
}

function initShowMoreAll() {
  document
    .querySelectorAll(".show-more-inner")
    .forEach((container) => initShowMoreForContainer(container));
}

function refreshShowMoreAll() {
  document.querySelectorAll(".show-more-inner").forEach((container) => {
    const items = container.querySelectorAll(".show-more-item");
    const btn = container.querySelector(".show-more-btn");
    const isGallery = container.classList.contains("gallery-page");
    const initialCount = isGallery ? 6 : 8;

    // If not initialized yet, initialize
    if (!container.dataset.showMoreInitialized) {
      initShowMoreForContainer(container);
      return;
    }

    let visibleCount = btn && btn.classList.contains("expanded")
      ? items.length
      : initialCount;

    items.forEach((item, idx) => {
      if (idx < visibleCount) {
        item.classList.remove("latent");
      } else {
        item.classList.add("latent");
      }
    });

    if (btn) {
      if (items.length > initialCount) {
        btn.classList.add("visible");
        btn.classList.remove("latent");
      } else {
        btn.classList.remove("visible");
        btn.classList.remove("expanded");
        btn.classList.add("latent");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initShowMoreAll();
});

/* panel */
document.addEventListener("DOMContentLoaded", function () {
  const panelItems = document.querySelectorAll(".panel-link");
  panelItems.forEach((elem) => {
    const panelTitle = elem.querySelector(".panel-title");
    const panelBody = elem.querySelector(".panel-body");

    panelTitle.addEventListener("click", function () {
      this.classList.toggle("active");
      panelBody.classList.toggle("active");
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  /* Mask phone */
  [].forEach.call(
    document.querySelectorAll("input[type=tel]"),
    function (input) {
      let keyCode;
      function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        let pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        let matrix = "+7 (___) ___ ____",
          i = 0,
          def = matrix.replace(/\D/g, ""),
          val = this.value.replace(/\D/g, ""),
          new_value = matrix.replace(/[_\d]/g, function (a) {
            return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
          });
        i = new_value.indexOf("_");
        if (i != -1) {
          i < 5 && (i = 3);
          new_value = new_value.slice(0, i);
        }
        let reg = matrix
          .substr(0, this.value.length)
          .replace(/_+/g, function (a) {
            return "\\d{1," + a.length + "}";
          })
          .replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (
          !reg.test(this.value) ||
          this.value.length < 5 ||
          (keyCode > 47 && keyCode < 58)
        )
          this.value = new_value;
        if (event.type == "blur" && this.value.length < 5) this.value = "";
      }

      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
      input.addEventListener("keydown", mask, false);
    }
  );
  /* End Mask phone */
  // Popups
  function popupClose(popupActive) {
    popupActive.classList.remove("open");
    document.body.classList.remove("lock");
    document.querySelector("html").removeAttribute("style");
    document.querySelector("html").classList.remove("lock");
    document.querySelector("header").removeAttribute("style");
  }
  const popupOpenBtns = document.querySelectorAll(".popup-btn");
  const popups = document.querySelectorAll(".popup");
  const originalTitlePopup2 =
    document.querySelector(".original-title").innerHTML;
  const originalSubtitlePopup2 =
    document.querySelector(".original-subtitle")?.innerHTML || "";
  const closePopupBtns = document.querySelectorAll(".close-popup");
  closePopupBtns.forEach(function (el) {
    el.addEventListener("click", function (e) {
      popupClose(e.target.closest(".popup"));
    });
  });
  popupOpenBtns.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const path = e.currentTarget.dataset.path;
      const currentPopup = document.querySelector(`[data-target="${path}"]`);
      if (currentPopup) {
        popups.forEach(function (popup) {
          popupClose(popup);
          popup.addEventListener("click", function (e) {
            if (!e.target.closest(".popup__content")) {
              popupClose(e.target.closest(".popup"));
            }
          });
        });
        currentPopup.classList.add("open");
        if (currentPopup.getAttribute("data-target") == "popup-change") {
          let originaTitle = currentPopup.querySelector(".original-title");
          let originaSubtitle = currentPopup.querySelector(".original-subtitle");
          if (el.classList.contains("change__item-btn")) {
            if (el.classList.contains("doctors__btn")) {
              let currentItem = el.closest(".change__item-title");
              let currentTitile = currentItem.querySelector(".current-title");
              let currentSubtitile = currentItem.querySelector(".current-subtitle");
              originaTitle.innerHTML =
                "Записаться к специалисту: " + currentTitile.innerHTML;
              if (currentSubtitile && originaSubtitle) {
                originaSubtitle.innerHTML = currentSubtitile.innerHTML;
              }
            } else {
              if (el.classList.contains("change__item-btn_current")) {
                originaTitle.textContent = el.textContent;
              } else {
                let currentItem = el.closest(".change__item-title");
                let currentTitile = currentItem.querySelector(".current-title");
                let currentSubtitile = currentItem.querySelector(".current-subtitle");
                originaTitle.innerHTML = currentTitile.innerHTML;
                if (currentSubtitile && originaSubtitle) {
                  originaSubtitle.innerHTML = currentSubtitile.innerHTML;
                }
              }
            }
          } else {
            originaTitle.innerHTML = originalTitlePopup2;
            if (originaSubtitle) {
              originaSubtitle.innerHTML = originalSubtitlePopup2;
            }
          }
        }
        if (el.classList.contains("reviews__btn")) {
          let currentItem = el.closest(".reviews__item");
          let originalTop = currentPopup.querySelector(
            ".reviews__header_original"
          );
          let originalText = currentPopup.querySelector(
            ".reviews__text_original"
          );
          let originalBottom = currentPopup.querySelector(
            ".reviews__bottom_original"
          );
          originalTop.innerHTML =
            currentItem.querySelector(".reviews__header").innerHTML;
          originalText.innerHTML =
            currentItem.querySelector(".reviews__text").innerHTML;
          originalBottom.innerHTML =
            currentItem.querySelector(".reviews__bottom").innerHTML;
        }
        scrollWidthFunc();
        document.querySelector("html").classList.add("lock");
      }
    });
  });
  /* end popups */

  //Анимации
  function formatNumber(num) {
    return String(num)
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function updateCounter(element, stop, increment) {
    if (parseInt(element.innerText) + increment > stop) {
      element.innerText = formatNumber(stop)
    } else {
      setTimeout(() => {
        element.innerText = (parseInt(element.innerText) + increment)
        updateCounter(element, stop, increment)
      }, 1);
    }
  }

  function counterAnimate(element, start, stop, time) {
    element.innerText = start;
    increment = Math.trunc((stop - start) / time)
    updateCounter(element, stop, increment)
  }

  const observer = new IntersectionObserver((entries) => {
    let width = 0;
    entries.forEach(entry => {
      if (entry.target.getAttribute("data-min-width")) {
        width = entry.target.getAttribute("data-min-width")
      }
      if (entry.isIntersecting && window.innerWidth > width) {
        if (entry.target.classList.contains("counter")) {
          stop = parseInt(entry.target.innerText.replaceAll(" ", ""))
          counterAnimate(entry.target, 0, stop, 250)
        }

        // Для элементов в animation-group задержка обрабатывается через CSS
        if (entry.target.closest(".animation-group")) {
          entry.target.classList.add("animated");
        } else {
          // Для обычных элементов можно использовать data-delay
          const delay = entry.target.getAttribute("data-delay");
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add("animated")
            }, parseInt(delay));
          } else {
            entry.target.classList.add("animated");
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px',
  });

  const animatedItems = document.querySelectorAll(".to_animate")

  if (animatedItems.length > 0) {
    animatedItems.forEach(item => {
      observer.observe(item)
    })
  }
  //Анимации



  /* tabbs */
  const tabbs = document.querySelectorAll(".tabbs");
  if (tabbs.length > 0) {
    tabbs.forEach((elem) => {
      const tabb = elem.querySelectorAll(".tabb");
      const content = elem.querySelectorAll(".tabb__content");
      for (let i = 0; i < tabb.length; i++) {
        tabb[i].addEventListener("click", () => {
          if (tabb[i].classList.contains("active")) {
            tabb[i].classList.remove("active");
            if (content[i]) {
              content[i].classList.remove("active");
            }
          } else {
            tabb.forEach((item) => {
              item.classList.remove("active");
            });
            content.forEach((item) => {
              item.classList.remove("active");
            });
            tabb[i].classList.add("active");
            if (content[i]) {
              content[i].classList.add("active");
            }
          }
        });
      }
    });
  }

  /* tabs */
  class Tabs {
    container;
    tab_button_class;
    tab_content_class;
    tab_attribute_key;
    tab_attribute_target;
    tab_navigation_next;
    tab_navigation_prev;
    tab_active_name;

    constructor({
      container = ".tabs-container",
      tabs_wrapper_class = ".tabs__wrapper",
      button_class = ".tab",
      content_class = ".tab-content",
      attribute_key = "path",
      attribute_target = "target",
      nav_next = ".tabs__arrow_next",
      nav_prev = ".tabs__arrow_prev",
      name_active = ".tabs__active",
    } = {}) {
      this.container = container;
      this.tabs_wrapper_class = tabs_wrapper_class;
      this.tab_button_class = button_class;
      this.tab_content_class = content_class;
      this.tab_attribute_key = attribute_key;
      this.tab_attribute_target = attribute_target;
      this.tab_navigation_next = nav_next;
      this.tab_navigation_prev = nav_prev;
      this.tab_active_name = name_active;
    }

    initTabs() {
      document.querySelectorAll(this.container).forEach((wrapper) => {
        this.initTabsWrapper(wrapper);
      });
    }

    initTabsWrapper(wrapper) {
      const tabsWrapper = wrapper.querySelector(this.tabs_wrapper_class);
      const tabsButtonList = wrapper.querySelectorAll(this.tab_button_class);
      const tabsContentList = wrapper.querySelectorAll(this.tab_content_class);
      const tabsNavigationNext = wrapper.querySelector(
        this.tab_navigation_next
      );
      const tabsNavigationPrev = wrapper.querySelector(
        this.tab_navigation_prev
      );
      const tabActiveName = wrapper.querySelector(this.tab_active_name);
      const tabsClose = document.querySelectorAll(".tabs__close");
      let currentTab = 0;
      if (tabActiveName) {
        const pElement = tabsButtonList[currentTab].querySelector('p');
        tabActiveName.querySelector(".tabs__active-text").textContent =
          pElement ? pElement.textContent : tabsButtonList[currentTab].textContent;
      }

      for (let index = 0; index < tabsButtonList.length; index++) {
        if (tabsButtonList[index].dataset.start === true) {
          currentTab = index;
        }

        tabsButtonList[index].addEventListener("click", () => {
          if (tabsContentList[index]) {
            currentTab = index;
            this.showTabsContent({
              list_tabs: tabsContentList,
              list_buttons: tabsButtonList,
              index: currentTab,
            });
            if (tabActiveName) {
              const pElement = tabsButtonList[index].querySelector('p');
              tabActiveName.querySelector(".tabs__active-text").textContent =
                pElement ? pElement.textContent : tabsButtonList[index].textContent;
              tabActiveName.closest(".tabs").classList.remove("active");
              document.querySelector("html").classList.remove("lock");
            }
          }
        });
      }

      this.showTabsContent({
        list_tabs: tabsContentList,
        list_buttons: tabsButtonList,
        index: currentTab,
      });

      if (tabsNavigationNext) {
        tabsNavigationNext.addEventListener("click", () => {
          if (currentTab + 1 < tabsButtonList.length) {
            currentTab += 1;
          } else {
            currentTab = 0;
          }

          const tabsWrapperPositionX = tabsWrapper.getBoundingClientRect().left;
          const currentTabPositionX =
            tabsButtonList[currentTab].getBoundingClientRect().left;
          const currentTabPositionXRegardingParent =
            currentTabPositionX - tabsWrapperPositionX;

          tabsWrapper.scrollBy({
            left: currentTabPositionXRegardingParent,
            behavior: "smooth",
          });

          this.showTabsContent({
            list_tabs: tabsContentList,
            list_buttons: tabsButtonList,
            index: currentTab,
          });
        });
      }

      if (tabsNavigationPrev) {
        tabsNavigationPrev.addEventListener("click", () => {
          if (currentTab - 1 >= 0) {
            currentTab -= 1;
          } else {
            currentTab = tabsButtonList.length - 1;
          }

          const tabsWrapperPositionX = tabsWrapper.getBoundingClientRect().left;
          const currentTabPositionX =
            tabsButtonList[currentTab].getBoundingClientRect().left;
          const currentTabPositionXRegardingParent =
            currentTabPositionX - tabsWrapperPositionX;

          tabsWrapper.scrollBy({
            left: currentTabPositionXRegardingParent,
            behavior: "smooth",
          });

          this.showTabsContent({
            list_tabs: tabsContentList,
            list_buttons: tabsButtonList,
            index: currentTab,
          });
        });
      }

      if (tabActiveName) {
        tabActiveName.addEventListener("click", function () {
          tabActiveName.closest(".tabs").classList.add("active");
          document.querySelector("html").classList.add("lock");
        });
      }

      if (tabsClose.length > 0) {
        for (let i = 0; i < tabsClose.length; i += 1) {
          const tabClose = tabsClose[i];
          tabClose.addEventListener("click", function () {
            tabClose.closest(".tabs").classList.remove("active");
            document.querySelector("html").classList.remove("lock");
          });
        }
      }

      tabsWrapper
        .closest(".tabs__container")
        .addEventListener("click", function (e) {
          if (!e.target.closest(".tabs__wrapper")) {
            tabsWrapper.closest(".tabs").classList.remove("active");
            document.querySelector("html").classList.add("lock");
          }
        });
    }

    hideTabsContent({ list_tabs, list_buttons }) {
      list_buttons.forEach((el) => {
        el.classList.remove("active");
      });
      list_tabs.forEach((el) => {
        el.classList.remove("active");
      });
    }

    showTabsContent({ list_tabs, list_buttons, index }) {
      this.hideTabsContent({
        list_tabs,
        list_buttons,
      });

      if (list_tabs[index]) {
        list_tabs[index].classList.add("active");
      }

      if (list_buttons[index]) {
        list_buttons[index].classList.add("active");
      }

      // Обновляем контент при смене вкладки
      setTimeout(() => {
        reviewsHide();
        refreshShowMoreAll();
      }, 50);
    }
  }
  new Tabs().initTabs();
  /* End tabs */

  // navigation

  const articleNavigations = document.querySelectorAll(".navigation");
  if (articleNavigations.length > 0) {
    articleNavigations.forEach((articleNavigation) => {
      // Находим ближайший текстовый блок в той же секции
      const section = articleNavigation.closest('section');
      const textContent = section ? section.querySelector('.text__content') : null;

      if (!textContent) return;

      const jsScrollBlockList = textContent.querySelectorAll(
        "h1, h2, h3, h4, h5"
      );

      if (jsScrollBlockList.length > 0) {
        for (let i = 0; i < jsScrollBlockList.length; i += 1) {
          const jsScrollBlock = jsScrollBlockList[i];
          const titleBlock = jsScrollBlock.textContent;
          const articleNavigationList =
            articleNavigation.querySelector(".navigation__list");
          const articleNavigationItem = document.createElement("li");
          const articleNavigationLink = document.createElement("a");
          articleNavigationItem.classList.add("navigation__item");
          if (jsScrollBlock.tagName == "H1") {
            articleNavigationItem.classList.add("title-h1");
          }
          if (jsScrollBlock.tagName == "H2") {
            articleNavigationItem.classList.add("title-h2");
          } else if (jsScrollBlock.tagName == "H3") {
            articleNavigationItem.classList.add("title-h3");
          } else if (jsScrollBlock.tagName == "H4") {
            articleNavigationItem.classList.add("title-h4");
          } else if (jsScrollBlock.tagName == "H5") {
            articleNavigationItem.classList.add("title-h5");
          } else if (jsScrollBlock.tagName == "H6") {
            articleNavigationItem.classList.add("title-h6");
          }
          articleNavigationLink.classList.add("navigation__link");
          jsScrollBlock.setAttribute("id", `${i}`);
          articleNavigationLink.setAttribute("href", `$${i}`);
          articleNavigationLink.textContent = " " + titleBlock;
          articleNavigationItem.append(articleNavigationLink);
          articleNavigationList.append(articleNavigationItem);
        }
        articleNavigation.querySelectorAll('a[href^="$"').forEach((link) => {
          link.addEventListener("click", function (e) {
            e.preventDefault();
            let href = this.getAttribute("href").substring(1);
            const scrollTarget = document.getElementById(href);
            const topOffset = 280;
            const elementPosition = scrollTarget.getBoundingClientRect().top;
            const offsetPosition = elementPosition - topOffset;
            window.scrollBy({
              top: offsetPosition,
              behavior: "smooth",
            });
          });
        });
      } else {
        articleNavigation.remove();
      }
    });
  }

  // end navigation
  // animation
  const animationItems = document.querySelectorAll(".animation-item");
  if (animationItems.length > 0) {
    function onEntry(e) {
      e.forEach((e) => {
        e.isIntersecting && e.target.classList.add("animation-active");
      });
    }
    let options = {
      threshold: [0.5],
    },
      observer = new IntersectionObserver(onEntry, options);
    for (let e of animationItems) observer.observe(e);
  }

  /* yandex map */
  let flagMap = false;
  document.addEventListener("scroll", function () {
    const blockMap = document.getElementById("map");
    if (blockMap) {
      const posTop = blockMap.getBoundingClientRect().top;

      if (posTop < window.innerHeight && !flagMap) {
        if (
          !document.querySelector(
            '[src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"]'
          )
        ) {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=YOUR_API_KEY";
          document.head.appendChild(script);
        }
        setTimeout(function () {
          ymaps.ready(init);
          function init() {
            const map = document.querySelector("#map");

            if (map) {
              const markerCoordinates = [47.21280619894176, 39.726343006841795];
              const centerCoordinates = [47.21280619894176, 39.726343006841795]

              var myMap = new ymaps.Map("map", {
                center: centerCoordinates,
                zoom: 16,
              });

              myGeoObject = new ymaps.GeoObject();
              myMap.geoObjects.add(
                new ymaps.Placemark(
                  markerCoordinates,
                  {
                    balloonContent: "Наркологическая клиника Здравум",
                  },
                  {
                    iconLayout: "default#image",
                    iconImageHref: "assets/img/icons/map-marker.svg",
                    iconImageSize: [80, 80],
                    iconImageOffset: [-40, -80],
                  }
                )
              );

              myMap.behaviors.disable(["scrollZoom"]);
            }
          }
        }, 500);
        flagMap = true;
      }
    }
  });
  /* end yandex map */

  /* end show-more */
  function reviewsHide() {
    // Ищем отзывы во всех табах
    const reviews = document.querySelectorAll(".reviews__item");
    if (reviews.length > 0) {
      reviews.forEach((item) => {
        if (!item.classList.contains("reviews__item_original")) {
          const reviewsText = item.querySelector(".reviews__text");
          const reviewsBtn = item.querySelector(".reviews__btn");
          item.style.scale = "1";
          item.style.display = "flex";
          if (reviewsBtn && reviewsText) {
            if (reviewsText.offsetHeight > 150) {
              reviewsText.classList.add("hidden");
              reviewsBtn.classList.add("active");
            }
          }
          item.removeAttribute("style");
        }
      });
    }
  }
  setTimeout(function () {
    reviewsHide();
  }, 100);

  /* search */
  let inputSearch = document.querySelectorAll("input[type=search]");
  if (inputSearch.length > 0) {
    inputSearch.forEach((elem) => {
      const wrapper = elem.closest(".search-wrapper");
      if (wrapper) {
        function search() {
          let filter = elem.value.toUpperCase();
          let ul = wrapper.querySelectorAll(".search-list");
          ul.forEach((item) => {
            let li = item.getElementsByTagName("li");
            for (let i = 0; i < li.length; i++) {
              let a = li[i].querySelector(".search-list__name");
              if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].classList.remove("hide");
              } else {
                li[i].classList.add("hide");
              }
            }
          });
        }
        document.addEventListener("keyup", search);
      }
    });
  }
  /* end search */

  const cards = document.querySelectorAll(".card");
  if (cards.length > 0) {
    cards.forEach(function (item) {
      item.addEventListener("mouseenter", function (e) {
        if (window.innerWidth > 1020) {
          calculateAngle(e, this.querySelector(".card__item"), this);
        }
      });
      item.addEventListener("mousemove", function (e) {
        if (window.innerWidth > 1020) {
          calculateAngle(e, this.querySelector(".card__item"), this);
        }
      });
      item.addEventListener("mouseleave", function (e) {
        if (window.innerWidth > 1020) {
          let dropShadowColor = `rgba(0, 0, 0, 0.3)`;
          item.classList.remove("animated");
          item.querySelector(
            ".card__item"
          ).style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
          item.querySelector(
            ".card__item"
          ).style.filter = `drop-shadow(0 5px 5px ${dropShadowColor})`;
        }
      });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth < 1021) {
        cards.forEach((elem) => {
          elem.removeAttribute("style");
          elem.querySelector(".card__item").removeAttribute("style");
        });
      }
    });
  }
  //   var menuItems = document.querySelectorAll(".menu-item-has-submenu");

  //   menuItems.forEach(function (item) {
  //     item.addEventListener("click", function () {
  //       var isActive = item.classList.contains("active");
  //       var submenus = document.querySelectorAll(".submenu");
  //       var menuItems = document.querySelectorAll(".menu-item-has-submenu");

  //       if (isActive) {
  //         submenus.forEach(function (submenu) {
  //           submenu.classList.remove("active");
  //         });
  //         item.classList.remove("active");
  //       } else {
  //         menuItems.forEach(function (menuItem) {
  //           menuItem.classList.remove("active");
  //         });
  //         item.classList.add("active");
  //         submenus.forEach(function (submenu) {
  //           submenu.classList.remove("active");
  //         });
  //         var childSubmenu = item.querySelector(".submenu");
  //         if (childSubmenu) {
  //           childSubmenu.classList.add("active");
  //         }
  //       }
  //     });
  //   });

  const burgerMenu = document.querySelector(".burger__menu");
  if (burgerMenu) {
    const headerMobile = document.querySelector(".header__wrapper");
    const header = document.querySelector(".header");
    burgerMenu.addEventListener("click", () => {
      if (burgerMenu.classList.contains("active")) {
      } else {
        let height = header.offsetHeight;
        let topPos = header.getBoundingClientRect().top + window.scrollY;
        headerMobile.style.maxHeight = "calc(100vh - " + height + "px)";
      }
      headerMobile.classList.toggle("active");
      burgerMenu.classList.toggle("active");
      header.classList.toggle("active");
      document.querySelector("html").classList.toggle("burger-lock");
    });
  }
  const headerServiceBtns = document.querySelectorAll(".header__service-btn");
  headerServiceBtns.forEach((headerServiceBtn) => {
    headerServiceBtn.addEventListener("click", () => {
      headerServiceBtn.classList.toggle("active");
      headerServiceBtn.nextElementSibling.classList.toggle("active");
    });
  });

  /* tabs */
  // const tabs = document.querySelectorAll(".tabs");
  // if (tabs.length > 0) {
  //   tabs.forEach((elem) => {
  //     const tab = elem.querySelectorAll(".tab");
  //     const content = elem.querySelectorAll(".tab__content");
  //     for (let i = 0; i < tab.length; i++) {
  //       tab[i].addEventListener("click", () => {
  //         if (tab[i].classList.contains("active")) {
  //           tab[i].classList.remove("active");
  //           if (content[i]) {
  //             content[i].classList.remove("active");
  //           }
  //         } else {
  //           tab.forEach((item) => {
  //             item.classList.remove("active");
  //           });
  //           content.forEach((item) => {
  //             item.classList.remove("active");
  //           });
  //           tab[i].classList.add("active");
  //           if (content[i]) {
  //             content[i].classList.add("active");
  //           }
  //         }
  //       });
  //     }
  //   });
  // }

  // разные функции
  const hideItems = document.querySelectorAll(".hide-items");
  if (hideItems.length > 0) {
    hideItems.forEach((elem) => {
      const hideItem = elem.querySelectorAll(".hide-item");
      const hideItems = elem.querySelectorAll(".hide-item");
      const hideTitles = elem.querySelectorAll(".hide-item__title");
      const hideContents = elem.querySelectorAll(".hide-item__content");
      hideItem.forEach((item) => {
        let title = item.querySelector(".hide-item__title");
        let content = item.querySelector(".hide-item__content");
        title.addEventListener("click", () => {
          if (title.classList.contains("active")) {
            title.classList.remove("active");
            content.classList.remove("active");
            item.classList.remove("active");
            content.style.height = "0";
          } else {
            hideTitles.forEach((element) => {
              element.classList.remove("active");
            });
            hideItems.forEach((element) => {
              element.classList.remove("active");
            });
            hideContents.forEach((element) => {
              element.classList.remove("active");
              element.style.height = "0";
            });
            let height =
              content.querySelector(".hide-item__height").offsetHeight;
            title.classList.add("active");
            item.classList.add("active");
            content.classList.add("active");
            content.style.height = height + "px";
          }
        });
      });
    });
  }

  // sliders
  const stagesSliderCheck = document.querySelectorAll(".stages");
  if (stagesSliderCheck.length > 0) {
    stagesSliderCheck.forEach((slider) => {
      const swiperStages = new Swiper(slider.querySelector(".swiper"), {
        direction: "horizontal",
        slidesPerView: 1.2,
        grabCursor: true,
        spaceBetween: 10,
        breakpoints: {
          320: {
            slidesPerView: 1.3,
            spaceBetween: 10,
          },
          560: {
            slidesPerView:2.3,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 3.3,
            spaceBetween: 10,
          },
          1300: {
            slidesPerView: 4.3,
            spaceBetween: 10,
          },
        },
      });
    });
  }

  const reviewsSliderCheck = document.querySelectorAll(".reviews");
  if (reviewsSliderCheck.length > 0) {
    reviewsSliderCheck.forEach((slider) => {
      const swiperReviews = new Swiper(slider.querySelector(".swiper"), {
        direction: "horizontal",
        navigation: {
          nextEl: slider.querySelector(".reviews__slider-button_next"),
          prevEl: slider.querySelector(".reviews__slider-button_prev"),
        },
        pagination: {
          el: ".reviews-pagination",
          type: "bullets",
          clickable: true,
        },
        slidesPerView: 1.2,
        grabCursor: true,
        spaceBetween: 10,

        breakpoints: {
          750: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
        },
      });
    });
  }

  const stocksSliderCheck = document.querySelectorAll(".stocks");
  if (stocksSliderCheck.length > 0) {
    stocksSliderCheck.forEach((slider) => {
      const swiperstocks = new Swiper(slider.querySelector(".swiper"), {
        direction: "horizontal",
        slidesPerView: 1.2,
        grabCursor: true,
        spaceBetween: 10,

        breakpoints: {
          550: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
        },
      });
    });
  }
  const doctorsCheck = document.querySelectorAll(".doctors");
  if (doctorsCheck.length > 0) {
    doctorsCheck.forEach((slider) => {
      const swiperTabs = new Swiper(slider.querySelector(".swiper"), {
        direction: "horizontal",
        navigation: {
          nextEl: slider.querySelector(".doctors__slider-button_next"),
          prevEl: slider.querySelector(".doctors__slider-button_prev"),
        },
        pagination: {
          el: ".doctors-pagination",
          type: "bullets",
          clickable: true,
        },
        grabCursor: true,
        slidesPerView: "auto",
        spaceBetween: 20,
        initialSlide: 2,
        breakpoints: {
          320: {
            slidesPerView: 1.2,
            spaceBetween: 20,
            centeredSlides: false,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
            centeredSlides: true,
          },
          1200: {
            effect: "coverflow",
            centeredSlides: true,
            slidesPerView: 5,
            spaceBetween: 20,
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 500,
              modifier: 0.2,
              slideShadows: false,
            },
          },
        },
      });
    });
  }


  const licencesSliderCheck = document.querySelectorAll(".licences");
  if (licencesSliderCheck.length > 0) {
    licencesSliderCheck.forEach((slider) => {
      const swiperLicences = new Swiper(slider.querySelector(".swiper"), {
        direction: "horizontal",
        navigation: {
          nextEl: slider.querySelector('.licences-button_next'),
          prevEl: slider.querySelector('.licences-button_prev'),
        },
        pagination: {
          el: ".licences-pagination",
          type: "bullets",
          clickable: true,
        },
        grabCursor: true,
        initialSlide: 2,
        spaceBetween: 10,
        breakpoints: {
          320: {
            slidesPerView: 1.3,
            centeredSlides: false,
            spaceBetween: 10,
          },
          500: {
            slidesPerView: 3,
            centeredSlides: false,
            spaceBetween: 10,
          },
          768: {
            effect: "coverflow",
            centeredSlides: true,
            slidesPerView: 5,
            spaceBetween: 20,
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 500,
              modifier: 0.2,
              slideShadows: false,
            },
          },
          1024: {
            effect: "coverflow",
            centeredSlides: true,
            slidesPerView: 5,
            spaceBetween: 20,
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 500,
              modifier: 0.2,
              slideShadows: false,
            },
          },
        },
      });
    });
  }

  // gallery slider
  SwiperCheck1 = document.querySelector(".mySwiper")
  SwiperCheck2 = document.querySelector(".mySwiper2")
  if (SwiperCheck1 && SwiperCheck2) {
    var swiper = false;
    var swiper2 = false;

    function initSwiper() {
      if (!swiper) {
        swiper = new Swiper(".mySwiper", {
          spaceBetween: 8,
          slidesPerView: window.innerWidth < 1024 ? 3 : 4,
          freeMode: true,
          watchSlidesProgress: true,
          grabCursor: true,
        });

        swiper2 = new Swiper(".mySwiper2", {
          spaceBetween: 10,
          thumbs: {
            swiper: swiper,
          },
          navigation: {
            nextEl: ".gallery__slider-button_next",
            prevEl: ".gallery__slider-button_prev",
          },
          pagination: {
            el: ".gallery-pagination",
            type: "fraction",
            renderFraction: function (currentClass, totalClass) {
              return `<span class="${currentClass}"></span> / <span class="${totalClass}"></span>`;
            },
            clickable: true,
          },
        });
      }
    }

    ['resize', 'load'].forEach((event) => {
      window.addEventListener(event, function () {
        if (swiper) {
          swiper.destroy(true, true);
          swiper = false;
          swiper2.destroy(true, true);
          swiper2 = false;
        }
        initSwiper();
      })
    })
  }
  Fancybox.bind("[data-fancybox]", {});
  // gallery slider end



  // end Sliders
});
/*     a11y: false, */
let scrollWidthFunc = () => {
  let scrollWidth = window.innerWidth - document.body.clientWidth;
  document.querySelector("html").style.paddingRight = scrollWidth + "px";
  document.querySelector("header").style.paddingRight = scrollWidth + "px";
};
let calculateAngle = function (e, item, parent) {
  let dropShadowColor = `rgba(0, 0, 0, 0.5)`;
  let x = Math.abs(item.getBoundingClientRect().x - e.clientX);
  let y = Math.abs(item.getBoundingClientRect().y - e.clientY);
  let halfWidth = item.getBoundingClientRect().width / 2;
  let halfHeight = item.getBoundingClientRect().height / 2;
  let calcAngleX = (x - halfWidth) / 10;
  let calcAngleY = (y - halfHeight) / 14;
  parent.style.perspective = `${halfWidth * 12}px`;
  item.style.perspective = `${halfWidth * 12}px`;
  item.style.transform = `rotateY(${calcAngleX}deg) rotateX(${-calcAngleY}deg) scale(1.04)`;
  let calcShadowX = (x - halfWidth) / 10;
  let calcShadowY = (y - halfHeight) / 8;
  item.style.filter = `drop-shadow(${-calcShadowX}px ${-calcShadowY}px 15px ${dropShadowColor})`;
};

const headerPlashka = document.querySelector(".header__plashka");
const headerPlashkaInner = document.querySelector(".header__plashka-height");
if (headerPlashka && headerPlashkaInner) {
  window.onscroll = function (e) {
    let headerHeight = header.clientHeight;
    if (window.scrollY > headerHeight) {
      if (!header.classList.contains("scrolled")) {
        header.classList.add("scrolled");
        headerPlashka.style.height = "0px";
      }
    } else {
      let height = headerPlashkaInner.offsetHeight;
      headerPlashka.style.height = height + "px";
      header.classList.remove("scrolled");
    }
  };
}

document.addEventListener("DOMContentLoaded", function () {
  //   const clinicMenuBtn = document.querySelector(".header__nav-btn");
  //   if (clinicMenuBtn) {
  //     clinicMenuBtn.addEventListener("click", () => {
  //       clinicMenuBtn.classList.toggle("active");
  //       document.querySelector(".header__submenu").classList.toggle("active");
  //     });
  //   }
});

/* filter */
// const filters = document.querySelectorAll(".filter");
// if (filters.length > 0) {
//   filters.forEach((elem) => {
//     const filterBtn = elem.querySelector(".filter__current");
//     const originalText = filterBtn.innerHTML.trim();
//     const filtersItem = elem.querySelectorAll(".filter__list button");
//     const items = elem.querySelectorAll(".filter__item");
//     const list = elem.querySelector(".filter__list");
//     const count = elem.querySelector(".filter__count");
//     const originalCount = items.length;
//     if (count) {
//       count.innerHTML = originalCount;
//     }
//     filterBtn.addEventListener("click", () => {
//       if (window.innerWidth < 1023) {
//         list.classList.toggle("active");
//         filterBtn.classList.toggle("active");
//       }
//     });
//     filtersItem.forEach((btn) => {
//       btn.addEventListener("click", () => {
//         let activeFilter = btn.innerHTML.trim();
//         if (activeFilter != originalText) {
//           filterBtn.innerHTML = activeFilter;
//           let countCurrent = 0;
//           for (let i = 0; i < items.length; i++) {
//             const itemFilters = items[i].dataset.filter
//               .split("||")
//               .map((item) => item.trim());
//             items[i].classList.remove("hide");
//             if (!itemFilters.includes(activeFilter)) {
//               items[i].classList.add("hide");
//             } else {
//               countCurrent += 1;
//             }
//           }
//           if (count) {
//             count.innerHTML = countCurrent;
//           }
//         } else {
//           filterBtn.innerHTML = originalText;
//           for (let i = 0; i < items.length; i++) {
//             items[i].classList.remove("hide");
//           }
//           if (count) {
//             count.innerHTML = originalCount;
//           }
//         }
//         if (window.innerWidth < 1023) {
//           list.classList.remove("active");
//           filterBtn.classList.remove("active");
//         }
//       });
//     });
//   });
// }
// /* end  filter */


