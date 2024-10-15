# routers/nasdaq100.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import get_all_Nasdaq100
import math
from decimal import Decimal

router = APIRouter()

# Pydantic model for Nasdaq100 response
class Nasdaq100(BaseModel):
    company: str
    stock_price: Optional[float]
    intrinsic_value: Optional[float]
    margin_of_safety: Optional[float]
    rating: Optional[float]
    gross_profit_margin: Optional[float]
    return_on_equity: Optional[float]
    roic: Optional[float]
    sga_to_revenue: Optional[float]
    debt_to_equity: Optional[float]
    current_ratio: Optional[float]
    cash_ratio: Optional[float]
    quick_ratio: Optional[float]
    roa: Optional[float]

def sanitize_float(value):
    """Sanitize float values to ensure they are JSON compliant."""
    if isinstance(value, Decimal):
        value = float(value)  # Convert Decimal to float
    if isinstance(value, float):
        if math.isinf(value) or math.isnan(value):
            return None  # Replace invalid float values with None
    return value

# Endpoint to get all Nasdaq100 components
@router.get("/nasdaq100", response_model=List[Nasdaq100])
async def read_nasdaq100():
    try:
        nasdaq100_components = await get_all_Nasdaq100()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database retrieval error: {str(e)}")
    
    if not nasdaq100_components:
        raise HTTPException(status_code=404, detail="No Nasdaq100 data found")
    
    # Sanitize float values in the response
    sanitized_components = []
    for component in nasdaq100_components:
        sanitized_component = {
            "company": component.company,
            "stock_price": sanitize_float(component.stock_price),
            "intrinsic_value": sanitize_float(component.intrinsic_value),
            "margin_of_safety": sanitize_float(component.margin_of_safety),
            "rating": sanitize_float(component.rating),
            "gross_profit_margin": sanitize_float(component.gross_profit_margin),
            "return_on_equity": sanitize_float(component.return_on_equity),
            "roic": sanitize_float(component.roic),
            "sga_to_revenue": sanitize_float(component.sga_to_revenue),
            "debt_to_equity": sanitize_float(component.debt_to_equity),
            "current_ratio": sanitize_float(component.current_ratio),
            "cash_ratio": sanitize_float(component.cash_ratio),
            "quick_ratio": sanitize_float(component.quick_ratio),
            "roa": sanitize_float(component.roa),
        }

        sanitized_components.append(sanitized_component)
    
    return sanitized_components
