from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io

def generate_fir_pdf(incident: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    title_style = styles['Heading1']
    normal_style = styles['Normal']
    
    elements = []
    
    # Title
    elements.append(Paragraph(f"RAKSHAK.AI First Information Report (FIR)", title_style))
    elements.append(Spacer(1, 12))
    
    # Incident Details
    elements.append(Paragraph(f"<b>Incident ID:</b> {incident.get('id')}", normal_style))
    elements.append(Paragraph(f"<b>Timestamp:</b> {incident.get('created_at')}", normal_style))
    elements.append(Paragraph(f"<b>Sender Number:</b> {incident.get('sender_number')}", normal_style))
    elements.append(Paragraph(f"<b>Intent:</b> {incident.get('intent')}", normal_style))
    elements.append(Paragraph(f"<b>Severity:</b> {incident.get('severity')}", normal_style))
    elements.append(Paragraph(f"<b>Location:</b> {incident.get('location')}", normal_style))
    elements.append(Spacer(1, 12))
    
    # Raw Transcript
    elements.append(Paragraph("<b>Raw Message/Transcript:</b>", styles['Heading3']))
    elements.append(Paragraph(f"{incident.get('raw_text')}", normal_style))
    
    doc.build(elements)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
