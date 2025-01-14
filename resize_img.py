from PIL import Image
import os

def process_images(images_list, image_path, output_path):
    for number in images_list:
        # Générer le chemin de l'image source et cible
        input_file = os.path.join(image_path, f"article{number}.png")
        output_file = os.path.join(output_path, f"article{number}.webp")

        try:
            # Ouvrir l'image source
            img = Image.open(input_file)

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
            resized_img.save(output_file, "WEBP", quality=85, optimize=True)

            print(f"Image traitée et enregistrée : {output_file}")
        except FileNotFoundError:
            print(f"Image non trouvée : {input_file}")
        except Exception as e:
            print(f"Erreur lors du traitement de l'image {input_file} : {e}")

# Exemple d'utilisation
image_path = "assets/img"
output_path = "assets/img"

# Liste d'images à traiter, exemple avec un intervalle
images_list = list(range(35, ))  # [35, 36, 37, 38, 39]

process_images(images_list, image_path, output_path)
