const apiData = {
  page: 1,
  limit: 6,
  async getData() {
    const res = await fetch(
      `https://alaminsu.github.io/Photo-Gallery/db.json`
    );
    const data = await res.json();
    return data.photos;
  },
};
let limitStart = 0;
let limitEnd = 6;

const UI = {
  selectDom() {
    const collections = document.querySelector(".grid");
    const container = document.querySelector(".popClick");
    const pages = document.querySelector(".pages");
    const first = document.querySelector(".first");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    const last = document.querySelector(".last");

    return {
      collections,
      container,
      pages,
      first,
      prev,
      next,
      last,
    };
  },
  galleryShowToUI(datas) {
    const { collections } = this.selectDom();
    collections.textContent = "";
    let elm = "";
    datas.forEach((data) => {
      elm += `<div class="content" data-id = "${data.id}">
        <img src="pic/${data.src}" class="img" />
        <h3 class="title">${data.title}</h3>
      </div>`;
    });
    collections.insertAdjacentHTML("afterbegin", elm);
  },
  setAttributeDisabled(elm1, elm2) {
    elm1.setAttribute("disabled", "desabled");
    elm2.setAttribute("disabled", "desabled");
  },
  removeAttributeDisabled(elm1, elm2) {
    elm1.removeAttribute("disabled");
    elm2.removeAttribute("disabled");
  },
  async getTotalOfData() {
    apiData.page = 1;
    apiData.limit = 1000;
    const data = await apiData.getData();
    const total = data.length;
    return total;
  },
  async handlePopup() {
    const { container, collections } = this.selectDom();
    const datas = await apiData.getData();
    collections.addEventListener("click", (evt) => {
      if (
        evt.target.classList.contains("img") ||
        evt.target.classList.contains("title")
      ) {
        const id = evt.target.parentElement.dataset.id;
        const data = datas.find((data) => data.id == id);
        let elm = "";
        elm = `<div id="Modal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
          <span class="close">&times;</span>
          <div
            style="
              width: 100%;
              height: 100%;
              text-align: center;
              color: black;
            "
          >
            <img src="pic/${data.src}" width="300" height="400" />
            <h3>${data.title}</h3>
            <p>
            ${data.description}
            </p>
          </div>
        </div>
      </div>`;
        container.insertAdjacentHTML("beforeend", elm);
        const modal = document.querySelector("#Modal");
        const close = document.querySelector(".close");
        modal.style.display = "block";
        close.addEventListener("click", () => {
          container.textContent = "";
          modal.style.display = "none";
        });
      }
    });
  },
  async handlePagination(evt) {
    const { first, prev, next, last } = this.selectDom();
    // let page;
    if (evt.target.classList.contains("first")) {
      limitStart = 0;
      limitEnd = 6;
      // apiData.page = page;
      const galleryData = await apiData.getData();
      this.galleryShowToUI(galleryData.slice(limitStart, limitEnd));
      this.setAttributeDisabled(first, prev);
      this.removeAttributeDisabled(next, last);
      await this.handlePopup();
    } else if (evt.target.classList.contains("prev")) {
      limitStart -= 6;
      limitEnd -= 6;
      // page = Number(apiData.page) - 1;
      // apiData.page = page;
      const galleryData = await apiData.getData();
      this.galleryShowToUI(galleryData.slice(limitStart, limitEnd));
      this.removeAttributeDisabled(next, last);
      if (limitStart === 0) {
        this.setAttributeDisabled(first, prev);
      }
      await this.handlePopup();
    } else if (evt.target.classList.contains("next")) {
      limitStart += 6;
      limitEnd += 6;
      // page = Number(apiData.page) + 1;
      // apiData.page = page;
      const galleryData = await apiData.getData();
      this.galleryShowToUI(galleryData.slice(limitStart, limitEnd));
      this.removeAttributeDisabled(first, prev);
      const total = await this.getTotalOfData();
      // apiData.limit = 6;
      // apiData.page = page;
      if (limitEnd >= total) {
        this.setAttributeDisabled(next, last);
      }
      await this.handlePopup();
    } else if (evt.target.classList.contains("last")) {
      const total = await this.getTotalOfData();
      for (let i = 6; i <= total; i += 6) {
        limitStart = (i / 6) * 6;
        limitEnd = limitStart + 6;
      }
      // apiData.limit = 6;
      // page = Math.ceil(total / 6);
      // apiData.page = page;
      const galleryData = await apiData.getData();
      this.galleryShowToUI(galleryData.slice(limitStart, limitEnd));
      this.removeAttributeDisabled(first, prev);
      this.setAttributeDisabled(next, last);
      await this.handlePopup();
    } else if (evt.target.classList.contains("all")) {
      // apiData.page = 1;
      // apiData.limit = 100;
      const galleryData = await apiData.getData();
      this.galleryShowToUI(galleryData);
      this.setAttributeDisabled(next, last);
      prev.setAttribute("disabled", "disabled");
      first.removeAttribute("disabled");
      await this.handlePopup();
      // apiData.limit = 6;
    }
  },
  async init() {
    const { pages, first, prev } = this.selectDom();
    const galleryData = await apiData.getData();
    this.galleryShowToUI(galleryData.slice(0, 6));
    this.setAttributeDisabled(first, prev);
    pages.addEventListener("click", (evt) => this.handlePagination(evt));
    await this.handlePopup();
  },
};
UI.init();
