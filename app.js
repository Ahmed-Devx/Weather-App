function showSection(id, el) {
  document
    .querySelectorAll(".content-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.getElementById("section-title").innerText = el.innerText;
  document
    .querySelectorAll(".nav-link")
    .forEach((n) => n.classList.remove("active"));
  el.classList.add("active");
  sidebar.classList.remove("active");
}

const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const sidebar = document.querySelector(".sidebar");

menuBtn.onclick = () => sidebar.classList.add("active");
closeBtn.onclick = () => sidebar.classList.remove("active");

const toggle = document.getElementById("theme-toggle");
toggle.onchange = () => {
  const theme = toggle.checked ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);

  const table = document.querySelector("table");
  if (theme === "light") table.classList.replace("table-dark", "table-light");
  else table.classList.replace("table-light", "table-dark");
};
