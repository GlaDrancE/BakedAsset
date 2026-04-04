import type { Page } from "playwright";

export type InstagramPost = {
  link: string;
  caption: string | null;
};

export type InstagramProfile = {
  username: string | null;
  fullName: string | null;
  biography: string | null;
  followersCount: number | null;
  postsCount: number | null;
  profileImageUrl: string | null;
  /** Post permalinks and captions from embedded profile JSON (or DOM link fallback). */
  posts: InstagramPost[];
};

type RawUser = Record<string, unknown>;

type ScrapedPayload = {
  user: RawUser | null;
  ogTitle: string | null;
  ogImage: string | null;
  ogDescription: string | null;
  domBiography: string | null;
  posts: unknown;
};

/**
 * Runs in the browser only. Kept as a string so tsx/esbuild does not inject `__name` into
 * `page.evaluate(fn)` (which would throw ReferenceError in the page).
 */
const SCRAPE_PROFILE_IN_PAGE = `
(() => {
  function looksLikeProfileUser(o) {
    var username = o.username;
    if (typeof username !== "string" || !/^[a-zA-Z0-9._]+$/.test(username)) return false;
    return (
      o.biography != null ||
      o.biography_with_entities != null ||
      o.full_name != null ||
      o.edge_followed_by != null ||
      o.follower_count != null ||
      o.profile_pic_url_hd != null ||
      o.profile_pic_url != null ||
      o.hd_profile_pic_url_info != null ||
      o.edge_owner_to_timeline_media != null
    );
  }

  function findProfileUser(obj, depth) {
    if (depth > 18 || obj == null) return null;
    if (typeof obj !== "object") return null;
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        var found = findProfileUser(obj[i], depth + 1);
        if (found) return found;
      }
      return null;
    }
    if (looksLikeProfileUser(obj)) return obj;
    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; j++) {
      var v = obj[keys[j]];
      var inner = findProfileUser(v, depth + 1);
      if (inner) return inner;
    }
    return null;
  }

  function meta(prop) {
    var el = document.querySelector('meta[property="' + prop + '"]');
    return el ? el.getAttribute("content") : null;
  }

  var ogTitle = meta("og:title");
  var ogImage = meta("og:image");
  var ogDescription = meta("og:description");

  function tryParse(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  /**
   * Bio is often only in the DOM (JSON biography empty). Matches header blocks like:
   * <div class="xmaf8s6"><span class="_aaco ..." dir="auto">…<br>…</span>… "more" …</span>
   */
  function scrapeBioFromDom() {
    var root = document.querySelector("header") || document.querySelector("main");
    if (!root) return null;

    var spans = root.querySelectorAll('span[dir="auto"]');
    var best = "";
    var i;
    for (i = 0; i < spans.length; i++) {
      var el = spans[i];
      if (el.closest('a[href*="/followers/"]') || el.closest('a[href*="/following/"]')) continue;

      var t = (el.innerText || "").replace(/\\u00a0/g, " ").trim();
      if (!t || t.length < 2) continue;

      var lower = t.toLowerCase();
      if (t === "more" || lower === "follow" || lower === "following" || lower === "message" || lower === "options")
        continue;
      if (/^(followers|following|posts)$/i.test(t)) continue;
      var compact = t.replace(/\\s/g, "");
      if (/^\\d[\\d,.]*([KkMm]|([Kk])(\\s|$))?$/.test(compact) && t.length < 14) continue;

      if (t.length > best.length) best = t;
    }

    if (!best) return null;

    best = best.replace(/\\s*(?:\\.{3}|…)+[\\s\\u00a0]*more\\s*$/i, "").trim();
    best = best.replace(/\\s*\\bmore\\s*$/i, "").trim();
    return best.length ? best : null;
  }

  function captionFromMediaNode(node) {
    if (!node || typeof node !== "object") return null;
    var emc = node.edge_media_to_caption;
    if (!emc || typeof emc !== "object") return null;
    var edges = emc.edges;
    if (!Array.isArray(edges) || !edges.length) return null;
    var first = edges[0];
    if (!first || !first.node || typeof first.node.text !== "string") return null;
    var text = first.node.text.replace(/\\u00a0/g, " ").trim();
    return text.length ? text : null;
  }

  function permalinkFromMediaNode(node) {
    var sc = node.shortcode;
    if (typeof sc !== "string" || !/^[A-Za-z0-9_-]+$/.test(sc)) return null;
    var pt = node.product_type;
    if (pt === "clips") return "https://www.instagram.com/reel/" + sc + "/";
    return "https://www.instagram.com/p/" + sc + "/";
  }

  function extractPostsFromUser(user) {
    var out = [];
    if (!user || typeof user !== "object") return out;
    var edge = user.edge_owner_to_timeline_media;
    if (!edge || typeof edge !== "object") return out;
    var edges = edge.edges;
    if (!Array.isArray(edges)) return out;
    var i;
    for (i = 0; i < edges.length; i++) {
      var e = edges[i];
      var node = e && e.node;
      if (!node || typeof node !== "object") continue;
      var link = permalinkFromMediaNode(node);
      if (!link) continue;
      var cap = captionFromMediaNode(node);
      out.push({ link: link, caption: cap });
    }
    return out;
  }

  function normalizePostLink(href) {
    if (!href || typeof href !== "string") return null;
    var p = href.match(/\\/p\\/([A-Za-z0-9_-]+)/);
    if (p && p[1]) return "https://www.instagram.com/p/" + p[1] + "/";
    var r = href.match(/\\/reel\\/([A-Za-z0-9_-]+)/);
    if (r && r[1]) return "https://www.instagram.com/reel/" + r[1] + "/";
    return null;
  }

  function captionFromGridAnchor(a) {
    var img = a.querySelector("img[alt]");
    if (!img) return null;
    var alt = (img.getAttribute("alt") || "").replace(/\\u00a0/g, " ").trim();
    if (alt.length < 8) return null;
    if (alt.length < 120 && /^Photo by /i.test(alt) && !/#/.test(alt)) return null;
    return alt;
  }

  function scrapePostLinksFromDom() {
    var seen = {};
    var out = [];
    var links = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
    var i;
    for (i = 0; i < links.length; i++) {
      var a = links[i];
      var norm = normalizePostLink(a.getAttribute("href"));
      if (!norm || seen[norm]) continue;
      seen[norm] = true;
      var cap = captionFromGridAnchor(a);
      out.push({ link: norm, caption: cap });
    }
    return out;
  }

  var user = null;
  var jsonScripts = document.querySelectorAll('script[type="application/json"]');
  for (var a = 0; a < jsonScripts.length; a++) {
    var t = jsonScripts[a].textContent && jsonScripts[a].textContent.trim();
    if (!t) continue;
    var data = tryParse(t);
    if (!data) continue;
    user = findProfileUser(data, 0);
    if (user) break;
  }

  if (!user) {
    var allScripts = document.querySelectorAll("script");
    for (var b = 0; b < allScripts.length; b++) {
      var t2 = allScripts[b].textContent && allScripts[b].textContent.trim();
      if (!t2 || t2.length < 80) continue;
      if (t2.charAt(0) !== "{" && t2.charAt(0) !== "[") continue;
      var data2 = tryParse(t2);
      if (!data2) continue;
      user = findProfileUser(data2, 0);
      if (user) break;
    }
  }

  var domBiography = scrapeBioFromDom();
  var posts = user ? extractPostsFromUser(user) : [];
  if (!posts.length) posts = scrapePostLinksFromDom();
  return {
    user: user,
    ogTitle: ogTitle,
    ogImage: ogImage,
    ogDescription: ogDescription,
    domBiography: domBiography,
    posts: posts
  };
})()
`;

function countFromEdgeFollowedBy(v: unknown): number | null {
  if (!v || typeof v !== "object") return null;
  const c = (v as { count?: unknown }).count;
  return typeof c === "number" && Number.isFinite(c) ? c : null;
}

function pickString(u: RawUser, keys: string[]): string | null {
  for (const k of keys) {
    const v = u[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickBiographyFromUser(u: RawUser | null): string | null {
  if (!u) return null;
  const plain = pickString(u, ["biography", "biography_text"]);
  if (plain) return plain;
  const bwe = u.biography_with_entities;
  if (bwe && typeof bwe === "object" && bwe !== null && "text" in bwe) {
    const t = (bwe as { text?: unknown }).text;
    if (typeof t === "string" && t.trim()) return t.trim();
  }
  return null;
}

function pickProfilePic(u: RawUser): string | null {
  const hd = u.profile_pic_url_hd;
  if (typeof hd === "string" && hd.startsWith("http")) return hd;
  const info = u.hd_profile_pic_url_info;
  if (info && typeof info === "object" && "url" in info) {
    const url = (info as { url?: unknown }).url;
    if (typeof url === "string" && url.startsWith("http")) return url;
  }
  const pic = u.profile_pic_url;
  if (typeof pic === "string" && pic.startsWith("http")) return pic;
  return null;
}

function pickPostsCount(u: RawUser): number | null {
  const edge = u.edge_owner_to_timeline_media;
  if (edge && typeof edge === "object" && "count" in edge) {
    const c = (edge as { count?: unknown }).count;
    if (typeof c === "number" && Number.isFinite(c)) return c;
  }
  const mt = u.media_count;
  if (typeof mt === "number" && Number.isFinite(mt)) return mt;
  return null;
}

function parseOgFollowers(description: string | null): number | null {
  if (!description) return null;
  const m = description.match(/([\d,.]+)\s*([KkMm])?\s*followers/i);
  if (!m?.[1]) return null;
  const raw = m[1].replace(/,/g, "");
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  const mult = m[2]?.toLowerCase();
  if (mult === "k") return Math.round(n * 1000);
  if (mult === "m") return Math.round(n * 1_000_000);
  return n;
}

function parseOgUsername(title: string | null): string | null {
  if (!title) return null;
  const m = title.match(/\(@([a-zA-Z0-9._]+)\)/);
  return m?.[1] ?? null;
}

function parseOgFullName(title: string | null): string | null {
  if (!title) return null;
  const before = title.split("(")[0]?.trim();
  return before && !before.includes("Instagram") ? before : null;
}

function shortcodeFromInstagramUrl(link: string): string | null {
  const m = link.match(/\/(p|reel)\/([^/?#]+)/i);
  return m?.[2] ?? null;
}

function normalizePosts(raw: unknown): InstagramPost[] {
  if (!Array.isArray(raw)) return [];
  const out: InstagramPost[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const link = (item as { link?: unknown }).link;
    if (typeof link !== "string") continue;
    if (!/\/(p|reel)\//i.test(link)) continue;
    const withoutQuery = link.split("?")[0] ?? link;
    const normalized = link.startsWith("http")
      ? withoutQuery
      : `https://www.instagram.com${link.startsWith("/") ? "" : "/"}${link}`;
    const dedupeKey = shortcodeFromInstagramUrl(normalized) ?? normalized;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    const cap = (item as { caption?: unknown }).caption;
    const captionText = typeof cap === "string" ? cap.trim() : "";
    out.push({
      link: normalized,
      caption: captionText.length > 0 ? captionText : null,
    });
  }
  return out;
}

export async function extractProfile(page: Page): Promise<InstagramProfile> {
  const raw = (await page.evaluate(SCRAPE_PROFILE_IN_PAGE)) as ScrapedPayload;

  const u = raw.user;

  const followersFromUser = u
    ? countFromEdgeFollowedBy(u.edge_followed_by) ??
    (typeof u.follower_count === "number" ? u.follower_count : null)
    : null;

  return {
    username: u ? pickString(u, ["username"]) : parseOgUsername(raw.ogTitle),
    fullName: u ? pickString(u, ["full_name", "fullName"]) : parseOgFullName(raw.ogTitle),
    biography: pickBiographyFromUser(u) ?? raw.domBiography ?? null,
    followersCount: followersFromUser ?? parseOgFollowers(raw.ogDescription),
    postsCount: u ? pickPostsCount(u) : null,
    profileImageUrl: u ? pickProfilePic(u) : raw.ogImage,
    posts: normalizePosts(raw.posts),
  };
}
