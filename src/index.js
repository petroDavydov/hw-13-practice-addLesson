import { getPictures } from "./services/apiService";
import cardTmp from "./templates/cardTmp.hbs";
import * as basicLightbox from "basiclightbox";
// ==========
const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

// ==============

const refs = {
  form: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  loadMore: document.querySelector("#load-more"),
};

const state = { page: 1, value: "" };
refs.loadMore.style.visibility = "hidden";

refs.form.addEventListener("submit", onSearch);
refs.loadMore.addEventListener("click", onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  refs.loadMore.style.visibility = "hidden";
  if (!e.currentTarget.elements.query.value.trim()) {
    return;
  }
  try {
    state.value = e.currentTarget.elements.query.value;
    const pictures = await getPictures(state.value, state.page);
    refs.gallery.innerHTML = cardTmp(pictures);
    if (pictures.length > 11) {
      refs.loadMore.style.visibility = "visible";
    }
    if (!pictures.length) {
      console.log("Nothing find😒");
    }
  } catch (error) {
    console.log(error.message);
  }
}

// ==Load More Button==

async function onLoadMore() {
  state.page += 1;
  const pictures = await getPictures(state.value, state.page);
  refs.gallery.insertAdjacentHTML("beforeend", cardTmp(pictures));
  if (state.page === 2) {
    const observer = new IntersectionObserver(onLoadMore, options);
    observer.observe(refs.loadMore);
  }
  //   refs.gallery.scrollIntoView({
  //     behavior: "smooth",
  //     block: "end",
  //   });
}

// =====Light BOx

refs.gallery.addEventListener("click", onOpenGallery);

function onOpenGallery(e) {
  if (e.target.nodeName !== "IMG") {
    return;
  }

  basicLightbox
    .create(
      `
    <img src="${e.target.dataset.source}" width="800" height="600">
`
    )
    .show();
}
