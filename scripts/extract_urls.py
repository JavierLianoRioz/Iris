import json

def extract_urls(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    faculties_html = html_content.split('canal_content')
    degree_data = []

    for part in faculties_html[1:]:
        faculty_name_start = part.find('<b>') + 3
        faculty_name_end = part.find('</b>')
        if faculty_name_end == -1: continue
        faculty_name = part[faculty_name_start:faculty_name_end].strip()
        
        degree_parts = part.split('<h4 class="programs">')
        for d_part in degree_parts[1:]:
            # Extract href
            href_start = d_part.find('href="') + 6
            href_end = d_part.find('"', href_start)
            url = d_part[href_start:href_end]
            if not url.startswith('http'):
                url = "https://www.uneatlantico.es" + url
            
            # Extract degree name
            d_name_start = d_part.find('>', href_end) + 1
            d_name_end = d_part.find('</a>', d_name_start)
            degree_name = d_part[d_name_start:d_name_end].strip()
            
            # Clean up if nested
            if '<a' in degree_name:
                degree_name = degree_name[degree_name.find('>')+1:]
            
            degree_data.append({
                "faculty": faculty_name,
                "degree": degree_name,
                "url": url + "#group-plan-de-estudios"
            })
    
    return degree_data

if __name__ == "__main__":
    urls = extract_urls('../data/uneatlantico.html')
    with open('../data/degree_urls.json', 'w', encoding='utf-8') as f:
        json.dump(urls, f, ensure_ascii=False, indent=2)
    print(f"Extracted {len(urls)} degree URLs to ../data/degree_urls.json")
