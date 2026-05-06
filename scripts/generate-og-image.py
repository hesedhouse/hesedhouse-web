"""Generate OG image for hesedhouse.net (1200x630px)"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
bg_color = (26, 22, 20)       # ink-black #1A1614
navy = (30, 58, 110)          # royal-court #1E3A6E
gold = (200, 155, 42)         # market-stall #C89B2A
white = (255, 255, 255)
white_soft = (255, 255, 255, 180)

img = Image.new("RGB", (W, H), bg_color)
draw = ImageDraw.Draw(img)

# Top accent bar (gold)
draw.rectangle([0, 0, W, 4], fill=gold)

# Bottom accent bar (navy)
draw.rectangle([0, H - 4, W, H], fill=navy)

# Try to load fonts, fallback to default
def load_font(size, bold=False):
    font_names = [
        "Paperlogy-8ExtraBold.ttf" if bold else "Paperlogy-6SemiBold.ttf",
        "malgun.ttf",
        "malgungbd.ttf" if bold else "malgun.ttf",
        "arial.ttf",
    ]
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except (OSError, IOError):
            pass
    # Try Windows font directory
    winfonts = "C:/Windows/Fonts/"
    for name in font_names:
        try:
            return ImageFont.truetype(os.path.join(winfonts, name), size)
        except (OSError, IOError):
            pass
    return ImageFont.load_default()

font_brand = load_font(64, bold=True)
font_sub = load_font(28)
font_desc = load_font(22)
font_url = load_font(18)

# Brand name
brand_text = "HESEDCORP."
bbox = draw.textbbox((0, 0), brand_text, font=font_brand)
tw = bbox[2] - bbox[0]
draw.text(((W - tw) // 2, 180), brand_text, fill=white, font=font_brand)

# Dot in orange
dot_x = (W - tw) // 2 + tw - draw.textbbox((0, 0), ".", font=font_brand)[2] + draw.textbbox((0, 0), ".", font=font_brand)[0]

# Korean subtitle
sub_text = "IP License · Merchandising · Pop-up · Distribution"
bbox2 = draw.textbbox((0, 0), sub_text, font=font_sub)
tw2 = bbox2[2] - bbox2[0]
draw.text(((W - tw2) // 2, 270), sub_text, fill=gold, font=font_sub)

# Description
desc_text = "캐릭터 IP 라이선스부터 굿즈 제작, 팝업스토어 운영까지"
bbox3 = draw.textbbox((0, 0), desc_text, font=font_desc)
tw3 = bbox3[2] - bbox3[0]
draw.text(((W - tw3) // 2, 340), desc_text, fill=(255, 255, 255, 160), font=font_desc)

# Divider line
line_w = 120
draw.rectangle([(W - line_w) // 2, 400, (W + line_w) // 2, 402], fill=gold)

# URL
url_text = "hesedhouse.net"
bbox4 = draw.textbbox((0, 0), url_text, font=font_url)
tw4 = bbox4[2] - bbox4[0]
draw.text(((W - tw4) // 2, 430), url_text, fill=(255, 255, 255, 120), font=font_url)

# Save
output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "og-default.png")
img.save(output_path, "PNG", optimize=True)
print(f"OG image saved: {output_path}")
print(f"Size: {os.path.getsize(output_path)} bytes")
