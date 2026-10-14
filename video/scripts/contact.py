"""Contact sheet: python contact.py out.png cols img1 img2 ... (labels = time from filename)."""
import sys, re
from PIL import Image, ImageDraw
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert("RGB") for f in files]
w = max(i.width for i in ims); h = max(i.height for i in ims)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 8) + 8, rows * (h + 30) + 8), (20, 20, 20)); d = ImageDraw.Draw(sheet)
for k, (f, im) in enumerate(zip(files, ims)):
    x, y = 8 + (k % cols) * (w + 8), 8 + (k // cols) * (h + 30)
    sheet.paste(im, (x, y + 22)); m = re.search(r"_(\d+\.\d+)\.jpg", f); d.text((x, y + 4), (m.group(1) + "s") if m else f, fill=(255, 230, 0))
sheet.save(out); print(out)
