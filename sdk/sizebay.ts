declare interface EWindow extends Window {
  SizeBay: any;
}

declare type GlobalThis = typeof globalThis & {
  SizeBayPrescript: () => {
    getPermalink: () => void;
    getAnchor: () => void;
    getTenantId: () => void;
    getButtons: () => void;
    getLanguage: () => void;
    getRecommendationText: () => void;
    getEventerPath: () => void;
  };
};

export default function initializeSizeBay() {
  function szbObserver() {
    const target = document.querySelector("#sizebay-container");
    console.log({ target })

    if (!target) {
      return;
    }

    const observer = new MutationObserver(function (mutations) {
      console.log(mutations);
      mutations.forEach(function (mutation) {
        if (mutation.removedNodes.length === 1) {
          document.querySelector(".vfr__container")?.remove();
          document.querySelector("#szb-vfr-recommendation")?.remove();

          SizeBayInit();
        }

        console.log(mutation.type);
      });
    });

    const config = {
      attributes: true,
      childList: true,
      characterData: true,
    };

    observer.observe(target, config);
    SizeBayInit()
  }

  (globalThis as GlobalThis).SizeBayPrescript = () => ({
    getPermalink() {
      const link = window.location.origin + window.location.pathname;
      console.log("Link produto: " + link);
      return link;
    },

    getAnchor() {
      return {
        web: "div#sizebay-container",
        mobile: "div#sizebay-container",
      };
    },

    getTenantId() {
      return 2235; // Simples Reserva
    },

    getButtons() {
      return {
        order: [
          { name: "vfr", text: "Provador Virtual" },
          { name: "chart", text: "Tabela de Medidas" },
        ],
        position: "after",
        class: "vfr__button--clean",
      };
    },

    getLanguage() {
      return "br";
    },

    getRecommendationText() {
      return {
        default: 'Sugerimos o tamanho "{size}"',
        simplified: 'Sugerimos o tamanho "{size}"',
        order: "before",
        anchor: ".vfr__container",
      };
    },

    getEventerPath() {
      return "2235/events.js";
    },
  });

  function insertStyle(href: string) {
    const linkElem = document.createElement("link");

    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("type", "text/css");
    linkElem.setAttribute("href", href);

    document.querySelector("body")
      ?.appendChild(linkElem);
  }

  function insertScript(src: string) {
    const app = document.createElement("script");

    app.id = "szb-vfr__base";
    app.setAttribute("src", src);

    document.querySelector("head")
      ?.appendChild(app);
  }

  function init() {
    const implantation =
      "https://vfr-v3-production.sizebay.technology/V4/implantation/index.js";
    insertScript(implantation);
  }

  function customStyle() {
    const style = `https://static.sizebay.technology/2235/styles_v4.css`;
    insertStyle(style);
  }

  function SizeBayInit() {
    init();

    customStyle();

    const payload = {
      permalink: (globalThis as GlobalThis).SizeBayPrescript().getPermalink(),
      tenantId: (globalThis as GlobalThis).SizeBayPrescript().getTenantId(),
      buttons: (globalThis as GlobalThis).SizeBayPrescript().getButtons(),
      anchor: (globalThis as GlobalThis).SizeBayPrescript().getAnchor(),
      lang: (globalThis as GlobalThis).SizeBayPrescript().getLanguage(),
      recommendation: (globalThis as GlobalThis).SizeBayPrescript()
        .getRecommendationText(),
    };

    let bool = true;

    const loaded = setInterval(() => {
      if (!document.querySelectorAll(".vfr__container").length && bool) {
        if (
          typeof (window as unknown as EWindow)?.SizeBay?.Implantation ===
            "function"
        ) {
          (window as unknown as EWindow)?.SizeBay?.Implantation(payload);
          bool = false;
        }
      }

      if (document.querySelectorAll("#szb-vfr-button").length > 0) {
        // szbObserverReload()
        clearInterval(loaded);
      }
    }, 1000);
  }

  setTimeout(function () {
    szbObserver();
  }, 2000);
}

// function szbObserver() {
//   const target = document.querySelector('.render-provider')

//   const observer = new MutationObserver(function (mutations) {
//     mutations.forEach(function (mutation) {
//       if (mutation.removedNodes.length === 1) {
//         document.querySelector('.vfr__container')?.remove()
//         document.querySelector('#szb-vfr-recommendation')?.remove()
//         SizebayInit()
//       }
//       console.log(mutation.type)
//     })
//   })

//   const config = { attributes: true, childList: true, characterData: true, attributes: true }

//   observer.observe(target, config)
// }

// function szbObserverReload() {
//   const target = document.querySelector(
//     'div.vtex-flex-layout-0-x-flexRow--product-right-col-add-to-cart div > div.items-stretch'
//   )

//   const observer = new MutationObserver(function (mutations) {
//     mutations.forEach(function (mutation) {
//       if (mutation.removedNodes.length === 1) {
//         document.querySelector('.vfr__container')?.remove()
//         document.querySelector('#szb-vfr-recommendation')?.remove()
//         SizebayInit()
//       }
//       console.log(mutation.type)
//     })
//   })

//   const config = { attributes: true, childList: true, characterData: true, attributes: true }

//   observer.observe(target, config)
// }

// window.SizebayPrescript = () => ({
//   getPermalink() {
//     let product = document.querySelector('meta[property="og:url"]')?.content.split('https://sizebayanchor--simplesreserva.myvtex.com/').join('https://www.simplesreserva.com/') || window.location.href.split('https://sizebayanchor--simplesreserva.myvtex.com/').join('https://www.simplesreserva.com/')
//     console.log('Link produto: ' + product)
//     return product
//   },
//   getAnchor() {
//     return {
//       web: 'div.oficinareserva-product-1-x-skuSelectorNameContainer',
//       mobile: 'div.oficinareserva-product-1-x-skuSelectorNameContainer',
//     }
//   },
//   getTenantId() {
//     return 2235
//   },
//   getButtons() {
//     return {
//       order: [
//         { name: 'vfr', text: 'Provador Virtual' },
//         { name: 'chart', text: 'Tabela de Medidas' },
//       ],
//       position: 'after',
//       class: 'vfr__button--clean',
//     }
//   },
//   getLanguage() {
//     return 'br'
//   },
//   getRecommendationText() {
//     return {
//       default: 'Sugerimos o tamanho "{size}"',
//       simplified: 'Sugerimos o tamanho "{size}"',
//       order: 'before',
//       anchor: '.vfr__container',
//     }
//   },
//   getEventerPath() {
//     return '2235/events.js'
//   },
// })

// function insertStyle(ref) {
//   let linkElem = document.createElement('link')
//   linkElem.setAttribute('rel', 'stylesheet')
//   linkElem.setAttribute('type', 'text/css')
//   linkElem.setAttribute('href', ref)
//   document.querySelector('body').appendChild(linkElem)
// }

// function insertScript(ref) {
//   let app = document.createElement('script')
//   app.id = 'szb-vfr__base'
//   app.setAttribute('src', ref)
//   document.querySelector('head').appendChild(app)
// }

// function init() {
//   let implantation = 'https://vfr-v3-production.sizebay.technology/V4/implantation/index.js'
//   insertScript(implantation)
// }

// function customStyle() {
//   let style = `https://static.sizebay.technology/2235/styles_v4.css`
//   insertStyle(style)
// }

// function SizebayInit() {
//   init()

//   customStyle()

//   let payload = {
//     permalink: SizebayPrescript().getPermalink(),
//     tenantId: SizebayPrescript().getTenantId(),
//     buttons: SizebayPrescript().getButtons(),
//     anchor: SizebayPrescript().getAnchor(),
//     lang: SizebayPrescript().getLanguage(),
//     recommendation: SizebayPrescript().getRecommendationText(),
//   }

//   let bool = true

//   let loaded = setInterval(() => {
//     if (!document.querySelectorAll('.vfr__container').length && bool) {
//       if (typeof window?.Sizebay?.Implantation === 'function') {
//         window?.Sizebay?.Implantation(payload)
//         bool = false
//       }
//     }

//     if (document.querySelectorAll('#szb-vfr-button').length > 0) {
//       szbObserverReload()
//       clearInterval(loaded)
//     }
//   }, 1000)
// }

// setTimeout(function () {
//   szbObserver()
// }, 2000)
