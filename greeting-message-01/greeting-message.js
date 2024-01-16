/*
 * Project: components
 * File: /greeting-message.js
 * File Created: 2023-12-28, 22:08:05
 * Author: Wojciech Sobczak (wsobczak@gmail.com)
 * -----
 * Last Modified: 2023-12-28, 23:22:25
 * Modified By: Wojciech Sobczak (wsobczak@gmail.com)
 * -----
 * Copyright © 2021 - 2023 by vbert
 */
((window) => {

    /**
     * GreetingMessage
     */
    class GreetingMessage extends HTMLElement {
        /**
         * Creates an instance of GreetingMessage.
         */
        constructor() {
            // Always call super first in constructor
            super();

            this.shadow = this.attachShadow({ mode: 'open' });
        }

        get message() {
            return this.getAttribute('message');
        }

        set message(value) {
            this.setAttribute('message', value);
        }

        static get observedAttributes() {
            return ['message'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            this.render();
            let messageInput = this.shadow.querySelector('#messageInput');
            messageInput.addEventListener('change', this.changeMessage.bind(this));
        }

        changeMessage(event) {

            console.log(event.target.value);

            this.setAttribute('message', event.target.value);
        }

        /**
         * Called when the element is added to the DOM
         */
        connectedCallback() {
            this.render();
        }

        /**
         * Called when the element is removed from the DOM
         */
        disconnectedCallback() {
            
        }

        render() {
            this.shadow.innerHTML = `
            <style>
                button {
                    padding: 8px 16px;
                    background-color: red;
                    font-size: 24px;
                }
                h2 {
                    padding: 8px 16px;
                    background-color: yellow;
                    color: gray;
                    font-size: 32px;
                    text-align: center;
                }
                input {
                    max-width: 100%;
                }
            </style>
            <div>
                <button>Witaj tutaj!</button>
            </div>
            <div>
                <input type="text" id="messageInput" value="${this.message}" placeholder="Wpisz wiadomosść" />
            </div>
            <h2 id="messageID" aria-live="polite">${this.message}</h2>`;
        }
    }

    if ('customElements' in window) {
        window.customElements.define('greeting-message', GreetingMessage);
    }
})(window || this);
