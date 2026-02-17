/**
 * LibraryInit – Reusable utility for Air Datepicker & Tom Select.
 * Provides consistent defaults, verde-renacer themed, with instance tracking for cleanup.
 */
export const LibraryInit = {
    _datepickerInstances: [],
    _tomSelectInstances: [],

    /**
     * Initialize Air Datepicker on one or more selectors.
     * @param {string|string[]} selectors  CSS selectors for the date inputs.
     * @param {object} options  Air Datepicker overrides.
     */
    initDatePickers(selectors, options = {}) {
        const sels = Array.isArray(selectors) ? selectors : [selectors];

        // Inline Spanish Locale for Air Datepicker
        const localeEs = {
            days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            daysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            today: 'Hoy',
            clear: 'Limpiar',
            dateFormat: 'dd/MM/yyyy',
            timeFormat: 'HH:mm',
            firstDay: 1
        };

        sels.forEach(sel => {
            try {
                const el = document.querySelector(sel);
                if (!el || !window.AirDatepicker) return;

                // Prevent duplicate initialization
                if (el.dataset.datepickerInitialized) return;

                // Fix: Change type to text to prevent native browser calendar conflict
                // and add readonly to force use of the custom calendar only
                el.type = 'text';
                el.setAttribute('readonly', 'true');
                el.style.backgroundColor = '#fff'; // Ensure white background
                el.style.cursor = 'pointer';

                const dpOptions = {
                    locale: localeEs,
                    dateFormat: 'dd/MM/yyyy',
                    autoClose: true,
                    isMobile: false,
                    position: 'bottom left',
                    ...options
                };

                // If container is provided as a selector, try to find it
                if (typeof dpOptions.container === 'string') {
                    const contEl = document.querySelector(dpOptions.container);
                    if (contEl) dpOptions.container = contEl;
                }

                const dp = new AirDatepicker(el, dpOptions);
                el.dataset.datepickerInitialized = 'true';
                this._datepickerInstances.push(dp);
            } catch (err) {
                console.warn('[LibraryInit] Air Datepicker init failed for', sel, err.message);
            }
        });
    },

    /**
     * Destroy a datepicker on a specific selector.
     */
    destroyDatePicker(selector) {
        const el = document.querySelector(selector);
        if (!el) return;

        const instanceIndex = this._datepickerInstances.findIndex(dp => dp.$el === el);
        if (instanceIndex !== -1) {
            try {
                this._datepickerInstances[instanceIndex].destroy();
                this._datepickerInstances.splice(instanceIndex, 1);
            } catch (e) { }
        }
        delete el.dataset.datepickerInitialized;
    },

    /**
     * Initialize Tom Select on one or more selectors.
     * @param {string|string[]} selectors  CSS selectors for the <select> elements.
     * @param {object} options  Tom Select overrides.
     */
    initSelects(selectors, options = {}) {
        const sels = Array.isArray(selectors) ? selectors : [selectors];
        sels.forEach(sel => {
            const el = document.querySelector(sel);
            if (!el || !window.TomSelect) return;
            // Avoid double-init
            if (el.tomselect) return;

            const ts = new TomSelect(el, {
                controlInput: null,  // no search by default for simple selects
                allowEmptyOption: true,
                ...options
            });
            this._tomSelectInstances.push(ts);
        });
    },

    /**
     * Destroy all tracked instances (call on page/component destroy).
     */
    destroyAll() {
        this._datepickerInstances.forEach(dp => {
            try { dp.destroy(); } catch (e) { /* already destroyed */ }
        });
        this._datepickerInstances = [];

        this._tomSelectInstances.forEach(el => {
            try {
                if (el.tomselect) el.tomselect.destroy();
            } catch (e) { /* already destroyed */ }
        });
        this._tomSelectInstances = [];
    }
};
