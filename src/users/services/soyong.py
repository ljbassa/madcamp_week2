import cv2
import numpy as np
import sys
import os

def swirl_effect(input_path, output_path, strength=5, radius=300):
    # 이미지 읽기
    image = cv2.imread(input_path)
    if image is None:
        print(f"Error: Could not read image from {input_path}")
        return

    # 중심점 계산
    h, w = image.shape[:2]
    center = (w // 2, h // 2)

    # 소용돌이 효과 적용
    map_x = np.zeros((h, w), dtype=np.float32)
    map_y = np.zeros((h, w), dtype=np.float32)

    for i in range(h):
        for j in range(w):
            dx = j - center[0]
            dy = i - center[1]
            distance = np.sqrt(dx ** 2 + dy ** 2)

            # 소용돌이 효과 계산
            if distance < radius:
                theta = np.arctan2(dy, dx) + strength * (radius - distance) / radius
                map_x[i, j] = center[0] + distance * np.cos(theta)
                map_y[i, j] = center[1] + distance * np.sin(theta)
            else:
                map_x[i, j] = j
                map_y[i, j] = i

    swirl_image = cv2.remap(image, map_x, map_y, interpolation=cv2.INTER_LINEAR)
    cv2.imwrite(output_path, swirl_image)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python swirl_effect.py <input_path> <output_path>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if not os.path.exists(input_path):
        print(f"Error: Input file does not exist: {input_path}")
        sys.exit(1)

    swirl_effect(input_path, output_path)