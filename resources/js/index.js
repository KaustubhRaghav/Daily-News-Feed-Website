function addCard(obj, index) {
  let carouselItem = document.createElement("div");
  let anchorTag = document.createElement("a");
  let cardParent = document.createElement("div");
  let cardImage = document.createElement("img");
  let cardBody = document.createElement("div");
  let newsHeading = document.createElement("h5");
  let authorAndDateContainer = document.createElement("div");
  let author = document.createElement("small");
  let circleText = document.createElement("div");
  let publicationDate = document.createElement("small");
  let descPara = document.createElement("p");

  if (index === 0) carouselItem.classList.add("active");

  carouselItem.classList.add("carousel-item");
  carouselItem.setAttribute("data-bs-interval", "9999999");
  anchorTag.classList.add("text-decoration-none");
  anchorTag.setAttribute("href", obj.link);
  anchorTag.setAttribute("target", "_blank");
  cardParent.classList.add("card");
  cardImage.classList.add("format-card-img");
  cardImage.setAttribute("src", obj.enclosure.link);
  cardImage.setAttribute("alt", obj.content);
  cardBody.classList.add("card-body");
  newsHeading.classList.add("text-dark", "fw-bold");
  author.classList.add("text-secondary", "me-2");
  circleText.classList.add("circle", "me-2");
  publicationDate.classList.add("text-secondary");
  descPara.classList.add("text-dark");

  newsHeading.textContent = obj.title;
  author.textContent = obj.author;
  let displayDateFormat = new Date(obj.pubDate).toLocaleDateString("en-US");
  publicationDate.textContent = displayDateFormat;
  descPara.textContent = obj.description;

  authorAndDateContainer.append(author, circleText, publicationDate);
  cardBody.append(newsHeading, authorAndDateContainer, descPara);
  cardParent.append(cardImage, cardBody);
  anchorTag.append(cardParent);
  carouselItem.append(anchorTag);

  return carouselItem;
}

function addNewsCarousel(newsObj, count) {
  let carouselParent = document.createElement("div");
  let carouselInner = document.createElement("div");
  let carouselControlPrev = document.createElement("button");
  let prevIcon = document.createElement("span");
  let prevText = document.createElement("span");
  let carouselControlNext = document.createElement("button");
  let nextIcon = document.createElement("span");
  let nextText = document.createElement("span");

  carouselParent.setAttribute("id", `newsCarousel${count}`);
  carouselParent.classList.add("carousel", "carousel-dark", "slide");
  carouselParent.setAttribute("data-bs-ride", "carousel");

  carouselInner.classList.add("carousel-inner");

  carouselControlPrev.classList.add("carousel-control-prev");
  carouselControlPrev.setAttribute("type", "button");
  carouselControlPrev.setAttribute("data-bs-target", `#newsCarousel${count}`);
  carouselControlPrev.setAttribute("data-bs-slide", "prev");

  prevIcon.classList.add("carousel-control-prev-icon");
  prevIcon.setAttribute("aria-hidden", "true");
  prevText.classList.add("visually-hidden");

  carouselControlNext.classList.add("carousel-control-next");
  carouselControlNext.setAttribute("type", "button");
  carouselControlNext.setAttribute("data-bs-target", `#newsCarousel${count}`);
  carouselControlNext.setAttribute("data-bs-slide", "next");

  nextIcon.classList.add("carousel-control-next-icon");
  nextIcon.setAttribute("aria-hidden", "true");
  nextText.classList.add("visually-hidden");

  prevText.textContent = "Previous";

  nextText.textContent = "Next";

  carouselControlPrev.append(prevIcon, prevText);

  carouselControlNext.append(nextIcon, nextText);

  newsObj.items.forEach((obj, index) => {
    let newsCard = addCard(obj, index);
    carouselInner.append(newsCard);
  });

  carouselParent.append(
    carouselInner,
    carouselControlPrev,
    carouselControlNext
  );

  return carouselParent;
}

function insertAccordionItem(newsObj, index) {
  let accordionItem = document.createElement("div");
  let accordionHeader = document.createElement("h2");
  let accordionButton = document.createElement("button");
  let collapseAccordion = document.createElement("div");
  let accordionBody = document.createElement("div");
  let carousel = addNewsCarousel(newsObj, index);

  accordionItem.classList.add("accordion-item");

  accordionHeader.classList.add("accordion-header");
  accordionHeader.setAttribute("id", `heading${index}`);

  accordionButton.classList.add("accordion-button", "fw-bold");

  if (index !== 0) accordionButton.classList.add("collapsed");

  accordionButton.setAttribute("type", "button");
  accordionButton.setAttribute("data-bs-toggle", "collapse");
  accordionButton.setAttribute("data-bs-target", `#collapse${index}`);
  accordionButton.setAttribute("aria-expanded", "true");
  accordionButton.setAttribute("aria-controls", `collapse${index}`);

  collapseAccordion.setAttribute("id", `collapse${index}`);
  collapseAccordion.classList.add("accordion-collapse", "collapse");

  if (index === 0) collapseAccordion.classList.add("show");

  collapseAccordion.setAttribute("aria-labelledby", `heading${index}`);
  collapseAccordion.setAttribute("data-bs-parent", "#dailyNewsAccordion");

  accordionBody.classList.add("accordion-body");

  accordionHeader.append(accordionButton);
  accordionBody.append(carousel);
  collapseAccordion.append(accordionBody);
  accordionItem.append(accordionHeader, collapseAccordion);

  accordionButton.textContent = newsObj.feed.title;

  return accordionItem;
}

let newsFeedAccordion = document.getElementById("newsAccordion");

let accordionParent = document.createElement("div");
accordionParent.classList.add("accordion");
accordionParent.setAttribute("id", "dailyNewsAccordion");

function createNewsFeedAccordion(resObj, index) {
  let itemAccordion = insertAccordionItem(resObj, index);
  accordionParent.append(itemAccordion);

  newsFeedAccordion.append(accordionParent);
}

function loadAPIs() {
  let jsonAPIArray = magazines.map(
    (api) => `https://api.rss2json.com/v1/api.json?rss_url=${api}`
  );
  let count = -1;

  try {
    jsonAPIArray.forEach(async (api) => {
      let responseBody = await fetch(api);
      let responseObj = await responseBody.json();
      createNewsFeedAccordion(responseObj, ++count);
    });
  } catch (error) {
    throw error;
  }
}

loadAPIs();
