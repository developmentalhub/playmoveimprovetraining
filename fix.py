lines = open('src/app/videos/page.tsx', 'r', encoding='utf-8').readlines()
new_line = "                    <a href={webinar.zoom_url} target=\"_blank\" rel=\"noopener noreferrer\" className=\"px-6 py-2 rounded-full font-semibold text-white\" style={{backgroundColor: '#7B4FA6'}}>Join Webinar</a>\n"
lines[321:329] = [new_line]
open('src/app/videos/page.tsx', 'w', encoding='utf-8').writelines(lines)
print('Fixed')
