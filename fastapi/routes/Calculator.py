from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import (
    insert_calculation_history,
    get_calculation_history_by_user_id,
    delete_calculation_history
)
from sqlalchemy import text
import math
from decimal import Decimal

router = APIRouter()

# Pydantic model for response
class CalHistory(BaseModel):
    history_id: int
    company_name: str
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
    created_at: Optional[datetime]

# Pydantic model for creating and updating history
class CreateCalHistory(BaseModel):
    user_id: int
    username: str
    company_name: str
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
        return float(value)
    if isinstance(value, float) and (math.isinf(value) or math.isnan(value)):
        return None
    return value

# Create a new calculation history record
@router.post("/calculation/create", response_model=CreateCalHistory)
async def create_cal_history(data: CreateCalHistory):
    # Sanitize the float values in the data
    sanitized_data = {key: sanitize_float(value) for key, value in data.dict().items()}

    # Use the database function to insert the data
    record = await insert_calculation_history(sanitized_data)
    
    if record is None:
        raise HTTPException(status_code=400, detail="Error creating history")
    
    return dict(record)

# Get all calculation history records by user_id
@router.get("/calculation/{user_id}", response_model=List[CalHistory])
async def get_calculator_history(user_id: int):
    result = await get_calculation_history_by_user_id(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="No history records found for this user.")
    
    return [dict(record) for record in result]

# Delete a specific calculation history by ID
@router.delete("/calculation/{history_id}")
async def delete_calculator_history(history_id: int):
    record = await delete_calculation_history(history_id)
    
    if record is None:
        raise HTTPException(status_code=404, detail="History record not found")
    
    return {"detail": "History record deleted successfully"}
