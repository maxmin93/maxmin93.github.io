#!/bin/bash

# Define the image types to search for
image_types=("*.jpeg" "*.jpg" "*.tiff" "*.tif" "*.png")

# Define cwebp parameters (optional, adjust as needed)
# -q: quality (0-100), -m: compression method (0-6), -mt: multi-threading
CWEBP_PARAMS=("-q 80 -m 6 -mt")

# Iterate over each image type
for type in "${image_types[@]}"; do
  # Find files of the specified image type in the current directory and subdirectories
  find . -type f -iname "$type" | while read -r IMAGE; do
    # Get the filename without extension
    filename_without_extension="${IMAGE%.*}"

    # Convert the image to WebP format
    cwebp $CWEBP_PARAMS "$IMAGE" -o "${filename_without_extension}.webp"
    echo "Converted $IMAGE to ${filename_without_extension}.webp"

    # Optional: Remove the original image after conversion
    # rm -rf "$IMAGE"
  done
done

echo "Conversion complete."
