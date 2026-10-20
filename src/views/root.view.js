import * as component from "../components/element.component.js";

const style = "/styles/root.style.css";

const manifest = "/assets/json/manifest.json";

const render = () => {
  const head = component.element(
    "head",
    {},
    component.element("meta", {charset: "utf-8"}),
    component.element("meta", {name: "viewport", content: "width=device-width, initial-scale=1"}),
    component.element("link", {rel: "stylesheet", href: style}),
    component.element("link", {rel: "manifest", href: manifest})
  );
  const body = component.element("body", {});
  return component.element("html", {lang: "en"}, head, body);
};

export {
  render
};
