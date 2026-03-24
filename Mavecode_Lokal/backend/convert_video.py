from PIL import Image, ImageSequence
import subprocess
import os

webp_path = "/Users/amifwahyudiilmi/.gemini/antigravity/brain/438e03c4-1c78-476e-8c3e-6562b861e408/mavecode_demo_v28_1772469958848.webp"
mp4_path = "/Users/amifwahyudiilmi/.gemini/antigravity/brain/438e03c4-1c78-476e-8c3e-6562b861e408/mavecode_demo_v28.mp4"

print(f"Loading {webp_path}...")
img = Image.open(webp_path)

# Prepare ffmpeg command
# libx264 needs width/height to be even
width, height = img.size
if width % 2 != 0: width -= 1
if height % 2 != 0: height -= 1

command = [
    'ffmpeg',
    '-y',
    '-f', 'rawvideo',
    '-vcodec', 'rawvideo',
    '-s', f'{width}x{height}',
    '-pix_fmt', 'rgba',
    '-r', '50', # 50 FPS for ~1 minute duration (3048 frames / 50 = ~61s)
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'ultrafast',
    mp4_path
]

process = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

print("Processing frames (50 FPS)...")
count = 0
try:
    for i, frame in enumerate(ImageSequence.Iterator(img)):
        # Convert frame to RGBA
        frame = frame.convert('RGBA')
        # Ensure even size
        if frame.size[0] % 2 != 0: frame = frame.crop((0, 0, frame.size[0]-1, frame.size[1]))
        if frame.size[1] % 2 != 0: frame = frame.crop((0, 0, frame.size[0], frame.size[1]-1))
        process.stdin.write(frame.tobytes())
        count += 1
        if count % 100 == 0:
            print(f"Frame {count} processed...")
except EOFError:
    pass
except Exception as e:
    print(f"Error: {e}")

stdout, stderr = process.communicate()
if process.returncode != 0:
    print(f"FFmpeg error: {stderr.decode()}")
else:
    print(f"Done! Processed {count} frames. Video saved to {mp4_path}")


