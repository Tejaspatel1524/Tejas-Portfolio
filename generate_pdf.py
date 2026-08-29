"""
Generate a PDF portfolio for Tejas J Patel using reportlab.
Creates a beautifully formatted, multi-page PDF resume/portfolio.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import mm, cm
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, Frame
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

OUTPUT_PATH = os.path.join(os.path.expanduser("~"), "Downloads", "Tejas_J_Patel_Portfolio.pdf")

# Colors
BG_DARK = HexColor("#0a0a1a")
BG_CARD = HexColor("#12122a")
ACCENT = HexColor("#6366f1")
ACCENT2 = HexColor("#8b5cf6")
CYAN = HexColor("#06b6d4")
EMERALD = HexColor("#10b981")
ROSE = HexColor("#f43f5e")
AMBER = HexColor("#f59e0b")
TEXT_PRIMARY = HexColor("#e2e8f0")
TEXT_SECONDARY = HexColor("#94a3b8")
TEXT_TERTIARY = HexColor("#64748b")
WHITE = HexColor("#ffffff")

W, H = A4  # 595 x 842 points

def draw_gradient_rect(c, x, y, w, h, color1, color2, steps=50):
    """Draw a simple horizontal gradient rectangle."""
    for i in range(steps):
        ratio = i / steps
        r = color1.red + (color2.red - color1.red) * ratio
        g = color1.green + (color2.green - color1.green) * ratio
        b = color1.blue + (color2.blue - color1.blue) * ratio
        c.setFillColorRGB(r, g, b)
        c.rect(x + (w / steps) * i, y, w / steps + 1, h, fill=1, stroke=0)

def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None):
    """Draw a rounded rectangle."""
    p = c.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.arcTo(x + w - r, y, x + w, y + r, r)
    p.lineTo(x + w, y + h - r)
    p.arcTo(x + w, y + h - r, x + w - r, y + h, r)
    p.lineTo(x + r, y + h)
    p.arcTo(x + r, y + h, x, y + h - r, r)
    p.lineTo(x, y + r)
    p.arcTo(x, y + r, x + r, y, r)
    p.close()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.drawPath(p, fill=1 if fill_color else 0, stroke=1)
    else:
        c.drawPath(p, fill=1 if fill_color else 0, stroke=0)

def draw_tag(c, x, y, text, bg_color=HexColor("#1a1a3a"), text_color=TEXT_SECONDARY, font_size=7):
    """Draw a pill-shaped tag and return its width."""
    text_w = c.stringWidth(text, "Helvetica", font_size)
    tag_w = text_w + 14
    tag_h = 16
    draw_rounded_rect(c, x, y, tag_w, tag_h, 8, fill_color=bg_color)
    c.setFillColor(text_color)
    c.setFont("Helvetica", font_size)
    c.drawString(x + 7, y + 4.5, text)
    return tag_w

def draw_tags_row(c, x, y, tags, max_width, bg_color=HexColor("#1a1a3a"), text_color=TEXT_SECONDARY):
    """Draw tags wrapping to new rows. Returns final y position."""
    cx = x
    cy = y
    for tag in tags:
        tw = c.stringWidth(tag, "Helvetica", 7) + 14
        if cx + tw > x + max_width:
            cx = x
            cy -= 20
        draw_tag(c, cx, cy, tag, bg_color, text_color)
        cx += tw + 6
    return cy

# ============================================
# PAGE 1: HERO + ABOUT
# ============================================
def draw_page1(c):
    # Full page dark background
    c.setFillColor(BG_DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Top accent bar gradient
    draw_gradient_rect(c, 0, H - 8, W, 8, ACCENT, CYAN)

    # --- HERO SECTION ---
    # Decorative circle (faded)
    c.setFillColor(HexColor("#6366f1"))
    c.setFillAlpha(0.06)
    c.circle(W - 80, H - 140, 120, fill=1, stroke=0)
    c.circle(60, H - 300, 80, fill=1, stroke=0)
    c.setFillAlpha(1)

    # Badge
    draw_rounded_rect(c, 40, H - 78, 180, 24, 12, fill_color=HexColor("#1a1a40"))
    c.setFillColor(EMERALD)
    c.circle(54, H - 66, 4, fill=1, stroke=0)
    c.setFillColor(HexColor("#a5b4fc"))
    c.setFont("Helvetica", 8)
    c.drawString(64, H - 70, "Available for opportunities")

    # Name
    c.setFillColor(TEXT_PRIMARY)
    c.setFont("Helvetica", 14)
    c.drawString(40, H - 110, "Hi, I'm")

    # Gradient name effect (simulated with accent color)
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 38)
    c.drawString(40, H - 155, "Tejas J Patel")

    # Subtitle
    c.setFillColor(ACCENT2)
    c.setFont("Helvetica", 16)
    c.drawString(40, H - 180, "AI & Full-Stack Developer")

    # Description
    c.setFillColor(TEXT_SECONDARY)
    c.setFont("Helvetica", 10)
    desc_lines = [
        "I build intelligent, production-grade applications that blend cutting-edge AI",
        "with elegant full-stack engineering. From voice assistants to fintech platforms —",
        "I turn ambitious ideas into polished realities."
    ]
    y = H - 210
    for line in desc_lines:
        c.drawString(40, y, line)
        y -= 15

    # Contact info bar
    y -= 15
    c.setFillColor(CYAN)
    c.setFont("Helvetica", 9)
    c.drawString(40, y, "📧  tejas.241006@gmail.com")
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(230, y, "|")
    c.setFillColor(CYAN)
    c.drawString(245, y, "🔗  github.com/Tejaspatel1524")

    # --- STATS SECTION ---
    y -= 45
    stats = [
        ("8+", "Projects Built"),
        ("15+", "Technologies"),
        ("50K+", "Lines of Code"),
        ("4", "AI/ML Projects"),
    ]
    stat_w = (W - 80 - 30) / 4
    for i, (num, label) in enumerate(stats):
        sx = 40 + i * (stat_w + 10)
        draw_rounded_rect(c, sx, y - 8, stat_w, 55, 8, fill_color=BG_CARD)
        c.setFillColor(ACCENT)
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(sx + stat_w / 2, y + 22, num)
        c.setFillColor(TEXT_TERTIARY)
        c.setFont("Helvetica", 7)
        c.drawCentredString(sx + stat_w / 2, y + 2, label.upper())

    # --- ABOUT SECTION ---
    y -= 50
    draw_gradient_rect(c, 40, y, 60, 3, ACCENT, ACCENT2)
    c.setFillColor(TEXT_PRIMARY)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, y - 25, "About Me")

    c.setFillColor(TEXT_SECONDARY)
    c.setFont("Helvetica", 9.5)
    about_lines = [
        "I'm a passionate AI & Full-Stack Developer who thrives at the intersection of intelligent systems",
        "and human-centered design. My work spans from building real-time ASL recognition tools that empower",
        "the speech-impaired community, to engineering enterprise-grade cyber fraud investigation platforms.",
        "",
        "I believe technology should be purposeful, accessible, and beautiful. Whether it's an AI voice",
        "assistant inspired by Iron Man's JARVIS, a fintech platform that smooths freelancer income, or an",
        "open-source design intelligence tool — every project I build is driven by real-world impact.",
        "",
        "My stack: React, TypeScript, Python, Node.js, FastAPI on the engineering side, and OpenAI, Google",
        "Gemini, LangChain, MediaPipe on the AI side. I'm always learning, always building."
    ]
    y -= 40
    for line in about_lines:
        c.drawString(40, y, line)
        y -= 14

    # --- SKILLS SECTION ---
    y -= 25
    draw_gradient_rect(c, 40, y, 60, 3, ACCENT, CYAN)
    c.setFillColor(TEXT_PRIMARY)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, y - 25, "Skills & Technologies")

    skills = {
        "🎨 Frontend": ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Vite", "Radix UI", "Recharts", "Electron", "PWA"],
        "⚙️ Backend": ["Node.js", "Express", "FastAPI", "Python", "Java", "PostgreSQL", "REST APIs", "WebSockets", "JWT Auth"],
        "🤖 AI & ML": ["OpenAI API", "Google Gemini", "LangChain", "LangGraph", "MediaPipe", "Streaming AI", "Multi-Agent", "Prompt Eng."],
        "🛠️ Tools": ["Git & GitHub", "VS Code", "Streamlit", "Electron Builder", "npm", "Uvicorn", "Service Workers"],
    }

    y -= 45
    for category, items in skills.items():
        if y < 50:
            break
        c.setFillColor(TEXT_PRIMARY)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(40, y, category)
        y -= 18
        y = draw_tags_row(c, 40, y, items, W - 80, HexColor("#1a1a3a"), HexColor("#a5b4fc"))
        y -= 28

    # Bottom accent bar
    draw_gradient_rect(c, 0, 0, W, 4, ACCENT, CYAN)

# ============================================
# PAGE 2 & 3: PROJECTS
# ============================================
projects = [
    {
        "name": "GestureTalk",
        "tagline": "ASL Hand Gesture Recognition",
        "badge": "AI + Accessibility",
        "color": EMERALD,
        "desc": "Real-time American Sign Language recognition tool that converts sign language into speech. Built for the speech-impaired community with ~90% accuracy, supporting 8 languages. Installable as PWA or native Windows desktop app via Electron.",
        "tech": ["MediaPipe", "Web Speech API", "Electron", "PWA", "JavaScript"],
        "highlights": ["A-Z + 0-9 Recognition", "8 Languages TTS", "PWA + Desktop App", "Practice Mode", "4 Color Themes"]
    },
    {
        "name": "J.A.R.V.I.S",
        "tagline": "AI Desktop Voice Assistant",
        "badge": "AI Assistant",
        "color": HexColor("#3b82f6"),
        "desc": "Full-featured AI-powered desktop voice assistant inspired by Iron Man. System tray HUD with wake-word detection, AI chat with tool-calling, system monitoring, and app automation. Streaming responses with exponential backoff.",
        "tech": ["Python", "FastAPI", "OpenAI/Groq", "pywebview", "WebSockets"],
        "highlights": ["Wake Word Detection", "System Tray HUD", "Tool-Calling AI", "System Monitor", "Command Safety"]
    },
    {
        "name": "SentinelAI",
        "tagline": "Cyber Fraud Investigation Platform",
        "badge": "Enterprise Platform",
        "color": ROSE,
        "desc": "AI-powered Cyber Fraud Investigation Intelligence Platform for law enforcement and digital forensic teams. Features case management, intelligence analysis, evidence tracking, entity mapping with ReactFlow, and automated reporting.",
        "tech": ["React", "TypeScript", "Tailwind CSS", "Radix UI", "Recharts", "ReactFlow"],
        "highlights": ["Case Management", "Intelligence Analysis", "Dashboard Analytics", "Auto Reports", "Entity Mapping"]
    },
    {
        "name": "SimplifAI",
        "tagline": "AI-Powered PR Compliance Evaluator",
        "badge": "DevOps AI",
        "color": ACCENT2,
        "desc": "Multi-agent AI pipeline evaluating GitHub PRs against Jira ticket requirements. Uses LangGraph to orchestrate requirement extraction, code analysis, evaluation, test generation, and verdict synthesis with confidence scores.",
        "tech": ["LangGraph", "LangChain", "Google Gemini", "FastAPI", "Streamlit", "Rich CLI"],
        "highlights": ["Multi-Agent Pipeline", "Confidence Scores", "Auto Test Generation", "GitHub Webhooks", "CLI + Web + API"]
    },
    {
        "name": "Income Smoothing Platform",
        "tagline": "FinTech SaaS for Freelancers",
        "badge": "FinTech",
        "color": CYAN,
        "desc": "AI-driven fintech platform for freelancers and gig workers. Features income prediction, smart buffer management, behavioral financial nudges, payout scheduling, and comprehensive security hardening with JWT + rate limiting.",
        "tech": ["React", "Node.js", "Express", "PostgreSQL", "Custom AI", "JWT Auth"],
        "highlights": ["Income Prediction AI", "Buffer Management", "Smart Nudges", "Payout Scheduling", "Security Hardened"]
    },
    {
        "name": "AI Business Automation",
        "tagline": "AI Product Copy & Business Insights",
        "badge": "AI Business",
        "color": AMBER,
        "desc": "Premium web app for AI-powered product descriptions and business analytics. Input product details for SEO-friendly marketing copy, or upload CSV data for actionable business insights with interactive Recharts visualizations.",
        "tech": ["React", "Vite", "Node.js", "OpenAI API", "Recharts", "Express"],
        "highlights": ["AI Copy Generator", "CSV Analytics", "Interactive Charts", "SEO Optimized"]
    },
    {
        "name": "CustBook",
        "tagline": "Smart Customer Manager for Shopkeepers",
        "badge": "PWA",
        "color": HexColor("#ec4899"),
        "desc": "Mobile-friendly Progressive Web App for retail shopkeepers. Manage customers, track purchases, handle pending payments, and generate digital receipts sharable via WhatsApp. Fully offline-capable with localStorage.",
        "tech": ["HTML5", "CSS3", "JavaScript", "PWA", "localStorage"],
        "highlights": ["Customer Directory", "Digital Receipts", "WhatsApp Share", "Offline Mode", "PIN Auth"]
    },
    {
        "name": "UI/UX Pro Max",
        "tagline": "Design Intelligence for AI Coding Assistants",
        "badge": "Open Source",
        "color": ACCENT,
        "desc": "Open-source AI skill providing design intelligence for professional UI/UX. 67 UI styles, 161 color palettes, 57 font pairings, and 161 industry-specific reasoning rules. Adopted by 18+ AI coding platforms.",
        "tech": ["Python", "Node.js CLI", "BM25 Search", "CSV Data", "npm"],
        "highlights": ["67 UI Styles", "161 Color Palettes", "57 Font Pairings", "161 Industry Rules", "npm CLI"]
    },
]

def draw_project_card(c, x, y, project, card_w, card_h):
    """Draw a single project card."""
    # Card background
    draw_rounded_rect(c, x, y, card_w, card_h, 10, fill_color=BG_CARD)

    # Top color stripe
    draw_rounded_rect(c, x, y + card_h - 6, card_w, 6, 0, fill_color=project["color"])

    # Badge
    badge_w = c.stringWidth(project["badge"], "Helvetica-Bold", 6.5) + 12
    draw_rounded_rect(c, x + card_w - badge_w - 10, y + card_h - 24, badge_w, 16, 8, fill_color=HexColor("#0a0a1a"))
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(x + card_w - badge_w - 4, y + card_h - 19, project["badge"])

    # Title
    c.setFillColor(TEXT_PRIMARY)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(x + 14, y + card_h - 38, project["name"])

    # Tagline
    c.setFillColor(project["color"])
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(x + 14, y + card_h - 51, project["tagline"])

    # Description
    c.setFillColor(TEXT_SECONDARY)
    c.setFont("Helvetica", 8)
    words = project["desc"].split()
    lines = []
    current_line = ""
    max_text_w = card_w - 28
    for word in words:
        test = current_line + " " + word if current_line else word
        if c.stringWidth(test, "Helvetica", 8) < max_text_w:
            current_line = test
        else:
            lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)

    dy = y + card_h - 65
    for line in lines[:4]:
        c.drawString(x + 14, dy, line)
        dy -= 12

    # Tech tags
    dy -= 6
    draw_tags_row(c, x + 14, dy, project["tech"], card_w - 28, HexColor("#1e1e3a"), HexColor("#a5b4fc"))

    # Highlights
    dy -= 28
    c.setFillColor(TEXT_TERTIARY)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(x + 14, dy, "KEY HIGHLIGHTS")
    dy -= 14
    c.setFont("Helvetica", 7.5)
    c.setFillColor(TEXT_SECONDARY)
    for hl in project["highlights"][:5]:
        c.drawString(x + 14, dy, "▸  " + hl)
        dy -= 11


def draw_projects_page(c, page_projects, page_num):
    """Draw a page of project cards."""
    c.setFillColor(BG_DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Top accent bar
    draw_gradient_rect(c, 0, H - 8, W, 8, ACCENT, CYAN)

    if page_num == 2:
        # Section title on first projects page
        draw_gradient_rect(c, 40, H - 55, 60, 3, ACCENT, ACCENT2)
        c.setFillColor(TEXT_PRIMARY)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(40, H - 80, "Featured Projects")
        c.setFillColor(TEXT_SECONDARY)
        c.setFont("Helvetica", 10)
        c.drawString(40, H - 97, "AI-powered, full-stack applications built with purpose and passion.")
        start_y = H - 130
    else:
        start_y = H - 40

    card_w = (W - 80 - 20) / 2  # Two columns
    card_h = 230

    for i, proj in enumerate(page_projects):
        col = i % 2
        row = i // 2
        cx = 40 + col * (card_w + 20)
        cy = start_y - (row + 1) * (card_h + 16) + card_h
        draw_project_card(c, cx, cy, proj, card_w, card_h)

    # Bottom accent bar
    draw_gradient_rect(c, 0, 0, W, 4, ACCENT, CYAN)

    # Page number
    c.setFillColor(TEXT_TERTIARY)
    c.setFont("Helvetica", 8)
    c.drawCentredString(W / 2, 14, f"Tejas J Patel — Portfolio  |  Page {page_num}")


# ============================================
# PAGE 4: CONTACT
# ============================================
def draw_contact_page(c):
    c.setFillColor(BG_DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    draw_gradient_rect(c, 0, H - 8, W, 8, ACCENT, CYAN)

    # Section title
    draw_gradient_rect(c, 40, H - 55, 60, 3, ACCENT, ACCENT2)
    c.setFillColor(TEXT_PRIMARY)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(40, H - 80, "Let's Connect")
    c.setFillColor(TEXT_SECONDARY)
    c.setFont("Helvetica", 10)
    c.drawString(40, H - 97, "Have a project in mind or want to collaborate? I'd love to hear from you.")

    y = H - 150

    # Contact cards
    contacts = [
        ("📧", "Email", "tejas.241006@gmail.com", "mailto:tejas.241006@gmail.com"),
        ("💻", "GitHub", "github.com/Tejaspatel1524", "https://github.com/Tejaspatel1524"),
        ("💼", "LinkedIn", "linkedin.com/in/tejas-patel-16b9a0379", "https://www.linkedin.com/in/tejas-patel-16b9a0379"),
    ]

    for icon, label, value, url in contacts:
        draw_rounded_rect(c, 40, y - 10, W - 80, 50, 10, fill_color=BG_CARD)
        c.setFont("Helvetica", 18)
        c.drawString(56, y + 10, icon)
        c.setFillColor(TEXT_PRIMARY)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(90, y + 16, label)
        c.setFillColor(CYAN)
        c.setFont("Helvetica", 10)
        c.drawString(90, y + 1, value)
        y -= 65

    # Closing message
    y -= 30
    draw_rounded_rect(c, 40, y - 10, W - 80, 80, 12, fill_color=BG_CARD)
    c.setFillColor(TEXT_PRIMARY)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(W / 2, y + 45, "Let's build something amazing together.")
    c.setFillColor(TEXT_SECONDARY)
    c.setFont("Helvetica", 10)
    c.drawCentredString(W / 2, y + 25, "I'm currently open to new opportunities, freelance work,")
    c.drawCentredString(W / 2, y + 11, "and exciting collaborations. Drop me a message and let's chat!")

    # Footer
    draw_gradient_rect(c, 0, 0, W, 4, ACCENT, CYAN)
    c.setFillColor(TEXT_TERTIARY)
    c.setFont("Helvetica", 8)
    c.drawCentredString(W / 2, 14, "Tejas J Patel — Portfolio  |  Page 4")
    c.drawCentredString(W / 2, 26, "© 2026 Tejas J Patel. Built with passion & code.")


# ============================================
# GENERATE PDF
# ============================================
def main():
    c = canvas.Canvas(OUTPUT_PATH, pagesize=A4)
    c.setTitle("Tejas J Patel — AI & Full-Stack Developer Portfolio")
    c.setAuthor("Tejas J Patel")
    c.setSubject("Portfolio")

    # Page 1: Hero + About + Skills
    draw_page1(c)
    c.setFillColor(TEXT_TERTIARY)
    c.setFont("Helvetica", 8)
    c.drawCentredString(W / 2, 14, "Tejas J Patel — Portfolio  |  Page 1")
    c.showPage()

    # Page 2: Projects 1-4
    draw_projects_page(c, projects[:4], 2)
    c.showPage()

    # Page 3: Projects 5-8
    draw_projects_page(c, projects[4:], 3)
    c.showPage()

    # Page 4: Contact
    draw_contact_page(c)
    c.showPage()

    c.save()
    print(f"[OK] Portfolio PDF saved to: {OUTPUT_PATH}")
    print(f"     File size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
