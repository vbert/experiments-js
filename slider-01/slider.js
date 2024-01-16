class Slider {
    constructor(query, opts) {
        this.slider = document.querySelector(query); //element slider
        this.slides = [...this.slider.querySelectorAll(".slider-slide")];
        this.time = null; //tutaj będziemy podczepiać setTimeout
        this.currentSlide = Math.max(0, this.slides.findIndex(el => el.classList.contains("is-active"))); //aktualny slide

        const defaultOpts = {
            pauseTime: 0,
            prevText: "Poprzedni slajd",
            nextText: "Następny slajd",
            generateDots: true,
            generatePrevNext: true
        };
        this.options = {...defaultOpts, ...opts};
        this.autoChangeSlides = typeof this.options.pauseTime === "number" && this.options.pauseTime > 0;

        if (this.options.generatePrevNext) this.createPrevNext();
        if (this.options.generateDots) this.createPagination();
        if (this.autoChangeSlides) {
            this.handleMouseEnter();
        }
        this.setSlide(this.currentSlide);
    }

    slidePrev() {
        this.currentSlide--;
        if (this.currentSlide < 0) {
            this.currentSlide = this.slides.length - 1;
        }
        this.setSlide(this.currentSlide);
    }

    slideNext() {
        this.currentSlide++;
        if (this.currentSlide > this.slides.length - 1) {
            this.currentSlide = 0;
        }
        this.setSlide(this.currentSlide);
    }

    setSlide(index) {
        this.slides.forEach(slide => {
            slide.classList.remove("is-active");
        });

        //dodajemy jÄ tylko wybranemu
        this.slides[index].classList.add("is-active");

        //podobny manewr robimy dla kropek
        if (this.options.generateDots) {
            const dots = [...this.dots.children];
            dots.forEach(dot => dot.classList.remove("is-active"));
            dots[index].classList.add("is-active");
        }

        //aktualny slide przestawiamy na wybrany
        this.currentSlide = index;

        if (this.autoChangeSlides) {
            clearTimeout(this.time);
            this.time = setTimeout(() => this.slideNext(), this.options.pauseTime)
        }
    }

    createPrevNext() {
        this.btnPrev = document.createElement("button");
        this.btnPrev.type = "button";
        this.btnPrev.innerText = this.options.prevText;
        this.btnPrev.classList.add("slider-button", "slider-button-prev");
        this.btnPrev.addEventListener("click", this.slidePrev.bind(this));

        this.btnNext = document.createElement("button");
        this.btnNext.type = "button";
        this.btnNext.innerText = this.options.nextText;
        this.btnNext.classList.add("slider-button", "slider-button-next");
        this.btnNext.addEventListener("click", this.slideNext.bind(this));

        const nav = document.createElement("div");
        nav.classList.add("slider-nav");
        this.slider.append(this.btnPrev);
        this.slider.append(this.btnNext);
        this.slider.append(nav);
    }

    createPagination() {
        this.dots = document.createElement("div");
        this.dots.classList.add("slider-pagination");

        //tworzymy pętlę w ilości liczby slajdów
        this.slides.forEach((el, i) => {
            const btn = document.createElement("button");
            btn.classList.add("slider-pagination-button");
            btn.type = "button";
            btn.innerText = i + 1;
            btn.addEventListener("click", () => this.setSlide(i));
            this.dots.append(btn);
        });

        this.slider.append(this.dots);
    }

    handleMouseEnter() {
        this.slider.addEventListener("mouseenter", () => clearTimeout(this.time));

        this.slider.addEventListener("mouseout", () => {
            clearTimeout(this.time);
            this.time = setTimeout(() => this.slideNext(), 6000);
        })
    }
}
