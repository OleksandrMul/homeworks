// Строгий режим
"use strict"

window.addEventListener('load', windowLoad)

let isMobile

function windowLoad() {
	isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
	isMobile.any() ? document.body.setAttribute('data-touch', '') : null

	document.addEventListener('click', documentActions)
	document.addEventListener('input', documentActions)

	const coundown = document.querySelectorAll('[data-coundown]')
	coundown.length ? initCoundown(coundown) : null

	const priceFilter = document.querySelector('.price-filter')
	priceFilter ? priceFilterInit() : null

	const parallaxItems = document.querySelectorAll('[data-parallax]')
	parallaxItems.length ? parallaxInit(parallaxItems) : null

	dynamicAdaptHeader();
	dynamicAdaptFilter();
	slidersInit();
}
function dynamicAdaptHeader() {
	const topHeader = document.querySelector('.top-header')
	const header = document.querySelector('.header')
	const menu = document.querySelector('.menu')

	const phoneHeader = document.querySelector('.bottom-header__phone')
	const searchHeader = document.querySelector('.search-header')

	const bottomContainer = document.querySelector('.bottom-header__container')
	const actionsHeader = document.querySelector('.actions-header')
	const placeSearch = document.querySelector('.body-header__place-search')

	if (header) {
		const media = window.matchMedia("(max-width: 767.98px)")
		media.addEventListener("change", (e) => {
			dynamicAdaptHeaderInit(media)
		})
		dynamicAdaptHeaderInit(media)
	}

	function dynamicAdaptHeaderInit(media) {
		if (media.matches) {
			bottomContainer.insertAdjacentElement('beforeend', searchHeader)
			actionsHeader.insertAdjacentElement('beforeend', phoneHeader)
			menu.insertAdjacentElement('beforeend', topHeader)
		} else {
			bottomContainer.insertAdjacentElement('beforeend', phoneHeader)
			placeSearch.insertAdjacentElement('beforeend', searchHeader)
			header.insertAdjacentElement("afterbegin", topHeader)
		}
		searchHeader.classList.toggle('--dynamic', media.matches)
		phoneHeader.classList.toggle('--dynamic', media.matches)
	}
}
function dynamicAdaptFilter() {
	const filter = document.querySelector('.filter');
	const filterPlace = document.querySelector('.header-catalog__filter');
	const catalogBody = document.querySelector('.catalog__body');
	if (filter) {
		const media = window.matchMedia("(max-width: 767.98px)")
		media.addEventListener("change", (e) => {
			dynamicAdaptFilterInit(media)
		})
		dynamicAdaptFilterInit(media)
	}
	function dynamicAdaptFilterInit(media) {
		if (media.matches) {
			filterPlace.insertAdjacentElement('beforeend', filter)
		} else {
			catalogBody.insertAdjacentElement('afterbegin', filter)
		}
	}
}
function documentActions(e) {
	const eventType = e.type
	const targetElement = e.target
	if (eventType === 'click') {
		if (isMobile.any()) {
			if (targetElement.closest('.menu__button')) {
				const subMenu = targetElement.closest('.menu__button').nextElementSibling
				if (subMenu) {
					subMenu.closest('.menu__item').classList.toggle('--active')
				}
			} else {
				const menuItemActive = document.querySelectorAll('.menu__item.--active')
				if (menuItemActive.length) {
					menuItemActive.forEach(menuItemActiveItem => {
						menuItemActiveItem.classList.remove('--active')
					});

				}
			}
		}
		if (targetElement.closest('.icon-menu')) {
			document.body.classList.toggle('scroll-lock')
			document.documentElement.classList.toggle('open-menu')
		}
		if (targetElement.closest('.header-catalog__button')) {
			document.documentElement.classList.toggle('open-filter')
		}
		if (targetElement.closest('.add-to-cart')) {
			const button = targetElement.closest('.add-to-cart')
			const productItem = button.closest('.item-products')
			const productImage = productItem.querySelector('.item-products__image')
			const cartHeader = document.querySelector('.cart-header__icon span')
			flyImage(productImage, cartHeader)
		}
		if (targetElement.closest('.quantity__button')) {
			const button = targetElement.closest('.quantity__button')
			const quantity = button.parentElement
			const input = quantity.querySelector('input')
			let inputValue = +input.value
			// if (button.classList.contains('quantity__button--icon-minus')) {
			// 	--inputValue
			// } else {
			// 	++inputValue
			// }
			button.classList.contains('quantity__button--icon-minus') ? --inputValue : ++inputValue
			input.value = inputValue <= 0 ? 1 : inputValue
		}
		if (targetElement.closest('.tabs-product__button')) {
			const tabButton = targetElement.closest('.tabs-product__button')
			if (!tabButton.classList.contains('tabs-product__button--active')) {
				const activeTab = document.querySelector('.body-tabs-product__item--active')
				const activeNavTab = document.querySelector('.tabs-product__button--active')
				activeTab ? activeTab.classList.remove('body-tabs-product__item--active') : null
				activeNavTab ? activeNavTab.classList.remove('tabs-product__button--active') : null

				const navParent = tabButton.parentElement.parentElement
				tabButton.classList.add('tabs-product__button--active')
				const activeTabIndex = indexInParent(navParent, tabButton.parentElement)
				const tabs = document.querySelectorAll('.body-tabs-product__item')
				tabs[activeTabIndex].classList.add('body-tabs-product__item--active')
			}
		}

	} else if (eventType === 'input') {
		if (targetElement.classList.contains('quantity__input')) {
			targetElement.value <= 0 ? targetElement.value = 1 : null
		}
	}
}
function flyImage(productImage, cartHeader) {
	const flyImg = document.createElement('img')
	const speed = +productImage.dataset.speed || 1300

	flyImg.src = productImage.src
	flyImg.style.cssText = `
		position:absolute;
		z-index:60;
		transition-duration:${speed}ms;
		width: ${productImage.offsetWidth}px;
		left: ${productImage.getBoundingClientRect().left + scrollX}px;
		top:${productImage.getBoundingClientRect().top + scrollY}px;
	`
	document.body.insertAdjacentElement('beforeend', flyImg)

	flyImg.style.left = `${cartHeader.getBoundingClientRect().left + scrollX}px`
	flyImg.style.top = `${cartHeader.getBoundingClientRect().top + scrollY}px`
	flyImg.style.width = `10px`
	// flyImg.style.opacity = `0.2`

	setTimeout(() => {
		flyImg.remove()
		cartHeader.innerHTML = +cartHeader.innerHTML + 1
	}, speed);
}
function initCoundown(coundown) {
	coundown.forEach(coundownItem => {
		initCoundownItem(coundownItem)
	});
}
function initCoundownItem(coundownItem) {
	const goalTime = coundownItem.dataset.coundown
	if (goalTime) {
		const coundownItemSpans = coundownItem.querySelectorAll('.countdown__digits span')
		const timeGoal = Date.parse(goalTime)
		let timer = setInterval(() => {
			let timeLeft = timeGoal - Date.now()

			if (timeLeft >= 0) {
				const MSECONDS_PER_DAY = 1000 * 60 * 60 * 24
				const MSECONDS_PER_HOUR = 1000 * 60 * 60
				const MSECONDS_PER_MIN = 1000 * 60
				const MSECONDS_PER_SEC = 1000

				const days = Math.floor(timeLeft / MSECONDS_PER_DAY)
				const hours = Math.floor((timeLeft % MSECONDS_PER_DAY) / MSECONDS_PER_HOUR)
				const minutes = Math.floor((timeLeft % MSECONDS_PER_HOUR) / MSECONDS_PER_MIN)
				const seconds = Math.floor((timeLeft % MSECONDS_PER_MIN) / MSECONDS_PER_SEC)

				coundownItemSpans[0].innerHTML = String(days).padStart(2, "0")
				coundownItemSpans[1].innerHTML = String(hours).padStart(2, "0")
				coundownItemSpans[2].innerHTML = String(minutes).padStart(2, "0")
				coundownItemSpans[3].innerHTML = String(seconds).padStart(2, "0")
			} else {
				clearInterval(timer)
			}

		}, 1000)
	}
}
function slidersInit() {
	if (document.querySelector('.slider-reviews')) {
		const sliderReviews = new Swiper('.slider-reviews', {
			loop: true,
			// Navigation arrows
			navigation: {
				nextEl: '.block-header__slider-arrow--right',
				prevEl: '.block-header__slider-arrow--left',
			},
			breakpoints: {
				320: {
					slidesPerView: 1.1,
					spaceBetween: 10,
				},
				600: {
					slidesPerView: 1.4,
					spaceBetween: 15,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				1050: {
					slidesPerView: 3,
					spaceBetween: 24,
				},
			},
		});
	}
	if (document.querySelector('.gallery-product')) {
		const sliderProductThumbs = new Swiper('.thumbs-gallery-product__slider', {
			loop: true,
			spaceBetween: 12,
			// Navigation arrows
			navigation: {
				nextEl: '.thumbs-gallery-product__arrow--down',
				prevEl: '.thumbs-gallery-product__arrow--up',
			},
			breakpoints: {
				320: {
					slidesPerView: 3,
				},
				550: {
					direction: "vertical",
					slidesPerView: 4,
				}
			},
		})
		const sliderProductMain = new Swiper('.main-gallery-product', {
			loop: true,
			speed: 300,
			slidesPerView: 1,
			effect: "fade",
			zoom: {
				enable: true,
				maxRatio: 5,
				panOnMouseMove: true,
			},
			thumbs: {
				swiper: sliderProductThumbs,
			}
		})
		/*
		sliderProductThumbs.on('click', function (e) {
			const clickedSlide = e.clickedSlide
			if (clickedSlide) {
				const clickedIndex = +clickedSlide.dataset.swiperSlideIndex
				sliderProductMain.slideTo(clickedIndex, 300)
				const activeSlide = document.querySelector('.thumbs-gallery-product__slide.active')
				activeSlide ? activeSlide.classList.remove('active') : null
				clickedSlide.classList.add('active')
			}
		});
		const activeSlide = document.querySelector('.thumbs-gallery-product__slide.swiper-slide-active')
		activeSlide ? activeSlide.classList.add('active') : null
		*/
		// sliderProductThumbs.controller.control = sliderProductMain
		// sliderProductMain.controller.control = sliderProductThumbs
	}
}
function priceFilterInit() {
	const priceFilterSlider = document.querySelector('.price-filter__slider')
	noUiSlider.create(priceFilterSlider, {
		start: [20, 80],
		connect: true,
		range: {
			'min': 0,
			'max': 100
		}
	});

	const priceValue = document.querySelector('.price-filter__value')
	let priceInputFrom = document.querySelector('.price-filter__from')
	let priceInputTo = document.querySelector('.price-filter__to')

	priceFilterSlider.noUiSlider.on('update', function (values, handle) {
		priceValue.innerHTML = values.join(' — ')

		priceInputFrom.value = values[0]
		priceInputTo.value = values[1]
	});
}
function indexInParent(parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
}

function parallaxInit(parallaxItems) {
	window.addEventListener('scroll', windowScroll)

	function windowScroll() {
		const currentItems = document.querySelectorAll('.parallax')
		if (currentItems.length) {
			currentItems.forEach(currentItem => {
				const parallaxItem = currentItem.querySelector('[data-parallax-item]')
				if (parallaxItem) {
					const windowHeight = window.innerHeight + currentItem.offsetHeight
					const currentItemHeight = currentItem.offsetHeight
					const topPosition = currentItem.getBoundingClientRect().top + currentItemHeight
					const way = (topPosition / (windowHeight / 2) * 100) - 100
					const diff = (currentItemHeight - parallaxItem.offsetHeight) / parallaxItem.offsetHeight * way
					parallaxItem.style.cssText = `translate: 0 ${diff}%`
				}
			})
		}
	}

	const options = {
		root: null,
		rootMargin: "0px 0px 0px 0px",
		// Відсоток від розміру об'єкту.
		// При появі якого спрацьовує подія
		// Де 0 це будь яка поява
		// 1 це повна поява об'кта в в'юпорті
		threshold: 0,
	}
	const callback = (entries, observer) => {
		entries.forEach(entry => {
			const currentElement = entry.target
			if (entry.isIntersecting) {
				currentElement.classList.add('parallax')
			} else {
				currentElement.classList.remove('parallax')
			}
		})
	}
	const observer = new IntersectionObserver(callback, options)
	parallaxItems.forEach(parallaxItem => {
		observer.observe(parallaxItem)
	})
}

