class FormulaCalculator {
  constructor() {
    this.formulaElements = document.querySelectorAll("formula");
    this.inputElements = document.querySelectorAll("input");
    this.submitBtn = document.getElementById("submit-btn");
    this.alert = document.getElementById("alert");
    this.initialize();
  }

  initialize() {
    this.inputElements.forEach((input) => {
      input.addEventListener("input", () => this.updateAllFormulas());
    });

    this.submitBtn.addEventListener("click", () => this.handleSubmit());

    this.updateAllFormulas();
  }

  handleSubmit() {
    this.showAlert();

    this.clearFields();
  }

  showAlert() {
    this.alert.classList.remove("hidden");

    setTimeout(() => {
      this.alert.classList.add("hidden");
    }, 3000);
  }

  clearFields() {
    this.inputElements.forEach((input) => {
      input.value = "";
    });

    this.updateAllFormulas();
  }

  updateAllFormulas() {
    this.formulaElements.forEach((formula) => {
      const evaluator = formula.getAttribute("evaluator");
      const label = formula.getAttribute("data-label");

      if (evaluator) {
        try {
          const result = this.evaluateFormula(evaluator);
          formula.innerHTML = `<strong>${label}:</strong> ${this.formatNumber(
            result
          )}`;
          formula.classList.remove("invalid");
        } catch (error) {
          formula.innerHTML = `<strong>${label}:</strong> <span class="error">Invalid Formula</span>`;
          formula.classList.add("invalid");
        }
      }
    });
  }

  evaluateFormula(formula) {
    const evaluated = formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match) => {
      const input = document.getElementById(match);
      const value = input ? parseFloat(input.value) || 0 : 0;
      return value;
    });

    if (!this.isSafeExpression(evaluated)) {
      throw new Error("Formula is not safe");
    }

    const result = eval(evaluated);
    return Number.isFinite(result) ? result : NaN;
  }

  isSafeExpression(expr) {
    const unsafePatterns = [
      /\.\s*constructor/,
      /[^a-zA-Z0-9+\-*\/%(). ]/,
      /eval|function|new|this|window|document|process|require|import/g,
    ];

    return !unsafePatterns.some((pattern) => pattern.test(expr));
  }

  formatNumber(num) {
    if (isNaN(num)) return "Invalid";
    return `<span class="persian-number">${num.toLocaleString("fa-IR")}</span>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new FormulaCalculator();
});
