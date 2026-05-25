lines = open('src/app/videos/page.tsx', 'r', encoding='utf-8').readlines()
# Remove the orphaned "Join Webinar" and "</a>" lines
lines = [line for i, line in enumerate(lines) if not (i == 322 and line.strip() == 'Join Webinar') and not (i == 323 and line.strip() == '</a>')]
open('src/app/videos/page.tsx', 'w', encoding='utf-8').writelines(lines)
print('Fixed')
