from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from backend.services.pdf_generator import generate_fir_pdf
from backend.database import supabase_client

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/fir/{incident_id}")
async def get_fir_report(incident_id: str):
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Database client not configured")
        
    response = supabase_client.table("incidents").select("*").eq("id", incident_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    incident = response.data[0]
    
    pdf_bytes = generate_fir_pdf(incident)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="FIR_{incident_id}.pdf"'}
    )
