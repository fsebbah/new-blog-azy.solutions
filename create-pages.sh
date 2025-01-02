#!/bin/bash

# Définition des chemins
JSON_FILE="assets/json/articles.json"
TEMPLATE_FILE="assets/maquette.html"
POSTS_DIR="posts"
CONTENTS_DIR="assets/contents"
BASE_URL="https://blog.azy.solutions"

# Vérification de l'existence des répertoires et fichiers nécessaires
if [ ! -f "$JSON_FILE" ]; then
    echo "Erreur: Le fichier $JSON_FILE n'existe pas"
    exit 1
fi

if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Erreur: Le fichier template $TEMPLATE_FILE n'existe pas"
    exit 1
fi

if [ ! -d "$POSTS_DIR" ]; then
    echo "Création du répertoire posts..."
    mkdir -p "$POSTS_DIR"
fi

if [ ! -d "$CONTENTS_DIR" ]; then
    echo "Création du répertoire contents..."
    mkdir -p "$CONTENTS_DIR"
fi

# Installation de jq si non présent
if ! command -v jq &> /dev/null; then
    echo "jq n'est pas installé. Installation..."
    sudo apt-get update && sudo apt-get install -y jq
fi

# Fonction pour convertir la date en format français
convert_date() {
    local date_str="$1"
    date -d "$date_str" +"%d/%m/%Y"
}

# Fonction pour créer un fichier HTML vide dans contents
create_empty_content_file() {
    local filename="$3"
    local content_file="$CONTENTS_DIR/${filename%.html}.html"
    
    touch "$content_file"
    echo "Fichier de contenu vide créé : $content_file"
}

# Lecture du JSON et traitement de chaque article
jq -c '.[]' "$JSON_FILE" | while read -r article; do
    # Extraction des données de l'article
    id=$(echo "$article" | jq -r '.id')
    title=$(echo "$article" | jq -r '.title')
    description=$(echo "$article" | jq -r '.description')
    url=$(echo "$article" | jq -r '.url')
    date=$(echo "$article" | jq -r '.date')
    
    # Extraction du nom du fichier de l'URL
    filename=$(basename "$url")
    output_file="$POSTS_DIR/$filename"
    
    # Vérification si le fichier existe déjà
    if [ ! -f "$output_file" ]; then
        echo "Création de $output_file..."
        
        # Conversion de la date au format français
        formatted_date=$(convert_date "$date")
        
        # Copie du template
        cp "$TEMPLATE_FILE" "$output_file"
        
        # Modification des méta-tags et du contenu
        # Mise à jour des balises meta og:title
        sed -i "s|<meta property=\"og:title\" content=\".*\">|<meta property=\"og:title\" content=\"$title\">|g" "$output_file"
        sed -i "s|<meta property=\"twitter:title\" content=\".*\">|<meta property=\"twitter:title\" content=\"$title\">|g" "$output_file"
        
        # Mise à jour des balises meta description
        sed -i "s|<meta property=\"og:description\" content=\".*\">|<meta property=\"og:description\" content=\"$description\">|g" "$output_file"
        sed -i "s|<meta property=\"twitter:description\" content=\".*\">|<meta property=\"twitter:description\" content=\"$description\">|g" "$output_file"
        
        # Mise à jour des balises meta URL
        sed -i "s|<meta property=\"og:url\" content=\".*\">|<meta property=\"og:url\" content=\"$BASE_URL/$url\">|g" "$output_file"
        sed -i "s|<meta property=\"twitter:url\" content=\".*\">|<meta property=\"twitter:url\" content=\"$BASE_URL/$url\">|g" "$output_file"
        
        # Modification du titre H1 (en recherchant le bon contexte)
        sed -i "/<div class=\"tag\">/,/<\/h1>/ s|<h1>.*</h1>|<h1>$title</h1>|" "$output_file"
        
        # Modification de la date de publication (avec le bon contexte)
        sed -i "s|Publié le [0-9]\{2\}/[0-9]\{2\}/[0-9]\{4\}|Publié le $formatted_date|g" "$output_file"
        
        echo "Page créée avec succès : $output_file"
        
        # Création du fichier de contenu vide correspondant
        create_empty_content_file "$title" "$description" "$filename"
    else
        echo "Le fichier $output_file existe déjà"
    fi
done

echo "Traitement terminé"