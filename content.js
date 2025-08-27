(function () {
  const isMarketplaceAd = /^\/threads\/[^/]+\.\d+\/?/.test(location.pathname);
  if (!isMarketplaceAd) return;

  const buildFollowUrl = () => {
    const p = location.pathname.endsWith("/") ? location.pathname : location.pathname + "/";
    return location.origin + p + "watch";
  };

  function hasFollow(ul) {
    return [...ul.querySelectorAll("a")].some(a => a.textContent.trim().toLowerCase() === "follow");
  }
  function looksLikePostMenu(ul) {
    const texts = [...ul.querySelectorAll("a")].map(a => a.textContent.trim().toLowerCase());
    return texts.includes("report") && texts.includes("only show this user");
  }
  function injectFollowIntoUl(ul) {
    if (hasFollow(ul)) return;
    const exemplar = ul.querySelector("a.menu-linkRow") || ul.querySelector("a");
    if (!exemplar) return;
    const follow = document.createElement("a");
    follow.textContent = "Follow";
    follow.href = buildFollowUrl();
    follow.className = exemplar.className;
    follow.setAttribute("data-menu-closer", "true");
    follow.setAttribute("role", "menuitem");
    follow.setAttribute("qid", "post-actionbar-follow");
    follow.removeAttribute("rel"); follow.removeAttribute("data-xf-click");
    follow.removeAttribute("title"); follow.removeAttribute("target");
    ul.appendChild(follow);
  }
  function processMenus(root = document) {
    const uls = root.querySelectorAll(
      'div.menu.menu--post[aria-hidden="false"] div.menu-content ul.listPlain.listColumns--narrow, ' +
      'div.menu-content ul.listPlain.listColumns--narrow'
    );
    for (const ul of uls) { if (looksLikePostMenu(ul)) injectFollowIntoUl(ul); }
  }
  const obs = new MutationObserver(() => processMenus());
  obs.observe(document.documentElement, { childList: true, subtree: true });
  const kick = () => setTimeout(processMenus, 0);
  document.addEventListener("pointerdown", kick, true);
  document.addEventListener("click", kick, true);
  processMenus();
})();