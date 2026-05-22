// =============================================================================
// AVTODAY.IO APEX v3.0 - PRIVATE EDITION FOR QUAN
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "avtoday_quan_apex",
        "name": "AVToday.io APEX (Private)",
        "version": "3.0.0",
        "baseUrl": "https://avtoday.io",
        "iconUrl": "https://avtoday.io/favicon.ico",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed",
        "layoutType": "HORIZONTAL"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'new', title: '🔥 Mới Cập Nhật', type: 'Grid' },
        { slug: 'hot', title: 'Hot Video', type: 'Horizontal' },
        { slug: 'catalog/無碼', title: 'Không Che Uncensored', type: 'Horizontal' },
        { slug: 'catalog/FC2', title: 'FC2 Premium', type: 'Horizontal' },
        { slug: 'catalog/中出', title: 'Creampie', type: 'Horizontal' },
        { slug: 'catalog/巨乳', title: 'Big Tits', type: 'Horizontal' },
        { slug: 'catalog/中文字幕', title: 'Chinese Subtitle', type: 'Horizontal' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Mới Nhất', slug: 'new' },
        { name: 'Hot', slug: 'hot' },
        { name: 'Không Che', slug: 'catalog/無碼' },
        { name: 'FC2', slug: 'catalog/FC2' },
        { name: 'Creampie', slug: 'catalog/中出' },
        { name: '巨乳', slug: 'catalog/巨乳' },
        { name: '中文字幕', slug: 'catalog/中文字幕' },
        { name: '素人', slug: 'catalog/素人' },
        { name: '人妻', slug: 'catalog/人妻' }
    ]);
}

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    var base = "https://avtoday.io/en";

    if (slug === 'new') return base + "/new.html" + (page > 1 ? "?page=" + page : "");
    if (slug === 'hot') return base + "/hot.html" + (page > 1 ? "?page=" + page : "");
    if (slug.startsWith('catalog/')) {
        var cat = slug.replace('catalog/', '');
        return base + "/catalog/" + encodeURIComponent(cat) + ".html" + (page > 1 ? "?page=" + page : "");
    }
    return base + "/" + slug + (page > 1 ? "?page=" + page : "");
}

function getUrlSearch(keyword, filtersJson) {
    var page = JSON.parse(filtersJson || "{}").page || 1;
    return "https://avtoday.io/en/search/" + encodeURIComponent(keyword) + (page > 1 ? "?page=" + page : "");
}

function getUrlDetail(slug) {
    if (slug.includes("http")) return slug;
    return "https://avtoday.io" + (slug.startsWith("/") ? "" : "/") + slug;
}

function parseListResponse(html) {
    var items = [];
    var blocks = html.split(/<a[^>]*href=["']\/en\/video\//i);

    for (var i = 1; i < blocks.length && items.length < 80; i++) {
        var b = blocks[i];
        var linkMatch = b.match(/([^"']+\.html)/i);
        var link = linkMatch ? "/en/video/" + linkMatch[1] : "";

        var titleMatch = b.match(/>([^<]{15,120})<\/a>/i) || b.match(/alt=["']([^"']+)["']/i);
        var title = titleMatch ? titleMatch[1].trim().replace(/<[^>]+>/g, '') : "";

        var thumbMatch = b.match(/src=["']([^"']+\.(jpg|png|webp))["']/i) || b.match(/data-(?:src|original)=["']([^"']+)["']/i);
        var thumb = thumbMatch ? thumbMatch[1] : "";

        var durationMatch = b.match(/(\d{1,2}:\d{2})/);

        if (link && title) {
            items.push({
                id: link,
                title: title,
                posterUrl: thumb ? (thumb.startsWith('//') ? 'https:' + thumb : thumb) : "",
                backdropUrl: thumb ? (thumb.startsWith('//') ? 'https:' + thumb : thumb) : "",
                duration: durationMatch ? durationMatch[1] : "",
                quality: b.includes('無') || b.includes('Uncensored') ? 'UNCENSORED' : 'HD'
            });
        }
    }

    return JSON.stringify({
        items: items,
        pagination: { currentPage: 1, totalPages: 999, hasNext: true }
    });
}

function parseSearchResponse(html) { return parseListResponse(html); }

function parseMovieDetail(html) {
    var title = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<title>(.*?)<\/title>/i);
    title = title ? title[1].replace(/<[^>]+>/g, '').trim() : "AVToday Video";

    var poster = html.match(/og:image["'][^>]*content=["']([^"']+)["']/i);
    poster = poster ? poster[1] : "";

    var embed = html.match(/src=["']([^"']*(?:player|embed|video|cdn)[^"']*)["']/i);
    var embedUrl = embed ? embed[1] : getUrlDetail("");

    return JSON.stringify({
        title: title,
        posterUrl: poster,
        backdropUrl: poster,
        description: "Private APEX for Quan - Full Uncensored JAV • " + new Date().toISOString().split('T')[0],
        servers: [{
            name: "APEX Server",
            episodes: [{ id: embedUrl, name: "▶ Play Full HD", slug: "full" }]
        }],
        quality: "HD / UNCENSORED"
    });
}

function parseDetailResponse(html, url) { return JSON.stringify({ url: url, isEmbed: true, headers: {} }); }
function parseEmbedResponse(html) { return JSON.stringify({ url: "", isEmbed: true }); }
function parseYearsResponse() { return "[]"; }
