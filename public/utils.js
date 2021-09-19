export function createInput(type, placeholder, name, required = false) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  input.required = required;

  return input;
}

export function createLabel(htmlFor, text) {
  const label = document.createElement("label");
  label.textContent = text;
  label.htmlFor = htmlFor;
  return label;
}

const Utils = {
  createInput: createInput,
  createLabel: createLabel,
};

export default Utils;