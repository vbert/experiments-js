function initCalculator(root) {
    root.innerHTML = `
        <div class="display" aria-live="polite">
            <div class="expression"></div>
            <div class="result">0</div>
        </div>
        <div class="buttons">
            <button class="clear-button" data-action="clear">C</button>
            <button class="operator" data-value="/">/</button>
            <button class="operator" data-value="*">×</button>
            <button data-action="delete">⌫</button>
            <button data-value="7">7</button><button data-value="8">8</button><button data-value="9">9</button><button class="operator" data-value="-">-</button>
            <button data-value="4">4</button><button data-value="5">5</button><button data-value="6">6</button><button class="operator" data-value="+">+</button>
            <button data-value="1">1</button><button data-value="2">2</button><button data-value="3">3</button><button class="operator equals" data-action="calculate">=</button>
            <button class="zero" data-value="0">0</button><button data-value=".">.</button>
        </div>`;
    const expressionDisplay = root.querySelector(".expression");
    const resultDisplay = root.querySelector(".result");
    let expression = "", completedExpression = "", justCalculated = false;

    function render() {
        resultDisplay.classList.remove("error");
        expressionDisplay.textContent = (justCalculated ? completedExpression : expression).replace(/\*/g, "×");
        const match = expression.match(/([0-9.]+)(?:[+\-*/])?$/);
        resultDisplay.textContent = justCalculated ? expression : (match ? match[1] : "0");
    }

    function append(value) {
        if (justCalculated && /[0-9.]/.test(value)) expression = "";
        if (justCalculated && /[+\-*/]/.test(value)) expression += value;
        justCalculated = false;
        if (/[+\-*/]/.test(value) && /[+\-*/]$/.test(expression)) expression = expression.slice(0, -1) + value;
        else if (value === "." && /(?:^|[+\-*/])\d*\.\d*$/.test(expression)) return;
        else expression += value;
        render();
    }

    function clear() {
        expression = completedExpression = "";
        justCalculated = false;
        render();
    }

    function removeLast() {
        expression = expression.slice(0, -1);
        justCalculated = false;
        render();
    }

    function calculate() {
        if (!expression || /[+\-*/.]$/.test(expression)) return;
        try {
            const calculation = expression.startsWith("-") ? `0${expression}` : expression;
            const tokens = calculation.match(/(?:\d+(?:\.\d*)?|\.\d+)|[+\-*/]/g);
            const numbers = [Number(tokens[0])], operators = [];

            for (let i = 1; i < tokens.length; i += 2) {
                const operator = tokens[i], right = Number(tokens[i + 1]);

                if (operator === "*" || operator === "/") {
                    const left = numbers.pop();
                    numbers.push(operator === "*" ? left * right : left / right);
                } else {
                    operators.push(operator);
                    numbers.push(right);
                }
            }
            let total = numbers[0];

            for (let i = 0; i < operators.length; i++) {
                total = operators[i] === "+" ? total + numbers[i + 1] : total - numbers[i + 1];
            }

            if (!Number.isFinite(total)) throw Error("Nie można dzielić przez zero");

            completedExpression = expression; expression = String(Number(total.toFixed(10))); justCalculated = true; render();
        } catch (error) {
            resultDisplay.textContent = error.message;
            resultDisplay.classList.add("error");
        }
    }

    root.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.dataset.value) append(button.dataset.value);
        else if (button.dataset.action === "clear") clear();
        else if (button.dataset.action === "delete") removeLast();
        else if (button.dataset.action === "calculate") calculate();
    });

    root.addEventListener("keydown", event => {
        if (/^[0-9.]$/.test(event.key) || /^[+\-*/]$/.test(event.key)) append(event.key);
        else if (event.key.toLowerCase() === "x") append("*");
        else if (event.key === "Enter" || event.key === "=") calculate();
        else if (event.key === "Backspace") removeLast();
        else if (event.key === "Escape") clear();
    });

    render();

    return { clear, calculate };
}

document.querySelectorAll("[data-calculator]").forEach(initCalculator);
