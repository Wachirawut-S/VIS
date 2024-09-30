from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import get_all_sp500  # Ensure this function is imported
import math
from decimal import Decimal

router = APIRouter()

# Pydantic model for SP500 response
class SP500(BaseModel):
    company: str
    stock_price: Optional[float]  # Allowing null values
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

# Endpoint to get all SP500 components
@router.get("/sp500", response_model=List[SP500])
async def read_sp500():
    sp500_components = await get_all_sp500()

    # # Check original components for debugging
    # print("Original SP500 components:", sp500_components)

    # Sanitize float values in the response
    sanitized_components = []
    for component in sp500_components:
        # Collecting sanitized values
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

        # Debugging output to identify problematic components
        # print("Sanitized component values:", sanitized_component)

        # if any(value is None for value in sanitized_component.values()):
        #     print(f"Sanitized component with None values: {sanitized_component}")

        sanitized_components.append(sanitized_component)

    # Check if the sanitized components list is empty
    if not sanitized_components:
        raise HTTPException(status_code=404, detail="No valid SP500 data found")

    # Try to return the sanitized components
    try:
        return sanitized_components
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Serialization error: {str(e)}")
