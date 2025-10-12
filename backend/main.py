"""
FastAPI Backend for Project Uday
Dynamic Credit Scoring and Guidance System
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import pandas as pd
import os
import uvicorn
import logging

# Import our custom modules
from data_generator import generate_beneficiary_data, save_beneficiary_data
from model import (
    train_initial_model, 
    predict_score, 
    predict_risk_need, 
    update_model,
    UdayScoreModel
)
from explainer import generate_explanation, get_feature_impacts

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Project Uday - Dynamic Credit Scoring API",
    description="AI-powered credit scoring system with dynamic learning and guidance",
    version="1.0.0"
)

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
    details: Optional[str] = None

class SuccessResponse(BaseModel):
    status: str = "success"
    message: str
    data: Optional[Dict[str, Any]] = None

class BeneficiaryResponse(BaseModel):
    id: int
    data: Dict[str, Any]
    score: int
    risk_category: str
    explanation: str

class UpdateRequest(BaseModel):
    beneficiary_id: int
    new_data: Dict[str, Any]

class SimulateRequest(BaseModel):
    current_data: Dict[str, Any]
    hypothetical_changes: Dict[str, Any]

class SimulateResponse(BaseModel):
    current_score: int
    projected_score: int
    score_change: int
    explanation: str

# Global variable to store beneficiary data
beneficiary_data = None

def load_beneficiary_data():
    """Load beneficiary data into memory."""
    global beneficiary_data
    if os.path.exists("beneficiaries.csv"):
        beneficiary_data = pd.read_csv("beneficiaries.csv")
        return True
    return False

def initialize_system():
    """Initialize the system by generating data and training model if needed."""
    global beneficiary_data
    
    # Generate data if it doesn't exist
    if not os.path.exists("beneficiaries.csv"):
        print("Generating beneficiary data...")
        df = generate_beneficiary_data(100)
        save_beneficiary_data(df, "beneficiaries.csv")
    
    # Load data
    load_beneficiary_data()
    
    # Train model if it doesn't exist
    if not os.path.exists("uday_model.joblib"):
        print("Training initial model...")
        train_initial_model("beneficiaries.csv")
        print("Model training completed!")

@app.on_event("startup")
async def startup_event():
    """Initialize system on startup."""
    initialize_system()

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to Project Uday - Dynamic Credit Scoring API",
        "version": "1.0.0",
        "endpoints": {
            "beneficiary": "/beneficiary/{beneficiary_id}",
            "update": "/update",
            "simulate": "/simulate",
            "beneficiaries": "/beneficiaries"
        }
    }

@app.get("/beneficiary/{beneficiary_id}", response_model=BeneficiaryResponse)
async def get_beneficiary(beneficiary_id: int):
    """
    Get beneficiary information, current score, risk category, and explanation.
    
    Args:
        beneficiary_id: ID of the beneficiary
        
    Returns:
        Complete beneficiary profile with AI-generated insights
    """
    global beneficiary_data
    
    if beneficiary_data is None:
        if not load_beneficiary_data():
            logger.error("Beneficiary data not available")
            raise HTTPException(
                status_code=500, 
                detail=ErrorResponse(
                    message="Beneficiary data not available",
                    details="Please ensure the system is properly initialized"
                ).dict()
            )
    
    # Find beneficiary
    beneficiary_row = beneficiary_data[beneficiary_data['beneficiary_id'] == beneficiary_id]
    
    if beneficiary_row.empty:
        logger.warning(f"Beneficiary {beneficiary_id} not found")
        raise HTTPException(
            status_code=404, 
            detail=ErrorResponse(
                message=f"Beneficiary {beneficiary_id} not found",
                details="Please check the beneficiary ID and try again"
            ).dict()
        )
    
    # Extract beneficiary data
    beneficiary_dict = beneficiary_row.iloc[0].to_dict()
    
    # Remove ID and target for prediction
    prediction_data = {k: v for k, v in beneficiary_dict.items() 
                      if k not in ['beneficiary_id', 'creditworthy']}
    
    try:
        # Get predictions
        score = predict_score(prediction_data)
        risk_category = predict_risk_need(prediction_data)
        explanation = generate_explanation(prediction_data)
        
        return BeneficiaryResponse(
            id=beneficiary_id,
            data=prediction_data,
            score=score,
            risk_category=risk_category,
            explanation=explanation
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error processing beneficiary data: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=ErrorResponse(
                message="Error processing beneficiary data",
                details=str(e)
            ).dict()
        )

@app.post("/update")
async def update_beneficiary_model(request: UpdateRequest):
    """
    Update the model with new beneficiary data using online learning.
    
    Args:
        request: Update request containing beneficiary ID and new data
        
    Returns:
        Status of the update operation
    """
    try:
        # Validate input data first
        model_instance = UdayScoreModel()
        is_valid, error_msg = model_instance.validate_data(request.new_data)
        
        if not is_valid:
            logger.warning(f"Invalid data for beneficiary {request.beneficiary_id}: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=ErrorResponse(
                    message="Invalid input data",
                    details=error_msg
                ).dict()
            )
        
        # Add creditworthy label (assume positive update)
        new_data_with_target = {**request.new_data, 'creditworthy': 1}
        
        # Update the model
        result = update_model(new_data_with_target)
        
        # Update in-memory data if successful
        if result.get("status") == "success":
            global beneficiary_data
            if beneficiary_data is not None:
                # Update the beneficiary's data in memory
                mask = beneficiary_data['beneficiary_id'] == request.beneficiary_id
                for key, value in request.new_data.items():
                    if key in beneficiary_data.columns:
                        beneficiary_data.loc[mask, key] = value
                
                # Save updated data
                beneficiary_data.to_csv("beneficiaries.csv", index=False)
                logger.info(f"Updated beneficiary {request.beneficiary_id} data")
        
        return SuccessResponse(
            message="Model updated successfully",
            data=result
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error updating model: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=ErrorResponse(
                message="Error updating model",
                details=str(e)
            ).dict()
        )

@app.post("/simulate", response_model=SimulateResponse)
async def simulate_score(request: SimulateRequest):
    """
    Simulate future score based on hypothetical changes.
    This is the core "What-If" feature of Project Uday.
    
    Args:
        request: Simulation request with current data and hypothetical changes
        
    Returns:
        Current score, projected score, and explanation
    """
    try:
        # Calculate current score
        current_score = predict_score(request.current_data)
        
        # Apply hypothetical changes
        projected_data = {**request.current_data, **request.hypothetical_changes}
        projected_score = predict_score(projected_data)
        
        # Calculate score change
        score_change = projected_score - current_score
        
        # Generate explanation for the projection
        explanation = generate_explanation(projected_data)
        
        # Add specific guidance based on the changes
        if score_change > 0:
            explanation += f" These improvements could increase your score by {score_change} points."
        elif score_change < 0:
            explanation += f" These changes might decrease your score by {abs(score_change)} points."
        else:
            explanation += " These changes would have minimal impact on your current score."
        
        return SimulateResponse(
            current_score=current_score,
            projected_score=projected_score,
            score_change=score_change,
            explanation=explanation
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error simulating score: {str(e)}")

@app.get("/beneficiaries")
async def get_all_beneficiaries():
    """
    Get list of all beneficiaries with basic information.
    
    Returns:
        List of beneficiaries with ID, basic info, and current scores
    """
    global beneficiary_data
    
    if beneficiary_data is None:
        if not load_beneficiary_data():
            raise HTTPException(status_code=500, detail="Beneficiary data not available")
    
    try:
        beneficiaries = []
        
        for _, row in beneficiary_data.iterrows():
            beneficiary_dict = row.to_dict()
            prediction_data = {k: v for k, v in beneficiary_dict.items() 
                             if k not in ['beneficiary_id', 'creditworthy']}
            
            score = predict_score(prediction_data)
            risk_category = predict_risk_need(prediction_data)
            
            beneficiaries.append({
                "id": int(row['beneficiary_id']),
                "score": score,
                "risk_category": risk_category,
                "is_high_need": bool(row.get('is_high_need', 0)),
                "loan_repayment_status": bool(row.get('loan_repayment_status', 0)),
                "monthly_income": int(row.get('monthly_income', 0))
            })
        
        return {
            "total_beneficiaries": len(beneficiaries),
            "beneficiaries": beneficiaries
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving beneficiaries: {str(e)}")

@app.get("/feature-importance")
async def get_feature_importance():
    """
    Get feature importance from the trained model.
    
    Returns:
        Dictionary of feature names and their importance scores
    """
    try:
        model = UdayScoreModel()
        importance = model.get_feature_importance()
        
        if not importance:
            raise HTTPException(status_code=500, detail="Model not available for feature importance")
        
        # Sort by importance
        sorted_importance = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
        
        return {
            "feature_importance": sorted_importance,
            "total_features": len(sorted_importance)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting feature importance: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_available": os.path.exists("uday_model.joblib"),
        "data_available": os.path.exists("beneficiaries.csv"),
        "total_beneficiaries": len(beneficiary_data) if beneficiary_data is not None else 0
    }

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )