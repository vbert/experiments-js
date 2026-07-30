class Livebar {
    static defaultOptions = Object.freeze({
        groupSelector: ".marquee__group",
        minimumGroupWidth: 100,
        minimumAnimationDuration: 1,
        durationCalculationFactor: 15 / 500,
        durationMultiplier: 0.7,
        measurementRetryDelay: 500,
    });

    constructor(options = {}) {
        this.options = {
            ...Livebar.defaultOptions,
            ...options,
        };
    }

    calculateAnimationDuration(groupWidth, speedModifier) {
        const {
            durationCalculationFactor,
            durationMultiplier,
        } = this.options;
        const baseDuration =
            Math.trunc(groupWidth * durationCalculationFactor) *
            durationMultiplier;
        const speedMultiplier =
            speedModifier > -100 ? 1 / (1 + speedModifier / 100) : 1;

        return baseDuration * speedMultiplier;
    }

    updateAnimationDuration() {
        const {
            groupSelector,
            minimumGroupWidth,
            minimumAnimationDuration,
        } = this.options;
        const marqueeGroups = document.querySelectorAll(groupSelector);
        const firstMarqueeGroup = marqueeGroups[0];

        if (!firstMarqueeGroup) {
            return true;
        }

        const { width: groupWidth } = firstMarqueeGroup.getBoundingClientRect();

        if (groupWidth <= minimumGroupWidth) {
            return false;
        }

        const speedModifier =
            Number.parseInt(firstMarqueeGroup.dataset.speedModifier, 10) || 0;
        const animationDuration = this.calculateAnimationDuration(
            groupWidth,
            speedModifier,
        );

        if (animationDuration <= minimumAnimationDuration) {
            return false;
        }

        marqueeGroups.forEach((marqueeGroup) => {
            marqueeGroup.style.animationDuration = `${animationDuration}s`;
        });

        return true;
    }

    initialize() {
        if (this.updateAnimationDuration()) {
            return;
        }

        const measurementIntervalId = window.setInterval(() => {
            const isMeasurementComplete = this.updateAnimationDuration();

            if (isMeasurementComplete) {
                window.clearInterval(measurementIntervalId);
            }
        }, this.options.measurementRetryDelay);
    }
}

window.addEventListener("load", () => new Livebar().initialize(), false);
