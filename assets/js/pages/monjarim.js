document.addEventListener("DOMContentLoaded", function () {
  var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
  var incoming = new URLSearchParams(document.location.search);
  document.querySelectorAll("a[data-ep-cta='true']").forEach(function (anchor) {
    var href = anchor.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return;
    try {
      var url = new URL(href, document.baseURI);
      keys.forEach(function (key) {
        if (incoming.has(key) && !url.searchParams.has(key)) url.searchParams.set(key, incoming.get(key));
      });
      anchor.setAttribute("href", url.toString());
    } catch (error) {}
  });

  document.querySelectorAll("[data-ep-countdown]").forEach(function (node) {
    var minutes = Math.max(1, Number(node.getAttribute("data-ep-countdown") || "15"));
    var remaining = minutes * 60;
    var render = function () {
      var min = String(Math.floor(remaining / 60)).padStart(2, "0");
      var sec = String(remaining % 60).padStart(2, "0");
      node.textContent = min + ":" + sec;
      remaining = Math.max(0, remaining - 1);
    };
    render();
    window.setInterval(render, 1000);
  });
});