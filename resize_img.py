from PIL import Image

# Chemin vers l'image
image_path = "assets/img/article34.png"
output_path = "assets/img/article34.webp"

# Ouvrir l'image
img = Image.open(image_path)

# Obtenir les dimensions
width, height = img.size

# Recadrer l'image pour obtenir un carré centré
crop_size = min(width, height)
left = (width - crop_size) // 2
top = (height - crop_size) // 2
right = left + crop_size
bottom = top + crop_size
cropped_img = img.crop((left, top, right, bottom))

# Redimensionner à 480x480
resized_img = cropped_img.resize((480, 480), Image.LANCZOS)

# Enregistrer en WebP avec qualité optimisée
resized_img.save(output_path, "WEBP", quality=85, optimize=True)

print(f"Image traitée et enregistrée : {output_path}")
