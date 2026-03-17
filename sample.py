import os
from PIL import Image

folder = r"C:\Users\mdyus\Downloads\portfolio\images\achievements"

skip_file = "blind coding.png"
left_rotate_file = "essay.jpg"

for file in os.listdir(folder):
    path = os.path.join(folder, file)

    if not os.path.isfile(path):
        continue

    if file.lower() == skip_file.lower():
        continue

    try:
        img = Image.open(path)

        if file.lower() == left_rotate_file.lower():
            rotated = img.rotate(90, expand=True)   # left rotate
        else:
            rotated = img.rotate(-90, expand=True)  # right rotate

        rotated.save(path)
        print(f"Processed: {file}")

    except Exception as e:
        print(f"Skipped {file}: {e}")