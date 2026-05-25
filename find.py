lines = open('src/app/videos/page.tsx', 'r', encoding='utf-8').readlines()
for i, line in enumerate(lines):
    if 'Join Webinar' in line:
        print(f'{i+1}: {repr(line)}')
    if '</a>' in line and i > 318 and i < 330:
        print(f'{i+1}: {repr(line)}')
