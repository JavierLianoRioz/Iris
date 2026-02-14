import json
from html.parser import HTMLParser

class UneatlanticoParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.faculties = []
        self.current_faculty = None
        self.in_faculty_h3 = False
        self.in_degree_h4 = False
        self.in_double_degree_table = False
        self.in_td = False
        self.double_degrees = []
        self.current_double_row = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'h3' and 'canal_content' in self.get_parent_classes(attrs_dict):
            # This logic is a bit complex for a simple HTMLParser without a full tree
            pass
        
        # Simple detection based on the observed structure
        if tag == 'h3' and 'canal_content' in str(attrs): # Check container
            pass

    def parse_manually(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        results = {
            "faculties": [],
            "double_degrees": []
        }

        # Manual extraction using string operations for simplicity and robustness in this environment
        # (since I don't have BeautifulSoup installed and I can see the structure)
        
        faculties_html = html_content.split('canal_content')
        for part in faculties_html[1:]:
            faculty_name_start = part.find('<b>') + 3
            faculty_name_end = part.find('</b>')
            if faculty_name_end == -1: continue
            faculty_name = part[faculty_name_start:faculty_name_end].strip()
            
            degrees = []
            degree_parts = part.split('<h4 class="programs">')
            for d_part in degree_parts[1:]:
                d_end = d_part.find('</a></h4>')
                d_start = d_part.find('>') + 1
                degree_name = d_part[d_start:d_end].strip()
                if '<a' in degree_name:
                    degree_name = degree_name[degree_name.find('>')+1:]
                degrees.append(degree_name)
            
            results["faculties"].append({
                "name": faculty_name,
                "degrees": degrees
            })

        # Double degrees extraction
        if '<table class="table table__grade-double">' in html_content:
            table_part = html_content.split('<table class="table table__grade-double">')[1].split('</table>')[0]
            rows = table_part.split('<tr>')
            for row in rows[1:]:
                tds = row.split('<td>')
                if len(tds) < 3: continue
                # First degree
                d1_part = tds[1].split('</td>')[0]
                d1 = d1_part[d1_part.find('>')+1:d1_part.find('</a>')].strip()
                
                # Second degrees (can be multiple)
                d2_part = tds[3].split('</td>')[0]
                d2_list = d2_part.replace('<b>', '').replace('</b>', '').replace('- ', '').split('<br />')
                for d2 in d2_list:
                    d2 = d2.strip()
                    if d2:
                        results["double_degrees"].append(f"Doble Grado en {d1} y {d2}")

        return results

if __name__ == "__main__":
    parser = UneatlanticoParser()
    data = parser.parse_manually('../data/uneatlantico.html')
    with open('../data/degrees.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Degrees saved to ../data/degrees.json")
