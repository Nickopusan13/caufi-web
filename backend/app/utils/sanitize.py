import bleach
import html


def sanitize_html(html_content: str) -> str:
    unescaped_html = html.unescape(html_content)
    allowed_tags = [
        "p",
        "strong",
        "em",
        "u",
        "ul",
        "ol",
        "li",
        "a",
        "br",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "img",
        "span",
    ]
    allowed_attrs = {
        "a": ["href", "title", "target"],
        "img": ["src", "alt", "width", "height"],
        "span": ["style"],
    }
    cleaner = bleach.Cleaner(tags=allowed_tags, attributes=allowed_attrs, strip=True)
    return cleaner.clean(unescaped_html)
